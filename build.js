const fs = require('fs');
const path = require('path');

const root = __dirname;
const dataPath = path.join(root, 'data', 'balzac.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const whatsappClean = (data.contact && data.contact.whatsapp)
  ? data.contact.whatsapp.replace(/[^\d]/g, '')
  : '';

const outDir = path.join(root, 'dist', 'balzac');
fs.mkdirSync(outDir, { recursive: true });

function render(templateName, outFile) {
  const tplPath = path.join(root, 'templates', templateName);
  let tpl = fs.readFileSync(tplPath, 'utf8');

  tpl = tpl.replace(/{{WIFI_SSID}}/g, data.wifi.ssid);
  tpl = tpl.replace(/{{WIFI_PASSWORD}}/g, data.wifi.password);
  tpl = tpl.replace(/{{WHATSAPP}}/g, whatsappClean);

  const outPath = path.join(outDir, outFile);
  fs.writeFileSync(outPath, tpl, 'utf8');
  console.log(`Generated: ${outPath}`);
}

render('wifi-fr.html', 'fr-wifi.html');
render('wifi-en.html', 'en-wifi.html');
render('wifi-es.html', 'es-wifi.html');
