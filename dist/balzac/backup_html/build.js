// build.js — génère toutes les pages multilingues à partir d'un layout
// Utilisation : node build.js

const fs = require('fs');
const path = require('path');

const OVERWRITE_EXISTING = true; // passe à true si tu veux forcer l'écrasement

// === ÉQUIPEMENTS (aucun texte pour l'instant, 1 photo par équipement) ===
const EQUIP_ITEMS = [
  {
    key: 'cafe',
    titles: { fr: 'Machine à café (expresso)', en: 'Espresso coffee machine', es: 'Cafetera expreso' },
    cover: '/assets/images/intrucafe.jpg',               // << corrigé (intrucafe.jpg)
    photos: ['/assets/images/intrucafe.jpg'],            // << corrigé (intrucafe.jpg)
    desc: { fr: '', en: '', es: '' }
  },
  {
    key: 'plaque',
    titles: { fr: 'Plaque de cuisson', en: 'Cooktop', es: 'Placa de cocina' },
    cover: '/assets/images/instruplac.jpg',
    photos: ['/assets/images/instruplac.jpg'],
    desc: { fr: '', en: '', es: '' }
  },
  {
    key: 'lave-linge-sechant',
    titles: { fr: 'Lave-linge séchant', en: 'Washer–dryer', es: 'Lavadora–secadora' },
    cover: '/assets/images/instrulv.jpg',
    photos: ['/assets/images/instrulv.jpg'],
    desc: { fr: '', en: '', es: '' }
  },
  {
    key: 'combi-four-microonde',
    titles: { fr: 'Combi four–micro-ondes', en: 'Oven–microwave combo', es: 'Horno–microondas' },
    cover: '/assets/images/equip-combi.jpg',
    photos: [],
    desc: { fr: '', en: '', es: '' }
  },
  {
    key: 'air-conditionne',
    titles: { fr: 'Air conditionné', en: 'Air conditioning', es: 'Aire acondicionado' },
    cover: '/assets/images/equip-ac.jpg',
    photos: [],
    desc: { fr: '', en: '', es: '' }
  }
];

// === À PERSONNALISER ===
const WIFI = {
  SSID: 'Livebox_F510',
  PASSWORD: 'SJFhx6MHkmLjz7N6hD'
};

// 7 sections (modifiable)
const PAGES = [
  'checkin',
  'wifi',
  'equipements',
  'poubelles',
  'regles',
  'quartier',
  'checkout'
];

// Titres par page et par langue
const TITLES = {
  checkin: {
    fr: '🚪 Check-in – Guide visuel',
    en: '🚪 Check-in – Visual guide',
    es: '🚪 Check-in – Guía visual'
  },
  wifi: {
    fr: '📶 Wi-Fi',
    en: '📶 Wi-Fi',
    es: '📶 Wi-Fi'
  },
  equipements: {
    fr: '🧰 Équipements',
    en: '🧰 Equipment',
    es: '🧰 Equipamiento'
  },
  poubelles: {
    fr: '🗑️ Poubelles & tri',
    en: '🗑️ Trash & recycling',
    es: '🗑️ Basuras y reciclaje'
  },
  regles: {
    fr: '📜 Règles de la maison',
    en: '📜 House rules',
    es: '📜 Reglas de la casa'
  },
  quartier: {
    fr: '🗺️ Quartier & conseils',
    en: '🗺️ Neighborhood & tips',
    es: '🗺️ Barrio & consejos'
  },
  checkout: {
    fr: '🚪 Check-out',
    en: '🚪 Check-out',
    es: '🚪 Check-out'
  }
};

// Libellés du menu
const NAV_LABELS = {
  home: { fr: '🏠 Accueil', en: '🏠 Home', es: '🏠 Inicio' }
};

const LANGS = ['fr', 'en', 'es'];

const layoutPath = path.join('templates', 'layout.html');
const layout = fs.readFileSync(layoutPath, 'utf8');

// Génère le HTML du contenu pour chaque page/langue
function pageContent(lang, slug) {
  // === CHECK-IN (FR/EN/ES) — avec adresse Google Maps + 4 étapes ===
  if (slug === 'checkin') {
    const addressLink = `<a href="https://www.google.com/maps?q=8+rue+Balzac,+75008+Paris" target="_blank" rel="noopener">8 rue Balzac, 75008 Paris</a>`;

    if (lang === 'fr') {
      return `
<h2>Étape 1 : Arrivée à l’immeuble</h2>
<img src="/assets/images/paso1.jpg" alt="Entrée de l’immeuble" loading="lazy">
<p>📍 <strong>Adresse :</strong> ${addressLink}</p>
<div class="callout ok"><strong>🟩 Code porte : 4539</strong></div>

<hr>

<h2>Étape 2 : Accès par interphone / digicode</h2>
<img src="/assets/images/paso2.jpg" alt="Interphone / digipad" loading="lazy">
<p>👉 Dirigez-vous vers l’interphone (à droite de l’entrée).<br>
🟩 Cherchez le nom « <strong>KEHRER</strong> » et appuyez sur la cloche.<br>
⏳ Attendez le message sonore <strong>« La porte est ouverte »</strong>.<br>
🚪 Poussez la porte pour entrer.</p>

<hr>

<h2>Étape 3 : Accès à l’appartement</h2>
<img src="/assets/images/paso3.jpg" alt="Couloir + serrure Nuki" loading="lazy">
<p>🚪 Montez au <strong>1er étage</strong> par l’ascenseur ou l’escalier.<br>
➡️ Tournez à droite jusqu’à la <strong>2ᵉ porte à droite</strong>.</p>

<p><strong>📱 Ouverture avec l’app Nuki</strong></p>
<ol>
  <li>Assurez-vous d’avoir <strong>validé l’invitation</strong> reçue (messagerie de votre app de voyage ou <strong>WhatsApp</strong>).</li>
  <li>Activez le <strong>Bluetooth</strong>.</li>
  <li>Ouvrez l’app <strong>Nuki</strong> et appuyez sur <strong>« Ouvrir »</strong>.</li>
  <li>Attendez le signal sonore puis poussez la porte.</li>
</ol>
<div class="callout warn"><strong>🟥 Sécurité :</strong> la serrure Nuki se rebloque automatiquement après 5 minutes et chaque nuit à 22:00.</div>

<h2>🔧 Dépannage – Nuki</h2>
<p><strong>❗ L’app affiche « No access »</strong></p>
<ol>
  <li>Vérifiez que l’<strong>invitation</strong> est bien validée.</li>
  <li>Vérifiez que le <strong>Bluetooth</strong> est activé.</li>
  <li>Collez-vous à la porte, laissez l’app <strong>détecter la serrure</strong>, puis appuyez de nouveau sur <strong>« Ouvrir »</strong>.</li>
</ol>
<div class="callout warn">⚠️ L’application <strong>n’autorise pas l’ouverture avant 15:00</strong> et affichera « No access » sauf accord pour un check-in anticipé.</div>
<p>📱 Besoin d’aide ? <a href="https://wa.me/33782178715?text=Bonjour%2C%20je%20n%E2%80%99arrive%20pas%20%C3%A0%20ouvrir%20la%20serrure%20Balzac%20(Invitation%20OK%2C%20Bluetooth%20OK)." target="_blank" rel="noopener">
  <img src="/assets/images/wa.png" alt="WhatsApp" style="width:60px;height:60px;vertical-align:middle">
</a></p>

<hr>

<h2>Étape 4 : Récupérer les clés et la carte</h2>
<img src="/assets/images/paso4.jpg" alt="Clés et carte d’accès" loading="lazy">
<p>🔑 Les <strong>clés</strong> et la <strong>carte d’accès</strong> sont sur le meuble TV.</p>
<div class="callout warn"><strong>🟥 IMPORTANT :</strong>
  <ul>
    <li>Gardez toujours les <strong>clés avec vous</strong> en sortant (clé physique ou app Nuki).</li>
    <li>La <strong>carte</strong> ouvre les deux portes d’entrée de l’immeuble.</li>
    <li>Après le check-in, <strong>n’utilisez pas l’interphone</strong> (pas d’ouverture à distance).</li>
  </ul>
</div>
      `;
    }

    if (lang === 'en') {
      return `
<h2>Step 1: Arrival at the building</h2>
<img src="/assets/images/paso1.jpg" alt="Building entrance" loading="lazy">
<p>📍 <strong>Address:</strong> ${addressLink}</p>
<div class="callout ok"><strong>🟩 Door code: 4539</strong></div>

<hr>

<h2>Step 2: Intercom / digipad</h2>
<img src="/assets/images/paso2.jpg" alt="Intercom / digipad" loading="lazy">
<p>👉 Go to the intercom (right of the entrance).<br>
🟩 Search for « <strong>KEHRER</strong> » and press the bell.<br>
⏳ Wait for <strong>“The door is open”</strong>.<br>
🚪 Push the door to enter.</p>

<hr>

<h2>Step 3: Apartment door</h2>
<img src="/assets/images/paso3.jpg" alt="Hallway + Nuki smart lock" loading="lazy">
<p>🚪 Go up to the <strong>1st floor</strong> (lift or stairs).<br>
➡️ Turn right to the <strong>2nd door on the right</strong>.</p>

<p><strong>📱 Open with the Nuki app</strong></p>
<ol>
  <li>Ensure you <strong>accepted the invitation</strong> (travel app inbox or <strong>WhatsApp</strong>).</li>
  <li>Enable <strong>Bluetooth</strong>.</li>
  <li>Open <strong>Nuki</strong> and tap <strong>“Open”</strong>.</li>
  <li>Wait for the beep, then push the door.</li>
</ol>
<div class="callout warn"><strong>🟥 Safety:</strong> Nuki auto-locks after 5 minutes and every night at 22:00.</div>

<h2>🔧 Troubleshooting – Nuki</h2>
<p><strong>❗ App shows “No access”</strong></p>
<ol>
  <li>Check the <strong>invitation</strong> is accepted.</li>
  <li>Make sure <strong>Bluetooth</strong> is on.</li>
  <li>Stand close to the door, let the app <strong>detect the lock</strong>, then tap <strong>“Open”</strong> again.</li>
</ol>
<div class="callout warn">⚠️ The app <strong>doesn’t allow opening before 15:00</strong> and will show “No access” unless early check-in was approved.</div>
<p>📱 Need help? <a href="https://wa.me/33782178715?text=Hi%2C%20I%20can%E2%80%99t%20open%20the%20Balzac%20lock%20(Invitation%20OK%2C%20Bluetooth%20OK)." target="_blank" rel="noopener">
  <img src="/assets/images/wa.png" alt="WhatsApp" style="width:60px;height:60px;vertical-align:middle">
</a></p>

<hr>

<h2>Step 4: Collect keys and card</h2>
<img src="/assets/images/paso4.jpg" alt="Keys and access card" loading="lazy">
<p>🔑 The <strong>keys</strong> and <strong>access card</strong> are on the TV console.</p>
<div class="callout warn"><strong>🟥 IMPORTANT:</strong>
  <ul>
    <li>Always keep the <strong>keys</strong> (physical key or Nuki app).</li>
    <li>The <strong>card</strong> opens both entrance doors.</li>
    <li>After check-in, <strong>don’t use the intercom</strong> (no remote opening).</li>
  </ul>
</div>
      `;
    }

    if (lang === 'es') {
      return `
<h2>Paso 1: Llegada al edificio</h2>
<img src="/assets/images/paso1.jpg" alt="Entrada del edificio" loading="lazy">
<p>📍 <strong>Dirección:</strong> ${addressLink}</p>
<div class="callout ok"><strong>🟩 Código de la puerta: 4539</strong></div>

<hr>

<h2>Paso 2: Portero / digipad</h2>
<img src="/assets/images/paso2.jpg" alt="Interfono / digipad" loading="lazy">
<p>👉 Diríjase al portero automático (a la derecha de la entrada).<br>
🟩 Busque « <strong>KEHRER</strong> » y pulse la campana.<br>
⏳ Espere el mensaje <strong>« La puerta está abierta »</strong>.<br>
🚪 Empuje la puerta para entrar.</p>

<hr>

<h2>Paso 3: Acceso al apartamento</h2>
<img src="/assets/images/paso3.jpg" alt="Pasillo + cerradura Nuki" loading="lazy">
<p>🚪 Suba al <strong>1er piso</strong> en ascensor o escaleras.<br>
➡️ Gire a la derecha hasta la <strong>2ª puerta a la derecha</strong>.</p>

<p><strong>📱 Apertura con la app Nuki</strong></p>
<ol>
  <li>Asegúrese de haber <strong>validado la invitación</strong> (bandeja de su app de viaje o <strong>WhatsApp</strong>).</li>
  <li>Active el <strong>Bluetooth</strong>.</li>
  <li>Abra <strong>Nuki</strong> y pulse <strong>« Abrir »</strong>.</li>
  <li>Espere el pitido y empuje la puerta.</li>
</ol>
<div class="callout warn"><strong>🟥 Seguridad:</strong> Nuki se bloquea automáticamente tras 5 minutos y cada noche a las 22:00.</div>

<h2>🔧 Solución de problemas – Nuki</h2>
<p><strong>❗ La app muestra « No access »</strong></p>
<ol>
  <li>Compruebe que la <strong>invitación</strong> esté validada.</li>
  <li>Verifique que el <strong>Bluetooth</strong> esté activado.</li>
  <li>Acérquese a la puerta, deje que la app <strong>detecte la cerradura</strong> y pulse de nuevo <strong>« Abrir »</strong>.</li>
</ol>
<div class="callout warn">⚠️ La app <strong>no permite abrir antes de las 15:00</strong> y mostrará « No access » salvo acuerdo para early check-in.</div>
<p>📱 ¿Necesita ayuda? <a href="https://wa.me/33782178715?text=Hola%2C%20no%20puedo%20abrir%20la%20cerradura%20Balzac%20(Invitaci%C3%B3n%20OK%2C%20Bluetooth%20OK)." target="_blank" rel="noopener">
  <img src="/assets/images/wa.png" alt="WhatsApp" style="width:60px;height:60px;vertical-align:middle">
</a></p>

<hr>

<h2>Paso 4: Recoger llaves y tarjeta</h2>
<img src="/assets/images/paso4.jpg" alt="Llaves y tarjeta de acceso" loading="lazy">
<p>🔑 Las <strong>llaves</strong> y la <strong>tarjeta de acceso</strong> están sobre el mueble de la TV.</p>
<div class="callout warn"><strong>🟥 ATENCIÓN:</strong>
  <ul>
    <li>Lleve siempre las <strong>llaves</strong> (llave física o app Nuki).</li>
    <li>La <strong>tarjeta</strong> abre las dos puertas de entrada.</li>
    <li>Después del check-in, <strong>no use el portero</strong> (no abrimos a distancia).</li>
  </ul>
</div>
      `;
    }

    // fallback improbable
    return `<p>Contenu à venir.</p>`;
  }

  // === ÉQUIPEMENTS (index) ===
  if (slug === 'equipements') {
    return equipIndex(lang);
  }

  // === WI-FI ===
  if (slug === 'wifi') {
    return wifiBlock(lang);
  }

  // === AUTRES PAGES (placeholder simple) ===
  if (slug === 'poubelles')  return poubellesBlock(lang);
  if (slug === 'quartier')   return `<p>Contenu « Quartier » à venir.</p>`;
  if (slug === 'regles')     return `<p>Contenu « Règles » à venir.</p>`;
  if (slug === 'checkout')   return `<p>Contenu « Check-out » à venir.</p>`;

  // Fallback (slug inconnu)
  return `<p>Contenu à venir.</p>`;
}

// Index Équipements (cartes cliquables)
function equipIndex(lang) {
  const t = {
    fr: { more: 'Voir les instructions' },
    en: { more: 'See instructions' },
    es: { more: 'Ver instrucciones' }
  }[lang];

  const cards = EQUIP_ITEMS.map(item => {
    const label = item.titles[lang];
    const href = `/${lang}-equip-${item.key}.html`;
    return `
      <article class="equip-card">
        <h3>${escapeHtml(label)}</h3>
        <a class="btn" href="${href}">${escapeHtml(t.more)}</a>
      </article>
    `;
  }).join('');

  return `
<style>
  .equip-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
  .equip-card{border:1px solid #eee;border-radius:12px;padding:14px;background:#fff}
  .equip-card h3{margin:0 0 10px 0;font-size:1rem}
  .equip-card .btn{display:inline-block;padding:8px 12px;border:1px solid #ddd;border-radius:8px;text-decoration:none}
  .equip-card .btn:hover{background:#f6f6f6}
</style>
<div class="equip-grid">
  ${cards}
</div>`;
}


// Détail Équipement (affiche photos si présentes, pas de texte si vide)
function equipDetailContent(lang, item) {
  const t = {
    fr: { back: '← Retour aux équipements' },
    en: { back: '← Back to equipment' },
    es: { back: '← Volver a equipamiento' }
  }[lang];

  const title = item.titles[lang];
  const mainSrc = (item.photos && item.photos[0]) ? item.photos[0] : item.cover;

  return `
<style>
  .equip-back{display:inline-block;margin:6px 0 12px;text-decoration:none}
  /* Image en grand, non tronquée, responsive */
  .equip-full{
    display:block;
    max-width:100%;
    height:auto;              /* garde les proportions */
    margin:0 auto;
    border-radius:12px;
    border:1px solid #eee;
  }
</style>

<a class="equip-back" href="/${lang}-equipements.html">${escapeHtml(t.back)}</a>

<img class="equip-full" src="${mainSrc}" alt="${escapeAttr(title)}" loading="lazy">
`;
}

// Bloc Wi-Fi
function wifiBlock(lang) {
  const t = {
    fr: { ssid: 'Nom du réseau (SSID)', pwd: 'Mot de passe', copy: 'Copier le mot de passe', copied: 'Copié ✓' },
    en: { ssid: 'Network name (SSID)',  pwd: 'Password',      copy: 'Copy password',       copied: 'Copied ✓' },
    es: { ssid: 'Nombre de la red (SSID)', pwd: 'Contraseña', copy: 'Copiar la contraseña', copied: 'Copiado ✓' }
  }[lang];

  return `
<section id="wifi" class="wifi">
  <p><strong>${t.ssid} :</strong> <span id="ssid">${escapeHtml(WIFI.SSID)}</span></p>
  <p><strong>${t.pwd} :</strong> <span id="pwd">${escapeHtml(WIFI.PASSWORD)}</span></p>
  <button
    style="padding:10px 14px;border:1px solid #ddd;border-radius:8px;background:#fff;cursor:pointer;"
    onclick="navigator.clipboard.writeText('${escapeAttr(WIFI.PASSWORD)}')
      .then(()=>{this.textContent='${escapeAttr(t.copied)}'; setTimeout(()=>{this.textContent='${escapeAttr(t.copy)}'},1500);});">
    ${t.copy}
  </button>
</section>`;
}
// Bloc Poubelles & tri (FR/EN/ES)
function poubellesBlock(lang) {
  const TXT = {
    fr: {
      attTitle: '🟥 Attention',
      att1: 'Veuillez séparer les déchets recyclables (carton / papier / emballages) et les déchets ménagers (restes de nourriture et tout ce qui n’est pas recyclable).',
      note1: 'Veuillez respecter le tri sélectif.',
      note2: 'Concernant les emballages recyclables, veuillez vider le sac poubelle directement dans le conteneur adéquat (couvercle jaune).',
      img1Alt: 'Poubelle dans la cuisine',
      img2Alt: 'Local poubelles'
    },
    en: {
      attTitle: '🟥 Attention',
      att1: 'Please separate recyclables (cardboard / paper / packaging) from household waste (food leftovers and anything non-recyclable).',
      note1: 'Please follow the recycling rules.',
      note2: 'For recyclable packaging, empty the trash bag directly into the proper bin (yellow lid).',
      img1Alt: 'Kitchen bin',
      img2Alt: 'Trash room location'
    },
    es: {
      attTitle: '🟥 Atención',
      att1: 'Separe los residuos reciclables (cartón / papel / envases) de los residuos domésticos (restos de comida y todo lo no reciclable).',
      note1: 'Respete la separación selectiva.',
      note2: 'Para los envases reciclables, vacíe la bolsa directamente en el contenedor adecuado (tapa amarilla).',
      img1Alt: 'Papelera de la cocina',
      img2Alt: 'Ubicación del cuarto de basuras'
    }
  }[lang];

  return `
<style>
  .trash-img{display:block;max-width:100%;height:auto;border-radius:12px;border:1px solid #eee;margin:0 auto}
  .trash-section{margin-top:16px}
  .trash-notes{margin-top:10px}
  .trash-notes li{margin:6px 0}
</style>

<!-- Photo 1 : poubelle cuisine (grand, non rogné) -->
<img class="trash-img" src="/assets/images/poubelle1.jpg" alt="${escapeAttr(TXT.img1Alt)}" loading="lazy">

<!-- Bloc d’attention (même style que check-in: .callout.warn) -->
<div class="callout warn trash-section"><strong>${escapeHtml(TXT.attTitle)} :</strong>
  <ul class="trash-notes">
    <li>${escapeHtml(TXT.att1)}</li>
  </ul>
</div>

<!-- Photo 2 : local poubelles -->
<div class="trash-section">
  <img class="trash-img" src="/assets/images/poubelles2.jpg" alt="${escapeAttr(TXT.img2Alt)}" loading="lazy">
</div>

<!-- Notes sous la 2e photo -->
<ul class="trash-notes">
  <li>${escapeHtml(TXT.note1)}</li>
  <li>${escapeHtml(TXT.note2)}</li>
</ul>
`;
}

// Navigation
function buildNav(currentLang, currentSlug) {
  const pages = PAGES.map(slug => {
    const title = TITLES[slug]?.[currentLang] || slug;
    const href  = `/${currentLang}-${slug}.html`;
    const active = slug === currentSlug ? ' data-active="1"' : '';
    return `<a href="${href}"${active}>${escapeHtml(title)}</a>`;
  }).join('');

  const langSwitch = LANGS.map(l => {
    const href = `/${l}-${currentSlug}.html`;
    const active = l === currentLang ? ' data-active="1"' : '';
    return `<a href="${href}"${active}>${l.toUpperCase()}</a>`;
  }).join('');

  return `
<nav class="topbar">
  <button id="burger-btn" class="burger" aria-label="Menu" aria-expanded="false">☰</button>
  <a id="home-btn" class="home" href="#" aria-label="Accueil" data-lang="${currentLang}">🏠</a>
</nav>

<div id="nav-panel" class="nav-panel" aria-hidden="true">
  <div class="nav-section">
    <div class="nav-title">Pages</div>
    ${pages}
  </div>
  <div class="nav-section">
    <div class="nav-title">Langues</div>
    ${langSwitch}
  </div>
</div>

<style>
  .topbar{position:sticky;top:0;display:flex;align-items:center;justify-content:space-between;gap:8px;
    padding:10px 12px;border:1px solid #eee;border-radius:12px;background:#fff;z-index:10001}
  .topbar .home{text-decoration:none;font-size:1.2rem}
  .topbar .burger{font-size:1.2rem;line-height:1;border:1px solid #ddd;background:#fff;border-radius:8px;padding:6px 10px;cursor:pointer}

  .nav-panel{position:fixed;left:0;right:0;top:0;bottom:0;background:#fff;
    border-top:1px solid #eee;box-shadow:0 8px 24px rgba(0,0,0,.08);
    transform:translateY(-12px);opacity:0;pointer-events:none;transition:.18s ease;z-index:10000;overflow:auto}
  .nav-panel.open{transform:translateY(0);opacity:1;pointer-events:auto}
  .nav-section{padding:12px;max-width:640px;margin:0 auto}
  .nav-title{font-weight:600;margin:6px 0 8px 0}
  .nav-panel a{display:block;padding:8px 10px;border-radius:8px;text-decoration:none}
  .nav-panel a:hover{background:#f6f6f6}
  .nav-panel a[data-active="1"]{background:#efefef;font-weight:600}
</style>

<script>
(function(){
  var burger = document.getElementById('burger-btn');
  var panel  = document.getElementById('nav-panel');
  if (burger && panel){
    burger.addEventListener('click', function(){
      var open = panel.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
  }
  var home = document.getElementById('home-btn');
  if (home){
    home.addEventListener('click', function(e){
      e.preventDefault();
      var L = home.getAttribute('data-lang') || 'en';
      var isSummary = new RegExp('^/'+L+'\\.html$').test(location.pathname);
      location.href = isSummary ? '/index.html' : '/'+L+'.html';
    });
  }
})();
</script>
`;
}


function renderPage(lang, slug) {
  const title = TITLES[slug]?.[lang] || `${slug}`;
  const html = layout
    .replaceAll('{{lang}}', lang)
    .replaceAll('{{title}}', escapeHtml(title))
    .replaceAll('{{nav}}', buildNav(lang, slug))
    .replaceAll('{{content}}', pageContent(lang, slug));
  return html;
}

function ensureWriteFile(filePath, content) {
  if (!OVERWRITE_EXISTING && fs.existsSync(filePath)) {
    console.log('⏭️  Existe déjà, je saute :', filePath);
    return;
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Généré :', filePath);
}

function escapeHtml(s = '') {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
function escapeAttr(s = '') {
  return String(s)
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
    .replaceAll('"', '\\"');
}

// === Build ===
(function build() {
  console.log('🛠️  Génération des pages…');

  // Pages classiques (PAGES)
  LANGS.forEach(lang => {
    PAGES.forEach(slug => {
      const outName = `${lang}-${slug}.html`;
      const outPath = path.join('.', outName);
      const html = renderPage(lang, slug);
      ensureWriteFile(outPath, html);
    });
  });

  // Pages DÉTAIL d'équipements
  LANGS.forEach(lang => {
    EQUIP_ITEMS.forEach(item => {
      const slug = `equip-${item.key}`;
      const outName = `${lang}-${slug}.html`;
      const outPath = path.join('.', outName);

      const pageTitle = `🧰 ${item.titles[lang]}`;
      const html = layout
        .replaceAll('{{lang}}', lang)
        .replaceAll('{{title}}', escapeHtml(pageTitle))
        .replaceAll('{{nav}}', buildNav(lang, slug))
        .replaceAll('{{content}}', equipDetailContent(lang, item));

      ensureWriteFile(outPath, html);
    });
  });

  console.log('🎉 Fini. Ouvre par ex. ./fr-wifi.html dans le navigateur.');
})();
