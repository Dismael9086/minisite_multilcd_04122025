const fs = require('fs');
const path = require('path');

const root = __dirname;

function loadData(slug) {
  const dataPath = path.join(root, 'data', slug + '.json');
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function cleanWhatsapp(raw) {
  return (raw || '').replace(/[^\d]/g, '');
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function renderTemplate(slug, templateName, outFile, replacements) {
  const tplPath = path.join(root, 'templates', templateName);
  let tpl = fs.readFileSync(tplPath, 'utf8');

  Object.entries(replacements).forEach(([key, value]) => {
    const safe = value == null ? '' : String(value);
    const re = new RegExp('{{' + key + '}}', 'g');
    tpl = tpl.replace(re, safe);
  });

  const outDir = path.join(root, 'dist', slug);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, outFile);
  fs.writeFileSync(outPath, tpl, 'utf8');
  console.log('Generated:', slug, '→', outFile);
}

function buildOne(slug) {
  const data = loadData(slug);
  const whatsapp = cleanWhatsapp(data.contact && data.contact.whatsapp);

  const srcDir = path.join(root, slug);
  const outDir = path.join(root, 'dist', slug);
  copyDir(srcDir, outDir);

  renderTemplate(slug, 'wifi-fr.html', 'fr-wifi.html', {
    WIFI_SSID: data.wifi.ssid,
    WIFI_PASSWORD: data.wifi.password,
    WHATSAPP: whatsapp
  });
  renderTemplate(slug, 'wifi-en.html', 'en-wifi.html', {
    WIFI_SSID: data.wifi.ssid,
    WIFI_PASSWORD: data.wifi.password,
    WHATSAPP: whatsapp
  });
  renderTemplate(slug, 'wifi-es.html', 'es-wifi.html', {
    WIFI_SSID: data.wifi.ssid,
    WIFI_PASSWORD: data.wifi.password,
    WHATSAPP: whatsapp
  });

  renderTemplate(slug, 'checkin-fr.html', 'fr-checkin.html', {
    CHECKIN_ADDRESS: data.checkin.address,
    CHECKIN_FLOOR: data.checkin.floor,
    CHECKIN_DOOR_CODE: data.checkin.door_code,
    CHECKIN_ARRIVAL_FROM: data.checkin.arrival_window.from,
    CHECKIN_ARRIVAL_TO: data.checkin.arrival_window.to,
    CHECKIN_LATE_POLICY_FR: data.checkin.late_checkin_policy.fr,
    CHECKIN_PARKING_SPOT: data.checkin.parking_spot,
    CHECKIN_PARKING_INSTR_FR: data.checkin.parking_instructions.fr,
    WHATSAPP: whatsapp
  });
  renderTemplate(slug, 'checkin-en.html', 'en-checkin.html', {
    CHECKIN_ADDRESS: data.checkin.address,
    CHECKIN_FLOOR: data.checkin.floor,
    CHECKIN_DOOR_CODE: data.checkin.door_code,
    CHECKIN_ARRIVAL_FROM: data.checkin.arrival_window.from,
    CHECKIN_ARRIVAL_TO: data.checkin.arrival_window.to,
    CHECKIN_LATE_POLICY_EN: data.checkin.late_checkin_policy.en,
    CHECKIN_PARKING_SPOT: data.checkin.parking_spot,
    CHECKIN_PARKING_INSTR_EN: data.checkin.parking_instructions.en,
    WHATSAPP: whatsapp
  });
  renderTemplate(slug, 'checkin-es.html', 'es-checkin.html', {
    CHECKIN_ADDRESS: data.checkin.address,
    CHECKIN_FLOOR: data.checkin.floor,
    CHECKIN_DOOR_CODE: data.checkin.door_code,
    CHECKIN_ARRIVAL_FROM: data.checkin.arrival_window.from,
    CHECKIN_ARRIVAL_TO: data.checkin.arrival_window.to,
    CHECKIN_LATE_POLICY_ES: data.checkin.late_checkin_policy.es,
    CHECKIN_PARKING_SPOT: data.checkin.parking_spot,
    CHECKIN_PARKING_INSTR_ES: data.checkin.parking_instructions.es,
    WHATSAPP: whatsapp
  });
}

buildOne('balzac');
buildOne('basfour');
