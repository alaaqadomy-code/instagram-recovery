/**
 * روابط الزحف التحريرية («أدلة أخرى تهمك») — درس 17 أكتوبر 2026: عزلة الزحف.
 * المصدر: الصفحات المفهرسة في Google (الرئيسية + 16 مقالاً) وقت التوليد.
 * الهدف: كل صفحة غير مفهرسة يصلها رابطان على الأقل من صفحات مفهرسة داخل المحتوى.
 * مولَّد بـ scripts/gen-crawl-links.mjs — المفاتيح والقيم slugs داخلية للمقالات؛ "__home__" للرئيسية.
 * القاعدة: أي صفحة جديدة تُضاف هنا تحت صفحتين مفهرستين عند نشرها.
 */
export const crawlLinks: Record<string, readonly string[]> = {
  "__home__": [
    "taghyir-ism-wa-sura",
    "hisab-yudakhilhu-shakhs",
    "himayat-al-hisab-baad-alikhtiraq",
    "download-instagram-data",
    "istirja-username-instagram",
    "istirdad-hisabi-alinsta",
    "tasayyud-hisab-instagram",
    "istirja-majjanan",
    "istirja-min-mutasaffih",
    "farq-hazr-nashat-shadowban",
    "miftah-murur-instagram",
    "qufl-baad-safar",
    "hadd-muhawalat-instagram",
    "taattil-maayir-almujtama"
  ],
  "rabit-istirja-hisab-instagram": [
    "taghyir-ism-wa-sura",
    "tasayyud-hisab-instagram",
    "barid-altaakid-laysa-bariidi",
    "ihtial-istirja-instagram",
    "raqm-hatif-la-arafuhu",
    "safhat-facebook-ma-instagram"
  ],
  "istirja-via-daam-fanni": [
    "hisab-yudakhilhu-shakhs",
    "istirja-180-yawm",
    "ism-mustakhdam-li-istirja",
    "hisab-bi-ishraf-aili"
  ],
  "tam-ilgha-tansheet-hisabi": [
    "himayat-al-hisab-baad-alikhtiraq",
    "taghyir-email-instagram",
    "tawthiq-hisab-instagram",
    "rafd-selfie-wal-huiya-instagram",
    "ism-mustakhdam-baad-taattil",
    "istirja-muattal-nihaiyan"
  ],
  "iadat-tansheet-hisab-insta": [
    "ikhtiraq-hisab-alinstagram",
    "istirja-mahdhuf-nihai",
    "tawthiq-hisab-instagram",
    "istirja-hisab-instagram-muattal",
    "istirja-hisab-mahdhuf",
    "farq-muattal-mahdhuf"
  ],
  "atal-alinstagram": [
    "intihal-shakhsiya-instagram",
    "dukhul-yakhrujuni-fawran",
    "hisab-i3lani-muattal",
    "baramij-istirja-instagram",
    "hadhf-manshurat-instagram",
    "istirja-muattal-bisabab-alumr"
  ],
  "istirja-min-android": [
    "download-instagram-data",
    "naseet-kalimat-sirr-lilinstagram",
    "nseet-ism-almustakhdam",
    "taghyir-raqam-jawwal",
    "mushkilat-al-mudaaqa-thunaiya",
    "video-selfie-instagram"
  ],
  "taklifat-istirja-instagram": [
    "istirja-username-instagram",
    "miftah-murur-instagram",
    "istirja-min-iphone",
    "tatbiq-muattal-wal-mutasaffih-yaftah",
    "hisab-jadid-baad-taattil",
    "hisaban-ahaduhuma-muattal"
  ],
  "asbab-taattil-instagram": [
    "tatbiq-khariji-qabl-altaattil",
    "surat-hisab-maband",
    "ism-mustakhdam-baad-taattil",
    "fak-band-instagram",
    "ithbat-alhuiya-instagram",
    "ilgha-tansheet-hisab-instagram"
  ],
  "istirja-hisab-mughlaq": [
    "istirja-mahdhuf-nihai",
    "istirja-hisab-muallaq",
    "barid-altaakid-laysa-bariidi",
    "istirja-hisab-instagram",
    "rafd-selfie-wal-huiya-instagram",
    "hisab-instagram-qadim"
  ],
  "mushkilat-tasjeel-dukhool": [
    "inha-jalasat-instagram",
    "dukhul-yakhrujuni-fawran",
    "tarikh-almilad-instagram",
    "taghyir-raqam-jawwal",
    "kod-tahqeeq-la-yasil",
    "ithbat-milkiya-instagram"
  ],
  "rabt-facebook-accounts-center": [
    "risalat-dukhul-ghair-maraf",
    "nseet-ism-almustakhdam",
    "tarikh-almilad-instagram",
    "bidun-email-w-raqm",
    "challenge-required-instagram",
    "takid-annaka-insan"
  ],
  "kam-yastaghriq-istirja": [
    "rafd-istinaf-instagram",
    "la-yazhar-zar-istinaf"
  ],
  "fak-shadowban-instagram": [
    "hisab-tijari-muattal",
    "istirja-hisab-muwathaq",
    "business-suite-wal-hisab-muattal",
    "hadhf-manshurat-instagram",
    "raqm-hatif-la-arafuhu"
  ],
  "khidma-mawthuqa": [
    "istinaf-hisab-instagram",
    "rabit-istirja-muattal-rasmi",
    "rabt-threads-instagram",
    "istirja-via-facebook"
  ],
  "istirja-muattal-intihak": [
    "tatbiq-khariji-qabl-altaattil",
    "surat-hisab-maband",
    "taattil-rasail-instagram",
    "hisab-i3lani-muattal",
    "la-yazhar-zar-istinaf",
    "istirja-hisab-facebook-muattal"
  ],
  "istirja-muattal-muaqqatan": [
    "istirdad-hisab-alinsta-kamil",
    "hisab-muqayyad",
    "taattil-i3lanat-instagram",
    "business-suite-wal-hisab-muattal",
    "istirja-baad-30-yawm",
    "taattil-huquq-nashr"
  ]
};
