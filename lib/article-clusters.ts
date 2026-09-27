/** Topic clusters for the 67 remaining articles. */
export const clusterSupport = {
  "atal-alinstagram": [],
  "taattil-huquq-nashr": [],
  "taghyir-email-instagram": [
    "taghyir-raqam-jawwal"
  ],
  "mushkilat-tasjeel-dukhool": [
    "qufl-baad-safar",
    "hadd-muhawalat-instagram",
    "challenge-required-instagram"
  ],
  "hadhf-manshurat-instagram": [],
  "ikhtiraq-hisab-alinstagram": [
    "inha-jalasat-instagram",
    "taghyir-ism-wa-sura",
    "hisab-yudakhilhu-shakhs",
    "himayat-al-hisab-baad-alikhtiraq"
  ],
  "rabt-facebook-accounts-center": [
    "rabt-threads-instagram",
    "istirja-via-facebook"
  ],
  "hisab-tijari-muattal": [
    "taattil-i3lanat-instagram"
  ],
  "nseet-ism-almustakhdam": [
    "ism-mustakhdam-baad-taattil",
    "istirja-username-instagram"
  ],
  "istirja-hisab-instagram": [
    "istirja-min-iphone",
    "istirja-min-android",
    "hisab-instagram-qadim",
    "istirja-min-mutasaffih"
  ],
  "rabit-istirja-hisab-instagram": [],
  "istirja-via-daam-fanni": [],
  "ilgha-tansheet-hisab-instagram": [
    "tam-ilgha-tansheet-hisabi",
    "iadat-tansheet-hisab-insta"
  ],
  "naseet-kalimat-sirr-lilinstagram": [],
  "istirja-hisab-mahdhuf": [
    "istirja-mahdhuf-nihai"
  ],
  "istirja-hisab-instagram-muattal": [
    "istirja-muattal-nihaiyan",
    "farq-muattal-mahdhuf",
    "asbab-taattil-instagram"
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
  "fak-band-instagram": [],
  "istirja-hisab-muallaq": [],
  "istirja-hisab-mughlaq": [],
  "intihal-shakhsiya-instagram": [],
  "download-instagram-data": [],
  "bidun-email-w-raqm": [],
  "mushkilat-al-mudaaqa-thunaiya": [],
  "kod-tahqeeq-la-yasil": [],
  "istirja-hisab-muwathaq": []
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
