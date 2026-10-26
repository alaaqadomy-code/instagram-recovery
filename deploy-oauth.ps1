# نشر unlockaccounts على Cloudflare Pages باعتماد wrangler المخزّن (OAuth).
# سبب وجوده: CLOUDFLARE_API_TOKEN في البيئة طوله حرف واحد، وwrangler يفضّله
# على الاعتماد المخزّن فيفشل بـ "fetch failed". تفريغه هنا محليّ لهذه العملية فقط.
# بلا --force: المشروع موجود، و--force يحوّل الأمر إلى Workers.
$env:CLOUDFLARE_API_TOKEN = ''
$env:CLOUDFLARE_API_KEY = ''
Remove-Item Env:CLOUDFLARE_API_TOKEN -ErrorAction SilentlyContinue
Remove-Item Env:CLOUDFLARE_API_KEY -ErrorAction SilentlyContinue
npx --yes wrangler@latest pages deploy out --project-name unlockaccounts --branch main
