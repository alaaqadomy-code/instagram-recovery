/** Topic clusters. Pillar slug maps to supporting slugs. */
export const clusterSupport = {
  "atal-alinstagram": [],
  "taattil-huquq-nashr": ["balagh-alama-tijariya"],
  "taghyir-email-instagram": [
    "taghyir-raqam-jawwal",
    "barid-altaakid-laysa-bariidi"
  ],
  "mushkilat-tasjeel-dukhool": [
    "qufl-baad-safar",
    "hadd-muhawalat-instagram",
    "challenge-required-instagram",
    "takid-annaka-insan",
    "hisab-bi-ishraf-aili"
  ],
  "hadhf-manshurat-instagram": [],
  "ikhtiraq-hisab-alinstagram": [
    "inha-jalasat-instagram",
    "taghyir-ism-wa-sura",
    "hisab-yudakhilhu-shakhs",
    "himayat-al-hisab-baad-alikhtiraq",
    "dukhul-yakhrujuni-fawran",
    "risalat-dukhul-ghair-maraf",
    "tatbiq-khariji-qabl-altaattil"
  ],
  "rabt-facebook-accounts-center": [
    "rabt-threads-instagram",
    "istirja-via-facebook",
    "safhat-facebook-ma-instagram",
    "kalimat-sirr-markaz-alhisabat",
    "istirja-hisab-facebook-muattal"
  ],
  "hisab-tijari-muattal": [
    "taattil-i3lanat-instagram",
    "adawat-hisab-almunshi",
    "arbaha-instagram-muallaqa",
    "hisab-i3lani-muattal",
    "business-suite-wal-hisab-muattal",
    "tahawwul-ila-hisab-shakhsi"
  ],
  "nseet-ism-almustakhdam": [
    "ism-mustakhdam-baad-taattil",
    "istirja-username-instagram",
    "ism-mustakhdam-li-istirja"
  ],
  "istirja-hisab-instagram": [
    "istirja-min-iphone",
    "istirja-min-android",
    "hisab-instagram-qadim",
    "istirja-min-mutasaffih",
    "istirja-abr-google",
    "istirdad-hisab-alinsta-kamil",
    "istirdad-hisabi-alinsta"
  ],
  "rabit-istirja-hisab-instagram": [],
  "istirja-via-daam-fanni": [],
  "ilgha-tansheet-hisab-instagram": [
    "tam-ilgha-tansheet-hisabi",
    "iadat-tansheet-hisab-insta"
  ],
  "naseet-kalimat-sirr-lilinstagram": ["miftah-murur-instagram"],
  "istirja-hisab-mahdhuf": [
    "istirja-mahdhuf-nihai"
  ],
  "istirja-hisab-instagram-muattal": [
    "istirja-muattal-nihaiyan",
    "farq-muattal-mahdhuf",
    "asbab-taattil-instagram",
    "tatbiq-muattal-wal-mutasaffih-yaftah",
    "hisab-jadid-baad-taattil",
    "hisaban-ahaduhuma-muattal",
    "rabit-istirja-muattal-rasmi",
    "istirja-muattal-intihak",
    "istirja-muattal-muaqqatan",
    "istirja-muattal-bisabab-alumr"
  ],
  "khidma-mawthuqa": [
    "istirja-majjanan",
    "taklifat-istirja-instagram",
    "baramij-istirja-instagram",
    "ihtial-istirja-instagram"
  ],
  "istinaf-hisab-instagram": [
    "la-yazhar-zar-istinaf",
    "rafd-istinaf-instagram"
  ],
  "ithbat-alhuiya-instagram": [
    "tarikh-almilad-instagram",
    "video-selfie-instagram",
    "ithbat-milkiya-instagram"
  ],
  "kam-yastaghriq-istirja": [
    "istirja-baad-30-yawm",
    "istirja-180-yawm"
  ],
  "fak-shadowban-instagram": [
    "taattil-rasail-instagram",
    "hisab-muqayyad",
    "farq-hazr-nashat-shadowban"
  ],
  "fak-band-instagram": ["surat-hisab-maband"],
  "istirja-hisab-muallaq": [],
  "istirja-hisab-mughlaq": [],
  "intihal-shakhsiya-instagram": [],
  "download-instagram-data": [],
  "bidun-email-w-raqm": [],
  "mushkilat-al-mudaaqa-thunaiya": [],
  "kod-tahqeeq-la-yasil": ["raqm-hatif-la-arafuhu"],
  "istirja-hisab-muwathaq": ["ishtirak-muwathaq-wal-hisab-muattal"]
} as Record<string, readonly string[]>;

const supportToPillar = new Map<string, string>();
for (const [pillar, supports] of Object.entries(clusterSupport)) {
  for (const slug of supports) supportToPillar.set(slug, pillar);
}

export function clusterLinks(slug: string): string[] {
  const pillar = supportToPillar.get(slug) ?? (clusterSupport[slug] ? slug : "");
  if (!pillar) return [];
  const supports = clusterSupport[pillar] ?? [];
  if (slug === pillar) return [...supports];
  return [pillar, ...supports.filter((item) => item !== slug)];
}
