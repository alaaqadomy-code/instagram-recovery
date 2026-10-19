/**
 * روابط الزحف التحريرية («أدلة أخرى تهمك») — درس 17 أكتوبر 2026: عزلة الزحف.
 * المصدر: الصفحات المفهرسة في Google (الرئيسية + 14 مقالاً) وقت التوليد، وتبقى قوائم الصفحات التي خرجت من الفهرس.
 * الهدف: كل مقال غير مفهرس يصله 3 روابط على الأقل من صفحات مفهرسة داخل المحتوى، وقائمة الصفحة ≤19.
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
    "tasayyud-hisab-instagram",
    "farq-hazr-nashat-shadowban"
  ],
  "rabit-istirja-hisab-instagram": [
    "taghyir-ism-wa-sura",
    "tasayyud-hisab-instagram",
    "istirja-180-yawm",
    "barid-altaakid-laysa-bariidi",
    "safhat-facebook-ma-instagram"
  ],
  "istirja-via-daam-fanni": [
    "taghyir-ism-wa-sura",
    "tasayyud-hisab-instagram",
    "ism-mustakhdam-li-istirja",
    "rabt-threads-instagram",
    "istirja-via-facebook"
  ],
  "tam-ilgha-tansheet-hisabi": [
    "hisab-yudakhilhu-shakhs",
    "inha-jalasat-instagram",
    "taghyir-email-instagram",
    "surat-hisab-maband",
    "tawthiq-hisab-instagram",
    "ism-mustakhdam-baad-taattil",
    "istirja-hisab-mahdhuf",
    "asbab-taattil-instagram",
    "taattil-maayir-almujtama"
  ],
  "atal-alinstagram": [
    "hisab-yudakhilhu-shakhs",
    "dukhul-yakhrujuni-fawran",
    "tatbiq-khariji-qabl-altaattil",
    "surat-hisab-maband",
    "tawthiq-hisab-instagram",
    "hisab-i3lani-muattal",
    "baramij-istirja-instagram",
    "hadhf-manshurat-instagram",
    "istirja-muattal-nihaiyan",
    "istirja-baad-30-yawm",
    "tatbiq-muattal-wal-mutasaffih-yaftah",
    "hisaban-ahaduhuma-muattal"
  ],
  "istirja-min-android": [
    "himayat-al-hisab-baad-alikhtiraq",
    "istirja-majjanan",
    "nseet-ism-almustakhdam",
    "tarikh-almilad-instagram",
    "taghyir-raqam-jawwal",
    "bidun-email-w-raqm",
    "mushkilat-al-mudaaqa-thunaiya",
    "ithbat-milkiya-instagram",
    "rafd-selfie-wal-huiya-instagram",
    "ithbat-alhuiya-instagram",
    "miftah-murur-instagram",
    "rabt-threads-instagram"
  ],
  "taklifat-istirja-instagram": [
    "himayat-al-hisab-baad-alikhtiraq",
    "istirja-hisab-muwathaq",
    "business-suite-wal-hisab-muattal"
  ],
  "istirja-hisab-mughlaq": [
    "intihal-shakhsiya-instagram",
    "istirja-mahdhuf-nihai",
    "barid-altaakid-laysa-bariidi",
    "ism-mustakhdam-li-istirja",
    "tawthiq-hisab-instagram",
    "rafd-selfie-wal-huiya-instagram",
    "istirja-muattal-bisabab-alumr",
    "hisab-jadid-baad-taattil"
  ],
  "mushkilat-tasjeel-dukhool": [
    "intihal-shakhsiya-instagram",
    "inha-jalasat-instagram",
    "dukhul-yakhrujuni-fawran",
    "risalat-dukhul-ghair-maraf",
    "nseet-ism-almustakhdam",
    "tarikh-almilad-instagram",
    "video-selfie-instagram",
    "hisab-muqayyad",
    "rafd-selfie-wal-huiya-instagram",
    "miftah-murur-instagram",
    "safhat-facebook-ma-instagram"
  ],
  "rabt-facebook-accounts-center": [
    "download-instagram-data",
    "risalat-dukhul-ghair-maraf",
    "nseet-ism-almustakhdam",
    "tarikh-almilad-instagram",
    "taghyir-raqam-jawwal",
    "bidun-email-w-raqm",
    "ithbat-milkiya-instagram",
    "barid-altaakid-laysa-bariidi",
    "ithbat-alhuiya-instagram",
    "miftah-murur-instagram"
  ],
  "kam-yastaghriq-istirja": [
    "download-instagram-data",
    "hadhf-manshurat-instagram"
  ],
  "fak-shadowban-instagram": [
    "istirja-username-instagram",
    "hisab-tijari-muattal",
    "istirja-hisab-muwathaq",
    "taattil-i3lanat-instagram",
    "business-suite-wal-hisab-muattal",
    "hadhf-manshurat-instagram"
  ],
  "khidma-mawthuqa": [
    "istirja-username-instagram",
    "farq-hazr-nashat-shadowban",
    "ilgha-tansheet-hisab-instagram",
    "istirja-via-facebook"
  ],
  "istirja-muattal-intihak": [
    "taghyir-email-instagram",
    "tatbiq-khariji-qabl-altaattil",
    "istirja-mahdhuf-nihai",
    "surat-hisab-maband",
    "taattil-rasail-instagram",
    "taattil-i3lanat-instagram",
    "hisab-i3lani-muattal",
    "ism-mustakhdam-baad-taattil",
    "istirja-baad-30-yawm",
    "istirja-hisab-facebook-muattal"
  ],
  "istirja-muattal-muaqqatan": [
    "dukhul-yakhrujuni-fawran",
    "tatbiq-khariji-qabl-altaattil",
    "istirja-mahdhuf-nihai",
    "hisab-muqayyad",
    "taattil-rasail-instagram",
    "taattil-i3lanat-instagram",
    "hisab-i3lani-muattal",
    "business-suite-wal-hisab-muattal",
    "ism-mustakhdam-baad-taattil",
    "ilgha-tansheet-hisab-instagram"
  ],
  "iadat-tansheet-hisab-insta": [
    "ikhtiraq-hisab-alinstagram",
    "istirja-mahdhuf-nihai",
    "tawthiq-hisab-instagram",
    "istirja-hisab-instagram-muattal",
    "istirja-hisab-mahdhuf",
    "farq-muattal-mahdhuf"
  ],
  "asbab-taattil-instagram": [
    "tatbiq-khariji-qabl-altaattil",
    "surat-hisab-maband",
    "ism-mustakhdam-baad-taattil",
    "fak-band-instagram",
    "ithbat-alhuiya-instagram",
    "ilgha-tansheet-hisab-instagram"
  ]
};
