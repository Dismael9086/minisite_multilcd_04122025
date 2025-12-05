// build.js — génère toutes les pages multilingues à partir d'un layout
// Utilisation : node build.js
// Petite fonction de nettoyage pour éviter que le HTML casse
function safeHTML(html) {
  return html
    .replace(/[\r\t]+/g, '')       // enlève les tabulations
    .replace(/\n{3,}/g, '\n\n')    // enlève les trous trop grands
    .replace(/<\/div>\s*<\/div>/g, '</div>') // enlève un div en trop
    .trim();
}
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
// === LIEUX DU QUARTIER (pour la page Quartier) ===
const PLACES = [
  {
    key: 'maison-lucie',
    category: 'bakery',
    names: {
      fr: 'Maison Lucie',
      en: 'Maison Lucie',
      es: 'Maison Lucie'
    },
    address: '25 rue de Berri, 75008 Paris',
    mapsUrl: 'https://maps.app.goo.gl/8BNXbkPKjbwhbCUa6',
    desc: {
      fr: 'Boulangerie de quartier, idéale pour acheter la traditionnelle baguette française et des viennoiseries à emporter.',
      en: 'Local bakery, perfect for a traditional French baguette and pastries to go.',
      es: 'Panadería de barrio, ideal para comprar la tradicional baguette francesa y bollería para llevar.'
    }
  },
  {
    key: 'paul-cafe',
    category: 'bakery',
    names: {
      fr: 'Paul le Café',
      en: 'Paul le Café',
      es: 'Paul le Café'
    },
    address: '84 Av. des Champs-Élysées, 75008 Paris',
    mapsUrl: 'https://maps.app.goo.gl/sjgk6A4EtU4tkEjy8',
    desc: {
      fr: 'Boulangerie–café sur les Champs-Élysées, parfait pour un petit-déjeuner ou une pause gourmande.',
      en: 'Bakery–café on the Champs-Élysées, great for breakfast or a sweet break.',
      es: 'Panadería–cafetería en los Campos Elíseos, perfecta para desayunar o tomar algo dulce.'
    }
  },
  {
    key: 'sir-winston',
    category: 'brasserie',
    names: {
      fr: 'Brasserie Sir Winston',
      en: 'Brasserie Sir Winston',
      es: 'Brasserie Sir Winston'
    },
    address: '5 Rue de Presbourg, 75016 Paris',
    mapsUrl: 'https://maps.app.goo.gl/8BQNfFUa9p3v4qNe7',
    desc: {
      fr: 'Brasserie raffinée de style colonial, cuisine indienne et britannique, cocktails.',
      en: 'Refined colonial-style brasserie serving Indian and British classics, plus cocktails.',
      es: 'Brasserie refinada de estilo colonial con cocina india y británica y cócteles.'
    }
  },
  {
    key: 'brasserie-balzac',
    category: 'brasserie',
    names: {
      fr: 'Brasserie Le Balzac',
      en: 'Brasserie Le Balzac',
      es: 'Brasserie Le Balzac'
    },
    address: '29 Av. de Friedland, 75008 Paris',
    mapsUrl: 'https://maps.app.goo.gl/hsDDYTdNfEaAsdsH7',
    desc: {
      fr: 'Brasserie décontractée avec terrasse, plats maison et petit-déjeuner. Idéale pour café, déjeuner ou verre en bas de l’appartement.',
      en: 'Casual brasserie with terrace serving homemade dishes and breakfast. Ideal for coffee, lunch or a drink just downstairs.',
      es: 'Brasserie informal con terraza, platos caseros y desayuno. Ideal para un café, almorzar o tomar algo justo debajo del apartamento.'
    }
  },
  {
    key: 'bistrot-arsene',
    category: 'brasserie',
    names: {
      fr: 'Bistrot d’Arsène',
      en: 'Bistrot d’Arsène',
      es: 'Bistrot d’Arsène'
    },
    address: '10 Rue Arsène Houssaye, 75008 Paris',
    mapsUrl: 'https://maps.app.goo.gl/bDLNKvmtXpVCpWwJ9',
    desc: {
      fr: 'Bistrot convivial servant une cuisine française traditionnelle, en terrasse ou en salle cosy.',
      en: 'Friendly bistro serving traditional French dishes, with terrace and cosy interior.',
      es: 'Bistró acogedor con cocina francesa tradicional, terraza y sala agradable.'
    }
  },
  {
    key: 'cocottes',
    category: 'restaurant',
    names: {
      fr: 'Les Cocottes Arc de Triomphe',
      en: 'Les Cocottes Arc de Triomphe',
      es: 'Les Cocottes Arc de Triomphe'
    },
    address: '14 Rue Beaujon, 75008 Paris',
    mapsUrl: 'https://maps.app.goo.gl/uCVCUpkWYjqv8q5n9',
    desc: {
      fr: 'Restaurant chic au décor contemporain, spécialités françaises servies en cocottes.',
      en: 'Stylish restaurant with contemporary décor, serving refined French dishes in cocottes.',
      es: 'Restaurante elegante de estilo contemporáneo que sirve cocina francesa en cocottes.'
    }
  },
  {
    key: 'sens-unique',
    category: 'restaurant',
    names: {
      fr: 'Le Sens Unique',
      en: 'Le Sens Unique',
      es: 'Le Sens Unique'
    },
    address: '47 Rue de Ponthieu, 75008 Paris',
    mapsUrl: 'https://maps.app.goo.gl/TSf9XzAqiLcca2Mm6',
    desc: {
      fr: 'Restaurant chic avec bar à vin, plats haut de gamme dans un cadre luxueux en briques apparentes.',
      en: 'Upscale restaurant with wine bar, high-end dishes in a luxurious, brick-walled setting.',
      es: 'Restaurante elegante con bar de vinos, platos de alta gama en un entorno lujoso de ladrillo visto.'
    }
  },
  {
    key: 'galanga',
    category: 'restaurant',
    names: {
      fr: 'Galanga par Monsieur George',
      en: 'Galanga by Monsieur George',
      es: 'Galanga by Monsieur George'
    },
    address: '17 Rue Washington, 75008 Paris',
    mapsUrl: 'https://maps.app.goo.gl/ojf6CGFKuBgQSkkV9',
    desc: {
      fr: 'Restaurant gastronomique à l’ambiance chic, avec plats signatures.',
      en: 'Fine-dining restaurant with chic atmosphere and signature dishes.',
      es: 'Restaurante gastronómico de ambiente chic con platos de autor.'
    }
  },
  {
    key: 'cafe-paris-friedland',
    category: 'cafe',
    names: {
      fr: 'Le Café de Paris Friedland',
      en: 'Le Café de Paris Friedland',
      es: 'Le Café de Paris Friedland'
    },
    address: '45 Av. de Friedland, 75008 Paris',
    mapsUrl: 'https://maps.app.goo.gl/Cid2xJCxsYwXPEoX6',
    desc: {
      fr: 'Café avec terrasse vue Arc de Triomphe, typiquement parisien pour un café ou un verre.',
      en: 'Café with terrace and Arc de Triomphe view, typical Parisian spot for coffee or a drink.',
      es: 'Cafetería con terraza y vistas al Arco de Triunfo, típica parada parisina para un café o una copa.'
    }
  },
  {
    key: 'terre-azur',
    category: 'cafe',
    names: {
      fr: 'Terre d’Azur – Arc de Triomphe',
      en: 'Terre d’Azur – Arc de Triomphe',
      es: 'Terre d’Azur – Arc de Triomphe'
    },
    address: '10 Av. de Wagram, 75008 Paris',
    mapsUrl: 'https://maps.app.goo.gl/PTKqmgroKsUsD9rSA',
    desc: {
      fr: 'Coffee shop / brunch à quelques minutes à pied, très pratique pour le petit-déjeuner.',
      en: 'Coffee shop / brunch a few minutes’ walk away, perfect for breakfast.',
      es: 'Coffee shop / brunch a pocos minutos a pie, perfecto para el desayuno.'
    }
  },
  {
    key: 'pharmacie-friedland',
    category: 'pharmacy',
    names: {
      fr: 'Pharmacie Friedland',
      en: 'Pharmacie Friedland',
      es: 'Pharmacie Friedland'
    },
    address: '29 Av. de Friedland, 75008 Paris',
    mapsUrl: 'https://maps.app.goo.gl/tLqUNAYDaVKjsM3w8',
    desc: {
      fr: 'Pharmacie de quartier, ouverte jusqu’à 20h00 environ.',
      en: 'Local pharmacy, open until around 8:00 pm.',
      es: 'Farmacia de barrio, abierta hasta las 20:00 aprox.'
    }
  },
  {
    key: 'pharmacie-24-7',
    category: 'pharmacy24',
    names: {
      fr: 'Pharmacie de la Porte Maillot (24/7)',
      en: 'Porte Maillot Pharmacy (24/7)',
      es: 'Farmacia Porte Maillot (24/7)'
    },
    address: '68 Av. de la Grande Armée, 75017 Paris',
    mapsUrl: 'https://maps.app.goo.gl/KKQgY8swZQGZAPd88',
    desc: {
      fr: 'Pharmacie de garde ouverte 24h/24 et 7j/7.',
      en: '24/7 on-duty pharmacy.',
      es: 'Farmacia de guardia abierta 24/7.'
    }
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
  'quartier',
  'poubelles',
  'regles',
  'transport',
  'consigne',
  'checkout'
];

// Titres par page et par langue
// Titres par page et par langue
const TITLES = {
  checkin: {
    fr: '🚪 Instructions d’arrivée',
    en: '🚪 Check-in instructions',
    es: '🚪 Instrucciones de llegada'
  },
  wifi: {
    fr: '📶 WI-FI',
    en: '📶 WI-FI',
    es: '📶 WI-FI'
  },
  equipements: {
    fr: '🛠️ Utilisation des équipements',
    en: '🛠️ How to use the equipment',
    es: '🛠️ Uso de los equipos'
  },
  quartier: {
    fr: '🗺️ Quartier et recommandations',
    en: '🗺️ Neighborhood & recommendations',
    es: '🗺️ Barrio y recomendaciones'
  },
  poubelles: {
    fr: '🗑️ Accès poubelles',
    en: '🗑️ Waste disposal',
    es: '🗑️ Acceso a basuras'
  },
  regles: {
    fr: '📜 Règlement intérieur',
    en: '📜 House rules',
    es: '📜 Reglamento interior'
  },
  transport: {
  fr: '🚕 Transports et parking véhicule',
  en: '🚕 Transportation & vehicle parking',
  es: '🚕 Transporte y estacionamiento'

  },
  consigne: {
    fr: '🧳 Consigne bagages',
    en: '🧳 Luggage storage',
    es: '🧳 Consigna de equipaje'
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
<div class="callout warn"><strong>🟥 Sécurité :</strong> la serrure Nuki se verrouille automatiquement après 5 minutes et chaque nuit à 22:00.</div>

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
    <li>Gardez toujours les <strong>clés avec vous</strong> en sortant (clé physique).</li>
    <li>La <strong>carte</strong> ouvre les deux portes d’entrée de l’immeuble.</li>
    <li>Après le check-in, <strong>n’utilisez pas l’interphone</strong> (pas d’ouverture à distance).</li>
  </ul>
</div>
<!-- Bloc instructions Nuki intérieur -->
<style>
  .nuki-inline{
    display:flex;
    align-items:flex-start;
    gap:20px;
    margin:25px 0;
  }
  .nuki-inline img{
    width:50%;               /* EXACTEMENT la moitié de la largeur */
    height:auto;
    max-width:50%;
    border-radius:12px;
    border:1px solid #eee;
    display:block;
    object-fit:contain;
  }
  .nuki-inline .nuki-text{
    flex:1;
    font-size:.95rem;
    line-height:1.4;
  }
  @media(max-width:640px){
    .nuki-inline{
      flex-direction:column;
    }
    .nuki-inline img{
      width:100%;
      max-width:100%;
    }
  }
</style>
<div class="nuki-inline">
  <div class="nuki-text">
    <h3>🔐 Depuis l’intérieur de l’appartement</h3>
    <p><strong>Pour déverrouiller la serrure :</strong><br>
    Presser <strong>une fois</strong> le bouton central.</p>

    <p><strong>Pour verrouiller la serrure :</strong><br>
    Presser de nouveau le bouton central<br>
    ou attendre le <strong>verrouillage automatique</strong> après 5 minutes.</p>
  </div>
  <img src="/assets/images/pressnuki.jpg" alt="Bouton Nuki intérieur" loading="lazy">
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
    <li>Always keep the <strong>keys</strong> (physical key).</li>
    <li>The <strong>card</strong> opens both entrance doors.</li>
    <li>After check-in, <strong>don’t use the intercom</strong> (no remote opening).</li>
  </ul>
</div>
<style>
  .nuki-inline{
    display:flex;
    align-items:flex-start;
    gap:20px;
    margin:25px 0;
  }
  .nuki-inline img{
    width:50%;               /* EXACTEMENT la moitié de la largeur */
    height:auto;
    max-width:50%;
    border-radius:12px;
    border:1px solid #eee;
    display:block;
    object-fit:contain;
  }
  .nuki-inline .nuki-text{
    flex:1;
    font-size:.95rem;
    line-height:1.4;
  }
  @media(max-width:640px){
    .nuki-inline{
      flex-direction:column;
    }
    .nuki-inline img{
      width:100%;
      max-width:100%;
    }
  }
</style>
<div class="nuki-inline">
  <div class="nuki-text">
    <h3>🔐 From inside the apartment</h3>
    <p><strong>To unlock the door:</strong><br>
    Press the central button <strong>once</strong>.</p>

    <p><strong>To lock the door:</strong><br>
    Press the central button again<br>
    or wait for the <strong>automatic lock</strong> after 5 minutes.</p>
  </div>

  <img src="/assets/images/pressnuki.jpg" alt="Nuki button interior" loading="lazy">
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
    <li>Lleve siempre las <strong>llaves</strong> (llave física).</li>
    <li>La <strong>tarjeta</strong> abre las dos puertas de entrada.</li>
    <li>Después del check-in, <strong>no use el portero</strong> (no abrimos a distancia).</li>
  </ul>
</div>
<style>
  .nuki-inline{
    display:flex;
    align-items:flex-start;
    gap:20px;
    margin:25px 0;
  }
  .nuki-inline img{
    width:50%;               /* EXACTEMENT la moitié de la largeur */
    height:auto;
    max-width:50%;
    border-radius:12px;
    border:1px solid #eee;
    display:block;
    object-fit:contain;
  }
  .nuki-inline .nuki-text{
    flex:1;
    font-size:.95rem;
    line-height:1.4;
  }
  @media(max-width:640px){
    .nuki-inline{
      flex-direction:column;
    }
    .nuki-inline img{
      width:100%;
      max-width:100%;
    }
  }
</style>
<div class="nuki-inline">
  <div class="nuki-text">
    <h3>🔐 Desde el interior del apartamento</h3>
    <p><strong>Para desbloquear la cerradura:</strong><br>
    Presione <strong>una vez</strong> el botón central.</p>

    <p><strong>Para bloquear la cerradura:</strong><br>
    Presione nuevamente el botón central<br>
    o espere el <strong>bloqueo automático</strong> después de 5 minutos.</p>
  </div>

  <img src="/assets/images/pressnuki.jpg" alt="Botón Nuki interior" loading="lazy">
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
   // Quartier & recommandations
  if (slug === 'quartier') {
    const t = {
      fr: {
        title: '🗺️ Quartier & recommandations',
        intro: 'Voici une sélection de commerces à quelques minutes de l’appartement.',
        filterLabel: 'Filtrer par type',
        all: 'Tous',
        categories: {
          bakery: 'Boulangeries',
          brasserie: 'Brasseries / bistrots',
          restaurant: 'Restaurants',
          cafe: 'Cafés',
          pharmacy: 'Pharmacies',
          pharmacy24: 'Pharmacie 24/7'
        },
        openMaps: 'Ouvrir dans Google Maps'
      },
      en: {
        title: '🗺️ Neighborhood & recommendations',
        intro: 'Here is a selection of places just a few minutes from the apartment.',
        filterLabel: 'Filter by type',
        all: 'All',
        categories: {
          bakery: 'Bakeries',
          brasserie: 'Brasseries / bistros',
          restaurant: 'Restaurants',
          cafe: 'Cafés',
          pharmacy: 'Pharmacies',
          pharmacy24: '24/7 pharmacy'
        },
        openMaps: 'Open in Google Maps'
      },
      es: {
        title: '🗺️ Barrio y recomendaciones',
        intro: 'Aquí tienes una selección de sitios a pocos minutos del apartamento.',
        filterLabel: 'Filtrar por tipo',
        all: 'Todos',
        categories: {
          bakery: 'Panaderías',
          brasserie: 'Brasseries / bistrós',
          restaurant: 'Restaurantes',
          cafe: 'Cafés',
          pharmacy: 'Farmacias',
          pharmacy24: 'Farmacia 24/7'
        },
        openMaps: 'Abrir en Google Maps'
      }
    }[lang];

    const filterOrder = ['bakery', 'brasserie', 'restaurant', 'cafe', 'pharmacy', 'pharmacy24'];

    const cards = PLACES.map(place => {
      const name = place.names[lang] || place.names.fr;
      const desc = place.desc[lang] || place.desc.fr;
      const catLabel = t.categories[place.category] || '';

      return `
      <article class="place-card" data-category="${place.category}">
        <h3>${escapeHtml(name)}</h3>
        ${catLabel ? `<p class="place-cat">${escapeHtml(catLabel)}</p>` : ''}
        <p class="place-addr">${escapeHtml(place.address)}</p>
        <p class="place-desc">${escapeHtml(desc)}</p>
        <a class="btn" href="${place.mapsUrl}" target="_blank" rel="noopener">
          ${escapeHtml(t.openMaps)}
        </a>
      </article>
      `;
    }).join('');

    const filterButtons = [
      `<button type="button" class="active" data-cat="all">${escapeHtml(t.all)}</button>`,
      ...filterOrder
        .filter(cat => t.categories[cat])
        .map(cat => `<button type="button" data-cat="${cat}">${escapeHtml(t.categories[cat])}</button>`)
    ].join('');

    return `
<style>
  .quartier-intro{margin-bottom:1rem;font-size:.95rem}
  .places-filters{
    display:flex;
    flex-wrap:wrap;
    gap:.5rem;
    align-items:center;
    margin-bottom:1rem
  }
  .places-filters span{
    font-size:.9rem;
    color:#555
  }
  .places-filters button{
    border:1px solid #ddd;
    border-radius:999px;
    padding:.3rem .7rem;
    background:#f8f8f8;
    font-size:.85rem;
    cursor:pointer
  }
  .places-filters button.active{
    background:#111;
    color:#fff;
    border-color:#111
  }
  .places-list{
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(230px,1fr));
    gap:1rem
  }
  .place-card{
    border:1px solid #eee;
    border-radius:12px;
    padding:12px;
    background:#fff
  }
  .place-card h3{
    margin:0 0 .3rem 0;
    font-size:1rem
  }
  .place-cat{
    margin:0 0 .4rem 0;
    font-size:.8rem;
    color:#666
  }
  .place-addr{
    margin:0 0 .4rem 0;
    font-size:.85rem
  }
  .place-desc{
    margin:0 0 .6rem 0;
    font-size:.85rem;
    color:#555
  }
  .place-card .btn{
    display:inline-block;
    padding:.35rem .7rem;
    border-radius:8px;
    border:1px solid #ddd;
    text-decoration:none;
    font-size:.85rem
  }
  .place-card .btn:hover{
    background:#f5f5f5
  }
</style>

<h2>${escapeHtml(t.title)}</h2>
<p class="quartier-intro">${escapeHtml(t.intro)}</p>

<div class="places-filters">
  <span>${escapeHtml(t.filterLabel)} :</span>
  ${filterButtons}
</div>

<div class="places-list">
  ${cards}
</div>

<script>
(function(){
  const filters = document.querySelectorAll('.places-filters button[data-cat]');
  const cards = document.querySelectorAll('.place-card');
  if (!filters.length || !cards.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', function(){
      const cat = this.getAttribute('data-cat');
      filters.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      cards.forEach(card => {
        const c = card.getAttribute('data-category');
        card.style.display = (cat === 'all' || c === cat) ? '' : 'none';
      });
    });
  });
})();
</script>
    `;
  }


  // Règlement intérieur — hyper visuel
  if (slug === 'regles') {
    if (lang === 'fr') {
      return `
<style>
  .rules-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;margin-top:16px;}
  @media(min-width:640px){.rules-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
  .rule-card{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:12px;border:1px solid #eee;background:#fafafa;}
  .rule-icon{font-size:1.3rem;margin-top:2px;}
  .rule-text{font-size:0.95rem;line-height:1.4;}
</style>

<p>Merci de respecter les règles ci-dessous afin de garantir confort et sécurité pour tous.</p>

<div class="rules-grid">
  <div class="rule-card">
    <div class="rule-icon">🎉</div>
    <div class="rule-text">Aucune fête ni événement autorisé.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🚭</div>
    <div class="rule-text">Il est interdit de fumer.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🐾</div>
    <div class="rule-text">Animaux non admis.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">👶</div>
    <div class="rule-text">Ne convient pas aux tout-petits et aux enfants de moins de 12 ans.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">👥</div>
    <div class="rule-text">Aucun invité non enregistré n'est autorisé.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🛏️</div>
    <div class="rule-text">Veuillez ne pas manger ni boire dans les chambres.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🔇</div>
    <div class="rule-text">Merci de respecter le couvre-feu sonore entre 22h00 et 8h00.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">⏰</div>
    <div class="rule-text">Merci de respecter l'heure d'arrivée (15h00) et l'heure de départ (11h00).</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🔑</div>
    <div class="rule-text">Veuillez prendre particulièrement soin de vos clés. En cas de perte, des frais de remplacement de 250€ seront facturés.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🪑</div>
    <div class="rule-text">Veuillez prendre soin du mobilier. Vous devrez payer les dommages qui dépassent la caution.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🔁</div>
    <div class="rule-text">S'il vous plaît, ne réorganisez pas les meubles.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🍽️</div>
    <div class="rule-text">S'il vous plaît, faites votre vaisselle.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🗑️</div>
    <div class="rule-text">Veuillez sortir les poubelles avant de partir.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🚔</div>
    <div class="rule-text">Aucune substance illégale n'est autorisée dans les locaux.</div>
  </div>
</div>
`;
    }

    if (lang === 'en') {
      return `
<style>
  .rules-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;margin-top:16px;}
  @media(min-width:640px){.rules-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
  .rule-card{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:12px;border:1px solid #eee;background:#fafafa;}
  .rule-icon{font-size:1.3rem;margin-top:2px;}
  .rule-text{font-size:0.95rem;line-height:1.4;}
</style>

<p>Please follow these rules to ensure comfort and safety for everyone.</p>

<div class="rules-grid">
  <div class="rule-card">
    <div class="rule-icon">🎉</div>
    <div class="rule-text">No parties or events allowed.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🚭</div>
    <div class="rule-text">Smoking is strictly prohibited.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🐾</div>
    <div class="rule-text">No pets allowed.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">👶</div>
    <div class="rule-text">Not suitable for infants and children under 12.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">👥</div>
    <div class="rule-text">No unregistered guests are allowed.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🛏️</div>
    <div class="rule-text">Please do not eat or drink in the bedrooms.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🔇</div>
    <div class="rule-text">Please respect quiet hours between 10:00 pm and 8:00 am.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">⏰</div>
    <div class="rule-text">Please respect check-in (03:00) and check-out (11:00) times.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🔑</div>
    <div class="rule-text">Please take special care of your keys. If you lose them, a replacement fee of €250 will be charged.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🪑</div>
    <div class="rule-text">Please take care of the furniture. You will be charged for any damage exceeding the security deposit.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🔁</div>
    <div class="rule-text">Please do not rearrange the furniture.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🍽️</div>
    <div class="rule-text">Please wash your dishes.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🗑️</div>
    <div class="rule-text">Please take out the trash before you leave.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🚔</div>
    <div class="rule-text">No illegal substances are allowed on the premises.</div>
  </div>
</div>
`;
    }

    if (lang === 'es') {
      return `
<style>
  .rules-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;margin-top:16px;}
  @media(min-width:640px){.rules-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
  .rule-card{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:12px;border:1px solid #eee;background:#fafafa;}
  .rule-icon{font-size:1.3rem;margin-top:2px;}
  .rule-text{font-size:0.95rem;line-height:1.4;}
</style>

<p>Por favor, respete estas normas para garantizar comodidad y seguridad para todos.</p>

<div class="rules-grid">
  <div class="rule-card">
    <div class="rule-icon">🎉</div>
    <div class="rule-text">No se permiten fiestas ni eventos.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🚭</div>
    <div class="rule-text">Está estrictamente prohibido fumar.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🐾</div>
    <div class="rule-text">No se admiten mascotas.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">👶</div>
    <div class="rule-text">No es adecuado para bebés ni niños menores de 12 años.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">👥</div>
    <div class="rule-text">No se permiten invitados no registrados.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🛏️</div>
    <div class="rule-text">Por favor, no coma ni beba en los dormitorios.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🔇</div>
    <div class="rule-text">Respete el horario de silencio entre las 22:00 y las 8:00.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">⏰</div>
    <div class="rule-text">Respete los horarios de check-in (15:00) y check-out (11:00).</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🔑</div>
    <div class="rule-text">Cuide especialmente sus llaves. En caso de pérdida, se aplicará un cargo de 250 € por sustitución.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🪑</div>
    <div class="rule-text">Cuide el mobiliario. Se le cobrará cualquier daño que supere el depósito de seguridad.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🔁</div>
    <div class="rule-text">Por favor, no reorganice los muebles.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🍽️</div>
    <div class="rule-text">Lave los platos antes de irse.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🗑️</div>
    <div class="rule-text">Saque la basura antes de su salida.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🚔</div>
    <div class="rule-text">No se permiten sustancias ilegales en la propiedad.</div>
  </div>
</div>
`;
    }
  }

  // Check-out — version finale, hyper visuelle
  if (slug === 'checkout') {
    if (lang === 'fr') {
      return `
<style>
  .rules-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;margin-top:16px;}
  @media(min-width:640px){.rules-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
  .rule-card{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:12px;border:1px solid #eee;background:#fafafa;}
  .rule-icon{font-size:1.3rem;margin-top:2px;}
  .rule-text{font-size:0.95rem;line-height:1.4;}
</style>

<p>Le check-out est prévu à <strong>11h00</strong> le matin. Merci de suivre les étapes ci-dessous avant votre départ.</p>

<div class="rules-grid">
  <div class="rule-card">
    <div class="rule-icon">💡</div>
    <div class="rule-text">Merci d’éteindre toutes les lumières.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">❄️</div>
    <div class="rule-text">Coupez la climatisation et le chauffage.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🪟</div>
    <div class="rule-text">Assurez-vous de ne laisser <strong>aucune fenêtre ouverte</strong>.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🔑</div>
    <div class="rule-text">Déposez les <strong>clés</strong> et le <strong>badge</strong> sur le meuble TV, à l’endroit où vous les avez trouvés à votre arrivée.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🎒</div>
    <div class="rule-text">Vérifiez que vous n’avez oublié <strong>aucune affaire personnelle</strong> (tiroirs, salle de bain, penderies…).</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🍽️</div>
    <div class="rule-text">Merci de faire votre vaisselle et de laisser la cuisine dans un état correct.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🗑️</div>
    <div class="rule-text">Veuillez sortir les poubelles selon les indications de la section “Accès poubelles”.</div>
  </div>
    <div class="rule-card">
    <div class="rule-icon">🚪</div>
    <div class="rule-text">
      Pour sortir de l’appartement :<br>
      <strong>Déverrouillez la serrure</strong> en pressant <strong>une fois</strong> le bouton central,<br>
      fermez la porte derrière vous.<br>
      La serrure se <strong>verrouillera automatiquement</strong>.
    </div>
  </div>
<div class="rule-card">
  <div class="rule-icon">📱</div>
  <div class="rule-text">
 Confirmez votre départ automatiquement en cliquant ci dessous.
    <div style="margin-top:6px;">
      <a 
        href="https://wa.me/33782178715?text=Bonjour%2C%20je%20viens%20de%20quitter%20l%27appartement%20et%20tout%20est%20ok%20!"
        style="text-decoration:none; font-weight:600; color:#007AFF;"
      >
        📩 Envoyer un message
      </a>
    </div>
  </div>
</div>
</div>

`;
    }

    if (lang === 'en') {
      return `
<style>
  .rules-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;margin-top:16px;}
  @media(min-width:640px){.rules-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
  .rule-card{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:12px;border:1px solid #eee;background:#fafafa;}
  .rule-icon{font-size:1.3rem;margin-top:2px;}
  .rule-text{font-size:0.95rem;line-height:1.4;}
</style>

<p>Check-out is scheduled at <strong>11:00 am</strong>. Please follow the steps below before leaving.</p>

<div class="rules-grid">
  <div class="rule-card">
    <div class="rule-icon">💡</div>
    <div class="rule-text">Please switch off all lights.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">❄️</div>
    <div class="rule-text">Turn off the air conditioning and heating.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🪟</div>
    <div class="rule-text">Make sure <strong>no windows are left open</strong>.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🔑</div>
    <div class="rule-text">Leave the <strong>keys</strong> and the <strong>building badge</strong> on the TV stand, where you found them on arrival.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🎒</div>
    <div class="rule-text">Check that you have not forgotten any <strong>personal belongings</strong> (drawers, bathroom, closets, etc.).</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🍽️</div>
    <div class="rule-text">Please wash your dishes and leave the kitchen reasonably tidy.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🗑️</div>
    <div class="rule-text">Please take out the trash according to the instructions in the “Waste disposal” section.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">📱</div>
    <div class="rule-text">If possible, send us a short WhatsApp message to confirm that you have checked out.</div>
  </div>
    <div class="rule-card">
    <div class="rule-icon">🚪</div>
    <div class="rule-text">
      Leaving the apartment:<br>
      <strong>Unlock the door</strong> by pressing the central button <strong>once</strong>,<br>
      close the door behind you.<br>
      The lock will <strong>automatically lock</strong>.
    </div>
  </div>
<div class="rule-card">
  <div class="rule-icon">📱</div>
  <div class="rule-text">
  Confirm that you have checked out by cliquing the link below.
    <div style="margin-top:6px;">
      <a 
        href="https://wa.me/33782178715?text=Hi%2C%20I%20have%20just%20left%20the%20apartment%20and%20everything%20is%20fine%20!"
        style="text-decoration:none; font-weight:600; color:#007AFF;"
      >
        📩 Send a message
      </a>
    </div>
  </div>
</div>

`;
    }

    if (lang === 'es') {
      return `
<style>
  .rules-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;margin-top:16px;}
  @media(min-width:640px){.rules-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
  .rule-card{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:12px;border:1px solid #eee;background:#fafafa;}
  .rule-icon{font-size:1.3rem;margin-top:2px;}
  .rule-text{font-size:0.95rem;line-height:1.4;}
</style>

<p>El check-out está previsto a las <strong>11:00</strong>. Por favor, siga los pasos siguientes antes de salir.</p>

<div class="rules-grid">
  <div class="rule-card">
    <div class="rule-icon">💡</div>
    <div class="rule-text">Apague todas las luces.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">❄️</div>
    <div class="rule-text">Apague el aire acondicionado y la calefacción.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🪟</div>
    <div class="rule-text">Asegúrese de que <strong>ninguna ventana quede abierta</strong>.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🔑</div>
    <div class="rule-text">Deje las <strong>llaves</strong> y la <strong>tarjeta de acceso</strong> sobre el mueble de la TV, donde las encontró a su llegada.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🎒</div>
    <div class="rule-text">Compruebe que no haya olvidado <strong>ninguna pertenencia personal</strong> (cajones, baño, armarios, etc.).</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🍽️</div>
    <div class="rule-text">Lave los platos y deje la cocina en un estado razonable.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">🗑️</div>
    <div class="rule-text">Saque la basura siguiendo las indicaciones de la sección “Acceso a la basura”.</div>
  </div>
  <div class="rule-card">
    <div class="rule-icon">📱</div>
    <div class="rule-text">Si es posible, envíenos un breve mensaje por WhatsApp para confirmar su salida.</div>
  </div>
    <div class="rule-card">
    <div class="rule-icon">🚪</div>
    <div class="rule-text">
      Para salir del apartamento:<br>
      <strong>Desbloquee la cerradura</strong> presionando <strong>una vez</strong> el botón central,<br>
      cierre la puerta al salir.<br>
      La cerradura se <strong>bloqueará automáticamente</strong>.
    </div>
  </div>
 <div class="rule-card">
  <div class="rule-icon">📱</div>
  <div class="rule-text">
    Confirmar su salida automaticamente por whatsapp cliqueando en el enlace a bajo.
    <div style="margin-top:6px;">
      <a 
        href="https://wa.me/33782178715?text=Hola%2C%20acabo%20de%20salir%20del%20apartamento%20y%20todo%20est%C3%A1%20bien%20!"
        style="text-decoration:none; font-weight:600; color:#007AFF;"
      >
        📩 Enviar mensaje
      </a>
    </div>
  </div>
</div>

`;
    }
  }
  // === TRANSPORT ===
  if (slug === 'transport') {

    // ———————— FR ————————
    if (lang === 'fr') {
      return `
<h2>📍 Adresse de l’appartement</h2>
<p><strong>8 rue Balzac, 75008 Paris</strong></p>

<p>🚆 <strong>Trains, métro et vélos</strong> sont les moyens les plus efficaces pour se déplacer à Paris.</p>
<p>🎫 Billets et pass disponibles en gare ou via l’application IDF Mobilités sur IOS et Android.</p>
<p>➡️ Pour découvrir quel est le pass de transoirt le plus adapté à votre séjour :
<a href="https://www.ratp.fr/en/titres-et-tarifs" target="_blank" rel="noopener">cliquez ici</a>.
</p>

<hr>

<h2>✈️ itineraire en train depuis Roissy Charles de Gaulle (CDG)</h2>
<p><a href="https://maps.app.goo.gl/zLPQzzZf4rV6jHKq8" target="_blank" rel="noopener">🗺️ Itinéraires Google Maps</a></p>

<ul>
  <li>⏱️ <strong>Durée :</strong> ~50 min</li>
  <li>💶 <strong>Prix :</strong> 13 €</li>
  <li>🚉 <strong>Trajet :</strong> RER B → Métro ligne 1</li>
</ul>

<hr>

<h2>✈️ itineraire en train depuis Orly (ORY)</h2>
<p><a href="https://maps.app.goo.gl/JNmEC3hF4BNmr9RT8" target="_blank" rel="noopener">🗺️ Itinéraire Google Maps</a></p>

<ul>
  <li>⏱️ <strong>Durée :</strong> ~45 min</li>
  <li>💶 <strong>Prix :</strong> 13 €</li>
  <li>🚉 <strong>Trajet :</strong> Orlyval → RER B → Métro ligne 1</li>
</ul>

<hr>

<h2>🚕 Taxis officiels</h2>
<p>Dirigez-vous vers la <strong>station de taxi officielle</strong> située dans les terminaux.</p>
<p>❗ Ne faites <strong>pas</strong> confiance aux personnes qui vous abordent : ce ne sont <strong>pas</strong> des taxis agréés.</p>

<h3>✈️ Depuis Roissy Charles de Gaulle (CDG)</h3>
<ul>
  <li>⏱️ <strong>Durée :</strong> 45 min à 1h30</li>
  <li>💶 <strong>Prix :</strong> 60–80 €</li>
</ul>

<h3>✈️ Depuis Orly (ORY)</h3>
<ul>
  <li>⏱️ <strong>Durée :</strong> 45 min à 1h30</li>
  <li>💶 <strong>Prix :</strong> 60–80 €</li>
</ul>

<hr>

<h2>🅿️ Stationnement / Parking</h2>
<p>Vous pourrez facilement vous stationner dans les rues avoisinantes.</p>
<p>L’appartement ne dispose pas de parking dédié, mais des places publiques sont disponibles autour de l’immeuble.</p>

<ul>
  <li>📅 <strong>En semaine :</strong> payant 8h–19h</li>
  <li>🌙 <strong>Gratuit :</strong> 19h–8h</li>
  <li>🧭 <strong>Week-ends :</strong> gratuit</li>
</ul>

<p><strong>Comment payer ?</strong></p>
<ul>
  <li>💳 Par carte bancaire sur les horodateurs</li>
  <li>📱 Application Paybyphone :
    <br>Android : <a href="https://play.google.com/store/apps/details?id=com.paybyphone&hl=fr&pli=1" target="_blank" rel="noopener">Paybyphone Android</a>
    <br>iOS : <a href="https://apps.apple.com/app/paybyphone-parking/id448474183" target="_blank" rel="noopener">Paybyphone iOS</a>
  </li>
</ul>

<p>🚗 <strong>Parking souterrain à 2 minutes, ouvert 24/7 :</strong></p>
<p><a href="https://maps.app.goo.gl/8qdNECAkPaJmj19d8" target="_blank" rel="noopener">Parking Indigo Paris Friedland</a></p>
      `;
    }

    // ———————— EN ————————
    if (lang === 'en') {
      return `
<h2>📍 Apartment address</h2>
<p><strong>8 rue Balzac, 75008 Paris</strong></p>

<p>🚆 <strong>Train, metro and bikes</strong> are the most efficient ways to move around Paris.</p>
<p>🎫 Tickets and passes available at stations or via the IDF Mobilités app available on IOS and Android.</p>
<p>➡️ To find the best transport pass that match your needs:
<a href="https://www.ratp.fr/en/titres-et-tarifs" target="_blank" rel="noopener">click here</a>.
</p>

<hr>

<h2>✈️ Itinerary by train from Charles de Gaulle Airport (CDG)</h2>
<p><a href="https://maps.app.goo.gl/zLPQzzZf4rV6jHKq8" target="_blank" rel="noopener">🗺️ Google Maps routes</a></p>

<ul>
  <li>⏱️ <strong>Duration:</strong> ~50 min</li>
  <li>💶 <strong>Price:</strong> €13</li>
  <li>🚉 <strong>Route:</strong> RER B → Metro line 1</li>
</ul>

<hr>

<h2>✈️ Itinerary by train  from Orly Airport (ORY)</h2>
<p><a href="https://maps.app.goo.gl/JNmEC3hF4BNmr9RT8" target="_blank" rel="noopener">🗺️ Google Maps route</a></p>

<ul>
  <li>⏱️ <strong>Duration:</strong> ~45 min</li>
  <li>💶 <strong>Price:</strong> €13</li>
  <li>🚉 <strong>Route:</strong> Orlyval → RER B → Metro line 1</li>
</ul>

<hr>

<h2>🚕 Official taxis</h2>
<p>Head to the <strong>official taxi stand</strong> inside the terminals.</p>
<p>❗ Do <strong>not</strong> trust individuals approaching you: they are <strong>not</strong> licensed taxis.</p>

<h3>✈️ From Charles de Gaulle (CDG)</h3>
<ul>
  <li>⏱️ <strong>Duration:</strong> 45 min to 1h30</li>
  <li>💶 <strong>Price:</strong> €60–80</li>
</ul>

<h3>✈️ From Orly (ORY)</h3>
<ul>
  <li>⏱️ <strong>Duration:</strong> 45 min to 1h30</li>
  <li>💶 <strong>Price:</strong> €60–80</li>
</ul>

<hr>

<h2>🅿️ Parking</h2>
<p>You can easily park in the surrounding streets.</p>
<p>The apartment has no dedicated parking, but street parking is available around the building.</p>

<ul>
  <li>📅 <strong>Weekdays:</strong> paid 8am–7pm</li>
  <li>🌙 <strong>Free:</strong> 7pm–8am</li>
  <li>🧭 <strong>Weekends:</strong> free</li>
</ul>

<p><strong>How to pay?</strong></p>
<ul>
  <li>💳 By credit card at parking meters</li>
  <li>📱 Via the Paybyphone app:
    <br>Android: <a href="https://play.google.com/store/apps/details?id=com.paybyphone&hl=fr&pli=1" target="_blank" rel="noopener">Paybyphone Android</a>
    <br>iOS: <a href="https://apps.apple.com/app/paybyphone-parking/id448474183" target="_blank" rel="noopener">Paybyphone iOS</a>
  </li>
</ul>

<p>🚗 <strong>Underground parking 2 minutes away, open 24/7:</strong></p>
<p><a href="https://maps.app.goo.gl/8qdNECAkPaJmj19d8" target="_blank" rel="noopener">Parking Indigo Paris Friedland</a></p>
      `;
    }

    // ———————— ES ————————
    if (lang === 'es') {
      return `
<h2>📍 Dirección del apartamento</h2>
<p><strong>8 rue Balzac, 75008 París</strong></p>

<p>🚆 <strong>El tren, el metro y las bicicletas</strong> son las formas más eficientes de moverse por París.</p>
<p>🎫 Billetes y pases disponibles en estaciones o mediante la app IDF Mobilités disponible para IOS y Android.</p>
<p>➡️ Para encontrar el pase de transporte mas indicado para tus viaje:
<a href="https://www.ratp.fr/en/titres-et-tarifs" target="_blank" rel="noopener">haga clic aquí</a>.
</p>

<hr>

<h2>✈️ Itinerario desde el Aeropuerto Charles de Gaulle (CDG)</h2>
<p><a href="https://maps.app.goo.gl/zLPQzzZf4rV6jHKq8" target="_blank" rel="noopener">🗺️ Itinerarios Google Maps</a></p>

<ul>
  <li>⏱️ <strong>Duración:</strong> ~50 min</li>
  <li>💶 <strong>Precio:</strong> 13 €</li>
  <li>🚉 <strong>Ruta:</strong> RER B → Metro línea 1</li>
</ul>

<hr>

<h2>✈️ Itinerario desde el Aeropuerto de Orly (ORY)</h2>
<p><a href="https://maps.app.goo.gl/JNmEC3hF4BNmr9RT8" target="_blank" rel="noopener">🗺️ Itinerario Google Maps</a></p>

<ul>
  <li>⏱️ <strong>Duración:</strong> ~45 min</li>
  <li>💶 <strong>Precio:</strong> 13 €</li>
  <li>🚉 <strong>Ruta:</strong> Orlyval → RER B → Metro línea 1</li>
</ul>

<hr>

<h2>🚕 Taxis oficiales</h2>
<p>Diríjase a la <strong>parada oficial de taxis</strong> dentro de los terminales.</p>
<p>❗ No confíe en personas que se acerquen a ofrecer transporte: <strong>no</strong> son taxis autorizados.</p>

<h3>✈️ Desde Charles de Gaulle (CDG)</h3>
<ul>
  <li>⏱️ <strong>Duración:</strong> 45 min a 1h30</li>
  <li>💶 <strong>Precio:</strong> 60–80 €</li>
</ul>

<h3>✈️ Desde Orly (ORY)</h3>
<ul>
  <li>⏱️ <strong>Duración:</strong> 45 min a 1h30</li>
  <li>💶 <strong>Precio:</strong> 60–80 €</li>
</ul>

<hr>

<h2>🅿️ Estacionamiento / Parking</h2>
<p>Podrá aparcar fácilmente en las calles cercanas.</p>
<p>El apartamento no dispone de aparcamiento privado, pero hay plazas públicas alrededor del edificio.</p>

<ul>
  <li>📅 <strong>Días laborables:</strong> de pago 8h–19h</li>
  <li>🌙 <strong>Gratis:</strong> 19h–8h</li>
  <li>🧭 <strong>Fines de semana:</strong> gratis</li>
</ul>

<p><strong>¿Cómo pagar?</strong></p>
<ul>
  <li>💳 En parquímetros con tarjeta</li>
  <li>📱 Con la app Paybyphone:
    <br>Android: <a href="https://play.google.com/store/apps/details?id=com.paybyphone&hl=fr&pli=1" target="_blank" rel="noopener">Paybyphone Android</a>
    <br>iOS: <a href="https://apps.apple.com/app/paybyphone-parking/id448474183" target="_blank" rel="noopener">Paybyphone iOS</a>
  </li>
</ul>

<p>🚗 <strong>Parking subterráneo a 2 minutos, abierto 24/7:</strong></p>
<p><a href="https://maps.app.goo.gl/8qdNECAkPaJmj19d8" target="_blank" rel="noopener">Parking Indigo Paris Friedland</a></p>
      `;
    }
  }
// === CONSIGNE BAGAGES ===
if (slug === 'consigne') {

  // ———————— FR ————————
  if (lang === 'fr') {
    return `

<h3>📌 Règles générales</h3>
<ul>
  <li><strong>Check-in :</strong> nous pouvons stocker vos bagages à l’appartement à partir de <strong>12h00</strong>. Merci de nous contacter.</li>
  <li><strong>Check-out :</strong> nous ne pouvons pas stocker vos bagages après <strong>11h00</strong>.</li>
</ul>

<hr>

<h3>📍 Si vous devez stocker vos bagages avant 12h00 le jour de votre arrivée ou après 11h00 le jour de votre départ</h3>
<p>Un service de <strong>consigne à bagages</strong> est situé à moins de <strong>4 minutes à pied</strong> de l'appartement.</p>

<ul>
  <li>💶 <strong>Prix :</strong> 4,50 € par heure</li>
  <li>🌐 <strong>Réservation en ligne :</strong>
    <a href="https://www.nannybag.com/fr/consigne-bagage" target="_blank" rel="noopener">
      Nannybag.com
    </a>
  </li>
</ul>

<p style="font-size:.85rem;color:#666;"><em>*Nous n’avons aucune relation avec la société Nannybag.com</em></p>
    `;
  }

  // ———————— EN ————————
  if (lang === 'en') {
    return `

<h3>📌 General rules</h3>
<ul>
  <li><strong>Check-in:</strong> we can store your luggage at the apartment from <strong>12:00 pm</strong>. Please contact us.</li>
  <li><strong>Check-out:</strong> we cannot store luggage after <strong>11:00 am</strong>.</li>
</ul>

<hr>

<h3>📍 If you need storage before 12:00 pm on check-in day or after 11:00 am on check-out day</h3>
<p>A <strong>luggage storage service</strong> is located less than <strong>4 minutes on foot</strong> from the apartment.</p>

<ul>
  <li>💶 <strong>Price:</strong> €4.50 per hour</li>
  <li>🌐 <strong>Online booking:</strong>
    <a href="https://www.nannybag.com/fr/consigne-bagage" target="_blank" rel="noopener">
      Nannybag.com
    </a>
  </li>
</ul>

<p style="font-size:.85rem;color:#666;"><em>*We have no affiliation with Nannybag.com</em></p>
    `;
  }

  // ———————— ES ————————
  if (lang === 'es') {
    return `

<h3>📌 Reglas generales</h3>
<ul>
  <li><strong>Check-in:</strong> podemos guardar su equipaje en el apartamento a partir de las <strong>12:00</strong>. Contáctenos.</li>
  <li><strong>Check-out:</strong> no podemos guardar equipaje después de las <strong>11:00</strong>.</li>
</ul>

<hr>

<h3>📍 Si necesita guardar su equipaje antes de las 12:00 eldia del Check-in o después de las 11:00 el dia del Check-out</h3>
<p>Hay un servicio de <strong>consigna de equipaje</strong> situado a menos de <strong>4 minutos a pie</strong> del apartamento.</p>

<ul>
  <li>💶 <strong>Precio:</strong> 4,50 € por hora</li>
  <li>🌐 <strong>Reserva en línea:</strong>
    <a href="https://www.nannybag.com/fr/consigne-bagage" target="_blank" rel="noopener">
      Nannybag.com
    </a>
  </li>
</ul>

<p style="font-size:.85rem;color:#666;"><em>*No tenemos ninguna relación con Nannybag.com</em></p>
    `;
  }
}


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
  .trash-img{display:block;max-width:100%;height:auto;border-radius:12px;border:1px solid #eee;margin:16px auto}
  .trash-section{margin-top:16px}
  .trash-notes{margin-top:10px;padding-left:20px}
  .trash-notes li{margin:6px 0}
</style>

<!-- Photo 1 : poubelle cuisine -->
<img class="trash-img" src="/assets/images/poubelles1.jpg" alt="${escapeAttr(TXT.img1Alt)}" loading="lazy">

<!-- Bloc d’attention -->
<div class="callout warn trash-section"><strong>${escapeHtml(TXT.attTitle)} :</strong>
  <ul class="trash-notes">
    <li>${escapeHtml(TXT.att1)}</li>
  </ul>
</div>

<!-- Photo 2 : local poubelles -->
<img class="trash-img" src="/assets/images/poubelles2.jpg" alt="${escapeAttr(TXT.img2Alt)}" loading="lazy">

<!-- Notes -->
<ul class="trash-notes">
  <li>${escapeHtml(TXT.note1)}</li>
  <li>${escapeHtml(TXT.note2)}</li>
</ul>
`;
}

// Navigation
function buildNav(currentLang, currentSlug) {
  const pages = PAGES.map(slug => {
    const title  = TITLES[slug]?.[currentLang] || slug;
    const href   = `/${currentLang}-${slug}.html`;
    const active = slug === currentSlug ? ' data-active="1"' : '';
    return `<a href="${href}"${active}>${escapeHtml(title)}</a>`;
  }).join('');

  const langSwitch = LANGS.map(l => {
    const href   = `/${l}-${currentSlug}.html`;
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
  .topbar{
    position:sticky;
    top:0;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:8px;
    padding:10px 12px;
    border:1px solid #eee;
    border-radius:12px;
    background:#fff;
    z-index:10001;
  }
  .topbar .home{
    text-decoration:none;
    font-size:1.2rem;
  }
  .topbar .burger{
    font-size:1.2rem;
    line-height:1;
    border:1px solid #ddd;
    background:#fff;
    border-radius:8px;
    padding:6px 10px;
    cursor:pointer;
  }

  .nav-panel{
    position:fixed;
    left:0;
    right:0;
    top:60px;
    bottom:0;
    background:#fff;
    border-top:1px solid #eee;
    box-shadow:0 8px 24px rgba(0,0,0,.08);
    transform:translateY(-12px);
    opacity:0;
    pointer-events:none;
    transition:.18s ease;
    z-index:10000;
    overflow:auto;
  }
  .nav-panel.open{
    transform:translateY(0);
    opacity:1;
    pointer-events:auto;
  }
  .nav-section{
    padding:12px;
    max-width:640px;
    margin:0 auto;
  }
  .nav-title{
    font-weight:600;
    margin:6px 0 8px 0;
  }
  .nav-panel a{
    display:block;
    padding:8px 10px;
    border-radius:8px;
    text-decoration:none;
  }
  .nav-panel a:hover{
    background:#f6f6f6;
  }
  .nav-panel a[data-active="1"]{
    background:#efefef;
    font-weight:600;
  }
</style>

<script>
(function () {
  var burger = document.getElementById('burger-btn');
  var panel  = document.getElementById('nav-panel');

  // Ouverture / fermeture du menu hamburger
  if (burger && panel) {
    burger.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
  }

  // Bouton Home : renvoie toujours au sommaire de la langue
  var home = document.getElementById('home-btn');
  if (home) {
    home.addEventListener('click', function (e) {
      e.preventDefault();
      var L = home.getAttribute('data-lang') || 'en';
      window.location.href = '/' + L + '.html';
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
