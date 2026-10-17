@AGENTS.md

# unlockaccounts.com — استرجاع حسابات انستقرام

> اقرأ هذا الملف أولاً في أي جلسة. آخر تحديث: 2026-10-14. الردود بالعربية دائماً.

## الهوية
| البند | القيمة |
|---|---|
| الدومين | https://unlockaccounts.com (الدومين القديم instagram-recover.com أُلغي) |
| الريبو | https://github.com/alaaqadomy-code/instagram-recovery (فرع main) |
| الاستضافة | cPanel مشترك (حساب `instagra`) خلف Cloudflare proxy، تطبيق Passenger باسم `instagram-recovery` في `/home/instagra/public_html` |
| بيانات الدخول | `.env.hosting` محلي فقط؛ لا يُرفع ولا يُلصق في المحادثة |
| التقنية | Next.js 16 App Router + Turbopack، 221 مقالاً بروابط عربية |

## طريقة النشر الصحيحة (مُجرَّبة 2026-10-14)
السيرفر **لا يبني بنفسه**؛ الكود المصدري عليه قديم. البناء محلياً ثم رفع المخرجات:
1. `npm run build` محلياً (احذف `.next/server` و`.next/static` قبله لبناء نظيف).
2. حزمة بـ Git Bash: `tar --force-local -czf <tgz> --exclude='*.map' --exclude='.next/cache' --exclude='.next/diagnostics' --exclude='.next/types' --exclude='.next/trace' --exclude='.next/trace-build' --exclude='.next/turbopack' .next public`
3. رفع عبر cPanel `Fileman/upload_files`، ثم استبدال `server.js` مؤقتاً بنسخة تستخرج في الخلفية (`sh` detached) إلى مجلد مرحلي وتبدّل `.next` دفعة واحدة مع الاحتفاظ بـ `.next.old`، ثم إعادة `server.js` النظيف (3938 بايت) وإعادة تشغيل Passenger عبر `PassengerApps/disable_application` ثم `enable_application` باسم التطبيق فقط. (نموذج السكربتات: `scripts/cpanel-upload-next-tgz.ps1` و`scripts/server.extract-deploy.js`.)
4. **الفحص إلزامي قبل إعلان النجاح**: الرئيسية، `/articles`، مقالان بروابط مُرمَّزة (percent-encoded)، ملف CSS من `_next/static`، وصفحة غير موجودة تعطي 404.

## أخطاء لا تُكرَّر
- **ممنوع** cPanel `fileop extract`: يتجاهل بصمت أي مسار فيه `[` أو `]` (مثل `[turbopack]_runtime.js` و`[slug]`) فيكسر الموقع بـ 500.
- لا تنشر `.next` جزئياً أبداً؛ بناء كامل متسق أو لا شيء.
- استخدم Bash لا PowerShell مع أسماء ملفات فيها `[`.
- الروابط العربية بالبايتات الخام ترجع 500 من Next نفسه؛ المتصفحات ترمّزها فتعمل. ليس عطل نشر.
- `.next` متتبّع في git بالخطأ، وBUILD_ID مثبّت في `next.config.ts`؛ لا تغيّر ذلك دون سبب.

## حدود المشروع (لا تداخل)
نفس حساب cPanel يستضيف tarjama-office.com وjordanairporttransfer.com وsites-dashboard. أي أمر Passenger أو حذف أو استخراج يُقيَّد بمسار `/home/instagra/public_html` واسم التطبيق `instagram-recovery` فقط. لا تلمس أي مشروع آخر ولا جلسة محادثة أخرى، ولا أوامر عامة على الجهاز.

## قواعد المحتوى (لكل مقال)
1. متوافق مع SEO + AEO + GEO: كلمة مفتاحية في العنوان وH1 والوصف، إجابة مباشرة في أول فقرة، أسئلة شائعة مع FAQPage، BreadcrumbList وArticle schema، روابط داخلية للعنقود، ذكر الجمهور المستهدف (الأردن والخليج) صراحةً.
2. جاهز للذكاء الاصطناعي: فقرات قصيرة قابلة للاقتباس، قوائم وجداول وتعريفات، حقائق بأرقام وتواريخ، تحديث تاريخ المقال، إدراجه في `llms.txt`.
3. بعد النشر، تلقائياً دون طلب: تأكد أن المقال في sitemap، أرسل الرابط عبر IndexNow (Bing)، واطلب الفهرسة في Google Search Console (عبر Chrome المسجّل)، ثم أبلغ المستخدم بما أُرسل.

## ختام كل مهمة
تقرير قصير: ما تم، ما فُحص (بالأرقام)، ما تبقى. لا تعلن النجاح قبل الفحص الحي.

## حالة المشروع
- 2026-10-14: مهمة صور OG لكل مقال أُلغيت بطلب المستخدم؛ الملف محذوف من شجرة العمل. الموقع لايف على بناء متسق بدون OG. على السيرفر نسخة `.next.old` يمكن حذفها لاحقاً.
- تعديلات محلية غير محفوظة في git (إزالة لوحة admin، تحويلات روابط، ga-tag). اسأل المستخدم قبل أي commit.

## المهارات (استخدمها بدل العمل اليدوي)
- بداية الجلسة: `site-status` · بعد أي نشر أو شكوى: `site-check` · النشر: `site-deploy` · مقال جديد: `site-article` ثم `site-deploy` ثم `site-index` · الختام: `site-report`. الإعداد في `.claude/site.json`؛ لا تعدّله لتجاوز الحماية.

## درس 17 أكتوبر 2026: عزلة الزحف
**المشكلة:** 17 صفحة فقط من 242 مفهرسة في Google (7%)، و155 صفحة غير مفهرسة لا يصلها أي رابط من صفحة مفهرسة؛ حتى المحوران `/articles` (غير معروف لـGoogle) و`/services` (زُحف ولم يُفهرس) وصفحات البلدان الثماني. روابط القائمة والتذييل وحدها لا تكفي، وفهرس `/articles` كان 2.9MB لأن مكوّن العميل ArticlesExplorer كان يستقبل نص المقالات كاملاً.
**الحل المنفذ:**
- `components/CrawlLinks.tsx`: كتلة «أدلة أخرى تهمك» داخل `<main>` في الرئيسية وفي كل مقال مفهرس: فقرة تحريرية تربط `/articles` و`/services` والخدمات الست والبلدان الثمانية و`/check` و`/how-it-works` و`/faq` و`/about` و`/glossary` بنص مرساة بالكلمة المستهدفة، ثم قائمة أدلة موزعة موضوعياً.
- `lib/crawl-links.ts` (مولَّد): خريطة الصفحة المفهرسة ← المقالات غير المفهرسة. المولّد `scripts/gen-crawl-links.mjs` (تطابق كلمات العنوان والكلمات المفتاحية + القسم، سعة متوازنة، ويتجنب تكرار رابط موجود أصلاً في الصفحة). مدخلاته: `scripts/dump-articles-meta.cjs` + جرد Search Console (inspect) + `scripts/crawl-existing-links.mjs`. التحقق: `scripts/verify-crawl-links.mjs <base> <inspect.json>`.
- `/articles`: البطاقات تستقبل حقول الملخص فقط (ArticleSummary) → الصفحة من 2.9MB إلى ~400KB مع بقاء كل الروابط.
**القاعدة:** كل صفحة جديدة (مقال، خدمة، بلد) تُربط عند نشرها من **صفحتين مفهرستين على الأقل** داخل المحتوى (أضفها في `lib/crawl-links.ts` تحت صفحتين مفهرستين موضوعياً، أو أعد تشغيل المولّد بجرد حديث). وعندما تتغير قائمة المفهرسات (جرد Search Console جديد) أعد توليد الخريطة. لا تمرر كائنات المقال كاملة إلى مكوّن "use client".
