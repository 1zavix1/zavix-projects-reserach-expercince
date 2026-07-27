/**
 * ============================================================
 * ZAVIX STORE — MASTER CONFIGURATION (store.config.js)
 * Single source of truth for products, shipping, integrations.
 * Updated: July 2026 — 8 products, discount codes, upsell, pixels
 * ============================================================
 */
const STORE_CONFIG = {

  /** ── STORE IDENTITY ── */
  store: {
    name:          'ZAVIX STORE',
    fullName:      'ZAVIX HEALTH — Sport & Nutrition',
    tagline_fr:    'Superfoods & Sport — Livraison partout en Algérie',
    tagline_ar:    'تغذية رياضية — التوصيل لكل ولايات الجزائر',
    tagline_en:    'Superfoods & Sport — Delivery across Algeria',
    whatsapp:      '213664670325',   // format: 213XXXXXXXXX (no +)
    defaultLang:   'fr'
  },

  /** ── INTEGRATIONS ── */
  integrations: {
    // Supabase — fill after creating project
    supabaseUrl:     'https://waypqvvirfenklicfzmw.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndheXBxdnZpcmZlbmtsaWNmem13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMDg5MTcsImV4cCI6MjA5NjY4NDkxN30.0hucvFK8ty4RtcWeC1ImnNO8gAw25RxV2x_cP8GDos8',

    // n8n webhook — set your n8n webhook URL here (or leave empty)
    n8nWebhookUrl:   '',

    // Admin panel auth token (match with Supabase settings table)
    adminToken:      'zavix_secure_token_2026_final'
  },

  /** ── CART ── */
  cart: { storageKey: 'zavix_cart', maxQtyPerItem: 10 },

  /** ── FLASH SALE ── */
  flashSale: { enabled: true, endTime: '2026-12-31T23:59:59' },

  /** ── DISCOUNT CODES ── */
  discountCodes: {
    'ZAVIX50':  { type: 'shipping', value: 0,    label_fr: 'Livraison GRATUITE 🎁',  label_ar: 'توصيل مجاني 🎁' },
    'ZAVIX10':  { type: 'percent',  value: 0.10, label_fr: '-10% sur votre commande', label_ar: 'خصم 10% على طلبك' },
    'HEALTH':   { type: 'fixed',    value: 500,  label_fr: '-500 DZD',                label_ar: 'خصم 500 دج' },
    'SPORT':    { type: 'fixed',    value: 300,  label_fr: '-300 DZD',                label_ar: 'خصم 300 دج' }
  },

  /** ── UPSELL (shown on merci.html) ── */
  upsell: {
    enabled: true,
    id: 'upsell_maca',
    name_fr: 'Maca Bio — Vitalité & Fertilité',
    name_ar: 'ماكا عضوية — الحيوية والخصوبة',
    price: 1300,
    originalPrice: 2000,
    image: '/assets/img/products/maca-powder-on-black-spoon-732-549-feature-thumb.avif'
  },

  /** ── TRACKING PIXELS ── */
  pixels: {
    tiktok: 'D89IE1JC77UBL2TTQ6PG',
    meta:   '1591999201899745'
  },

  /** ── PRODUCTS (8 items) ── */
  products: [
    {
      id:             'spiruline',
      name_fr:        'Spiruline Pure — Énergie',
      name_ar:        'سبيرولينا نقية — طاقة',
      description_fr: 'Superaliment riche en protéines, vitamines B12 et antioxydants. Boost naturel pour l\'énergie et l\'immunité.',
      description_ar: 'غذاء خارق غني بالبروتينات وفيتامين B12 ومضادات الأكسدة. دفعة طبيعية للطاقة والمناعة.',
      price:          1800,
      image:          '/assets/img/products/spiruline.png',
      badge_fr:       'Bestseller',
      badge_ar:       'الأكثر مبيعاً',
      category:       'Superfoods',
      stock:          42,
      active:         true
    },
    {
      id:             'moringa',
      name_fr:        'Moringa Bio — Multi-Vitamines',
      name_ar:        'مورينغا عضوية — متعددة الفيتامينات',
      description_fr: 'Arbre miracle riche en fer, calcium et vitamines A, C, E. Renforce le système immunitaire naturellement.',
      description_ar: 'شجرة معجزة غنية بالحديد والكالسيوم وفيتامينات A و C و E. تعزز المناعة بشكل طبيعي.',
      price:          1500,
      image:          '/assets/img/products/Moringa-Leaves-Powder-1.webp',
      badge_fr:       'Bio',
      badge_ar:       'عضوي',
      category:       'Superfoods',
      stock:          35,
      active:         true
    },
    {
      id:             'ashwagandha',
      name_fr:        'Ashwagandha — Anti-Stress',
      name_ar:        'أشواغاندا — مضاد للإجهاد',
      description_fr: 'Adaptogène puissant pour réduire le stress, améliorer la récupération musculaire et booster la testostérone.',
      description_ar: 'مُكيِّف قوي لتقليل التوتر وتحسين التعافي العضلي وتعزيز مستوى التستوستيرون.',
      price:          2200,
      image:          '/assets/img/products/ashwagandha.png',
      badge_fr:       'Anti-Stress',
      badge_ar:       'مضاد للإجهاد',
      category:       'Adaptogènes',
      stock:          28,
      active:         true
    },
    {
      id:             'curcuma',
      name_fr:        'Curcuma Doré — Anti-Inflammatoire',
      name_ar:        'الكركم الذهبي — مضاد للالتهابات',
      description_fr: 'Épice millénaire aux propriétés anti-inflammatoires puissantes. Idéal pour les articulations et la digestion.',
      description_ar: 'توابل عريقة بخصائص مضادة للالتهابات. مثالي للمفاصل والهضم.',
      price:          1200,
      image:          '/assets/img/products/fa246ce0-054b-4892-bf30-5eb43cd938aa.jpg',
      badge_fr:       'Naturel',
      badge_ar:       'طبيعي',
      category:       'Superfoods',
      stock:          55,
      active:         true
    },
    {
      id:             'corde-sauter',
      name_fr:        'Corde à Sauter Speed Pro',
      name_ar:        'حبل القفز سبيد برو',
      description_fr: 'Corde de vitesse professionnelle avec roulement à billes. Parfaite pour le HIIT et la boxe.',
      description_ar: 'حبل قفز احترافي مع محمل كرات. مثالي لتمارين HIIT والملاكمة.',
      price:          950,
      image:          '/assets/img/products/Untitled-3.webp',
      badge_fr:       'Sport',
      badge_ar:       'رياضة',
      category:       'Sport',
      stock:          61,
      active:         true
    },
    {
      id:             'hand-grip',
      name_fr:        'Hand Grip Réglable — Force',
      name_ar:        'قابض اليد القابل للتعديل',
      description_fr: 'Renforcez votre poigne avec résistance ajustable de 10 à 60 kg. Idéal avant-bras et rééducation.',
      description_ar: 'عزز قبضتك بمقاومة قابلة للتعديل من 10 إلى 60 كجم. مثالي للساعدين وإعادة التأهيل.',
      price:          1100,
      image:          '/assets/img/products/71hBaqt6xlL._SL1500.webp',
      badge_fr:       'Populaire',
      badge_ar:       'شائع',
      category:       'Sport',
      stock:          38,
      active:         true
    },
    {
      id:             'tisane',
      name_fr:        'Tisane Détox — Herbes Naturelles',
      name_ar:        'شاي أعشاب ديتوكس طبيعية',
      description_fr: 'Mélange artisanal de plantes détoxifiantes. Purifie le corps et facilite la digestion après les repas.',
      description_ar: 'مزيج حرفي من الأعشاب المنقية. ينقي الجسم ويسهل الهضم بعد الوجبات.',
      price:          850,
      image:          '/assets/img/products/35ceaf4-8c-80bf-7317-42daed4682d7_how-to-make-herbal-tea-blends-damiana-10-710x473.webp',
      badge_fr:       'Détox',
      badge_ar:       'ديتوكس',
      category:       'Thés & Tisanes',
      stock:          73,
      active:         true
    },
    {
      id:             'pack-energie',
      name_fr:        'Pack Énergie Total (Bundle)',
      name_ar:        'باك الطاقة الشاملة',
      description_fr: 'Notre bundle signature : Spiruline + Ashwagandha + guide nutrition offert. Économisez 1 500 DZD vs. achat séparé.',
      description_ar: 'حزمتنا الأيقونية: سبيرولينا + أشواغاندا + دليل تغذية مجاني. وفّر 1500 دج مقارنةً بالشراء الفردي.',
      price:          4500,
      image:          '/assets/img/products/pack-energie.png',
      badge_fr:       '⚡ Meilleure Offre',
      badge_ar:       '⚡ أفضل عرض',
      category:       'Packs',
      stock:          18,
      active:         true
    }
  ],

  /** ── SHIPPING RULES (Yalidine 2026 rates, DZD) ── */
  shippingRules: [
    // ── ALGIERS (16)
    {
      wilayas:    [16],
      label_fr:   'Alger',
      domicile:   400,
      stopDesk:   200
    },
    // ── ORAN (31)
    {
      wilayas:    [31],
      label_fr:   'Oran',
      domicile:   500,
      stopDesk:   300
    },
    // ── BLIDA (09) & BOUMERDES (35) & TIPAZA (42)
    {
      wilayas:    [9, 35, 42],
      label_fr:   'Blida / Boumerdes / Tipaza',
      domicile:   450,
      stopDesk:   250
    },
    // ── FAR SOUTH (Adrar, Tamanrasset, Béchar, Illizi, Tindouf, etc.)
    {
      wilayas:    [1, 11, 8, 33, 37, 3, 52, 53, 54, 56, 57, 58],
      label_fr:   'Grand Sud',
      domicile:   1500,
      stopDesk:   1000
    },
    // ── ALL OTHER WILAYAS (default)
    {
      wilayas:    'default',
      label_fr:   'Autres wilayas',
      domicile:   600,
      stopDesk:   350
    }
  ],

  /** ── FULL ALGERIAN WILAYA LIST (58 wilayas) ── */
  wilayas: [
    { code: 1,  name: 'Adrar' },
    { code: 2,  name: 'Chlef' },
    { code: 3,  name: 'Laghouat' },
    { code: 4,  name: 'Oum El Bouaghi' },
    { code: 5,  name: 'Batna' },
    { code: 6,  name: 'Béjaïa' },
    { code: 7,  name: 'Biskra' },
    { code: 8,  name: 'Béchar' },
    { code: 9,  name: 'Blida' },
    { code: 10, name: 'Bouira' },
    { code: 11, name: 'Tamanrasset' },
    { code: 12, name: 'Tébessa' },
    { code: 13, name: 'Tlemcen' },
    { code: 14, name: 'Tiaret' },
    { code: 15, name: 'Tizi Ouzou' },
    { code: 16, name: 'Alger' },
    { code: 17, name: 'Djelfa' },
    { code: 18, name: 'Jijel' },
    { code: 19, name: 'Sétif' },
    { code: 20, name: 'Saïda' },
    { code: 21, name: 'Skikda' },
    { code: 22, name: 'Sidi Bel Abbès' },
    { code: 23, name: 'Annaba' },
    { code: 24, name: 'Guelma' },
    { code: 25, name: 'Constantine' },
    { code: 26, name: 'Médéa' },
    { code: 27, name: 'Mostaganem' },
    { code: 28, name: "M'Sila" },
    { code: 29, name: 'Mascara' },
    { code: 30, name: 'Ouargla' },
    { code: 31, name: 'Oran' },
    { code: 32, name: 'El Bayadh' },
    { code: 33, name: 'Illizi' },
    { code: 34, name: 'Bordj Bou Arréridj' },
    { code: 35, name: 'Boumerdes' },
    { code: 36, name: 'El Tarf' },
    { code: 37, name: 'Tindouf' },
    { code: 38, name: 'Tissemsilt' },
    { code: 39, name: 'El Oued' },
    { code: 40, name: 'Khenchela' },
    { code: 41, name: 'Souk Ahras' },
    { code: 42, name: 'Tipaza' },
    { code: 43, name: 'Mila' },
    { code: 44, name: 'Aïn Defla' },
    { code: 45, name: 'Naama' },
    { code: 46, name: 'Aïn Témouchent' },
    { code: 47, name: 'Ghardaïa' },
    { code: 48, name: 'Relizane' },
    { code: 49, name: "El M'Ghair" },
    { code: 50, name: 'El Meniaa' },
    { code: 51, name: 'Ouled Djellal' },
    { code: 52, name: 'Bordj Baji Mokhtar' },
    { code: 53, name: 'Béni Abbès' },
    { code: 54, name: 'Timimoun' },
    { code: 55, name: 'Touggourt' },
    { code: 56, name: 'Djanet' },
    { code: 57, name: "In Salah" },
    { code: 58, name: "In Guezzam" }
  ],
  // Fallback / legacy aliases for script compatibility
  theme: { gold: '#22c55e', crimson: '#16a34a', background: '#050505' },
  data: { useRemoteProducts: false, useRemoteShipping: false }
};

// Aliases inside store and config
STORE_CONFIG.store.whatsappNumber = STORE_CONFIG.store.whatsapp;
STORE_CONFIG.upsellProduct = STORE_CONFIG.upsell;

// Expose globally across environments
if (typeof window !== 'undefined') {
  window.STORE_CONFIG = STORE_CONFIG;
  window.ZAVIX_STORE_CONFIG = STORE_CONFIG;
  window.CONFIG = STORE_CONFIG;
}
if (typeof globalThis !== 'undefined') {
  globalThis.STORE_CONFIG = STORE_CONFIG;
  globalThis.ZAVIX_STORE_CONFIG = STORE_CONFIG;
  globalThis.CONFIG = STORE_CONFIG;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = STORE_CONFIG;
}

