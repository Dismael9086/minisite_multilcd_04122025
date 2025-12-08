const fs = require('fs');
const path = require('path');

const root = __dirname;
const SLUGS = ['balzac'];

function loadData(slug) {
  const p = path.join(root, 'data', slug + '.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function resolvePath(obj, pathStr) {
  if (!pathStr) return '';
  const parts = pathStr.split('.');
  let current = obj;

  for (let part of parts) {
    const m = part.match(/^([^\[]+)\[(\d+)\]$/);
    if (m) {
      const key = m[1];
      const idx = parseInt(m[2], 10);
      current = current && current[key];
      if (!Array.isArray(current) || current[idx] === undefined) return '';
      current = current[idx];
    } else {
      current = current && current[part];
    }
    if (current === undefined || current === null) return '';
  }
  if (typeof current === 'object') return '';
  return String(current);
}

function applyPlaceholders(html, data) {
  return html.replace(/\[\[([^\]]+)\]\]/g, (match, pathStr) => {
    return resolvePath(data, pathStr.trim());
  });
}

function processDir(srcDir, destDir, data) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      processDir(srcPath, destPath, data);
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.html')) {
        const raw = fs.readFileSync(srcPath, 'utf8');
        const rendered = applyPlaceholders(raw, data);
        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(destPath, rendered, 'utf8');
        console.log('Rendered HTML:', destPath);
      } else {
        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.copyFileSync(srcPath, destPath);
        console.log('Copied asset:', destPath);
      }
    }
  }
}

function buildSlug(slug) {
  const data = loadData(slug);
  const srcDir = path.join(root, slug);
  const destDir = path.join(root, 'dist', slug);

  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }

  processDir(srcDir, destDir, data);
}

for (const slug of SLUGS) {
  buildSlug(slug);
}
