$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$envFile = Join-Path $root ".env.hosting"
$vars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { $vars[$Matches[1].Trim()] = $Matches[2].Trim().Trim('"') }
}
$base = "http://www.instagram-recover.com:2082"
$cookieJar = Join-Path $env:TEMP "cpanel-upload-tgz-ck.txt"
Remove-Item $cookieJar -ErrorAction SilentlyContinue
$login = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "user=$($vars.HOST_USERNAME)" `
  --data-urlencode "pass=$($vars.HOST_PASSWORD)" `
  "$base/login/?login_only=1"
$tok = ($login | ConvertFrom-Json).security_token
$user = $vars.HOST_USERNAME
$app = "/home/$user/public_html"
$tgz = Join-Path $root "next-deploy.tgz"
$serverJs = Join-Path $root "scripts\server.extract-deploy.js"

Write-Output ("tgz_bytes=" + (Get-Item $tgz).Length)

$trash = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "cpanel_jsonapi_user=$user" `
  --data-urlencode "cpanel_jsonapi_apiversion=2" `
  --data-urlencode "cpanel_jsonapi_module=Fileman" `
  --data-urlencode "cpanel_jsonapi_func=fileop" `
  --data-urlencode "op=trash" `
  --data-urlencode "sourcefiles=$app/next-deploy.tgz" `
  "$base$tok/json-api/cpanel"
Write-Output ("trash_tgz=" + ($trash -match '"result":1|"status":1'))

Write-Output "=== upload next-deploy.tgz ==="
$up = curl.exe -s -c $cookieJar -b $cookieJar -X POST --max-time 600 `
  -F "dir=$app" `
  -F "file-1=@$tgz;filename=next-deploy.tgz;type=application/gzip" `
  "$base$tok/execute/Fileman/upload_files"
Write-Output $up.Substring(0, [Math]::Min(1500, $up.Length))

# Upload extract server.js via save_file_content
$content = [IO.File]::ReadAllText($serverJs)
$body = "dir={0}&file={1}&content={2}" -f `
  [uri]::EscapeDataString($app), `
  [uri]::EscapeDataString("server.js"), `
  [uri]::EscapeDataString($content)
$bf = Join-Path $env:TEMP "server-extract-body.txt"
[IO.File]::WriteAllText($bf, $body)
$sv = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  -H "Content-Type: application/x-www-form-urlencoded" `
  --data-binary "@$bf" `
  "$base$tok/execute/Fileman/save_file_content"
Write-Output ("server.js ok=" + ($sv -match '"status":1'))

# Confirm tarball on server
$chk = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/list_files?dir=$app&types=file&include_mime=0&include_hash=0"
Write-Output ("has_tgz=" + ($chk -match 'next-deploy\.tgz'))

# Recycle passenger to trigger extract
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 3
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Write-Output "Passenger recycled; waiting for extract..."
Start-Process -FilePath curl.exe -ArgumentList @("-s","-o",(Join-Path $env:TEMP "after-extract.html"),"-w","%{http_code}","--max-time","180","https://instagram-recover.com/") -WindowStyle Hidden
$gone = $false
for ($i = 1; $i -le 18; $i++) {
  Start-Sleep 10
  $chk2 = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/list_files?dir=$app&types=file&include_mime=0&include_hash=0"
  $gone = -not ($chk2 -match 'next-deploy\.tgz')
  Write-Output ("poll {0} has_tgz={1}" -f $i, (-not $gone))
  if ($gone) { break }
}

Write-Output "=== extract-log ==="
$elog = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app/tmp&file=extract-log.txt"
Write-Output $elog.Substring(0, [Math]::Min(1500, $elog.Length))

Write-Output "=== BUILD_ID ==="
$bid = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app/.next&file=BUILD_ID"
Write-Output $bid.Substring(0, [Math]::Min(400, $bid.Length))

if ($gone) {
  $clean = [IO.File]::ReadAllText((Join-Path $root "server.js"))
  $body2 = "dir={0}&file={1}&content={2}" -f [uri]::EscapeDataString($app), [uri]::EscapeDataString("server.js"), [uri]::EscapeDataString($clean)
  $bf2 = Join-Path $env:TEMP "server-clean-body.txt"; [IO.File]::WriteAllText($bf2, $body2)
  curl.exe -s -c $cookieJar -b $cookieJar -X POST -H "Content-Type: application/x-www-form-urlencoded" --data-binary "@$bf2" "$base$tok/execute/Fileman/save_file_content" | Out-Null
  curl.exe -s -c $cookieJar -b $cookieJar -X POST --data-urlencode "dir=$app/tmp" --data-urlencode "file=restart.txt" --data-urlencode "content=clean-$(Get-Date -Format o)" "$base$tok/execute/Fileman/save_file_content" | Out-Null
  curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
  Start-Sleep 2
  curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
  Start-Sleep 8
  Write-Output "restored clean server.js"
} else {
  Write-Output "extract NOT finished; left extract server.js in place"
}

Write-Output "=== live verify ==="
$code2 = curl.exe -s -o (Join-Path $env:TEMP "live-final.html") -w "%{http_code}" --max-time 45 -H "Cookie: ir_orig_path=/" "https://instagram-recover.com/"
Write-Output "HOME=$code2 size=$((Get-Item (Join-Path $env:TEMP 'live-final.html') -ErrorAction SilentlyContinue).Length)"
$html = Get-Content (Join-Path $env:TEMP "live-final.html") -Raw -ErrorAction SilentlyContinue
if ($html) {
  Write-Output ("title=" + [regex]::Match($html, '<title>([^<]+)</title>').Groups[1].Value)
}
$article = curl.exe -s --max-time 45 -H "Cookie: ir_orig_path=/articles/istirja-hisab-instagram-muattal" "https://instagram-recover.com/articles/istirja-hisab-instagram-muattal"
Write-Output ("article_len=" + $article.Length)
Write-Output ("og=" + [regex]::Match($article, 'og:image" content="([^"]+)"').Groups[1].Value)
Write-Output ("twitter_img=" + ($article -match 'name="twitter:image"'))
Write-Output ("wa_075E54=" + ($article -match '#075E54'))
$hdr = curl.exe -s -D - -o NUL --max-time 30 -H "Cookie: ir_orig_path=/" "https://instagram-recover.com/"
($hdr -split "`n" | Select-String -Pattern "HTTP/|strict-transport|Strict-Transport|x-powered" | ForEach-Object { $_.Line.Trim() })
$img = curl.exe -s -o NUL -w "%{http_code}" --max-time 30 "https://instagram-recover.com/images/articles/taattil-huquq-nashr.png"
Write-Output "IMG=$img"
$about = curl.exe -s --max-time 30 -H "Cookie: ir_orig_path=/about" "https://instagram-recover.com/about"
Write-Output ("about_canon=" + [regex]::Match($about, 'rel="canonical" href="([^"]+)"').Groups[1].Value)
