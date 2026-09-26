$ErrorActionPreference = "Stop"
$envFile = Join-Path $PSScriptRoot "..\.env.hosting"
$vars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { $vars[$Matches[1].Trim()] = $Matches[2].Trim().Trim('"') }
}
$base = "http://www.instagram-recover.com:2082"
$cookieJar = Join-Path $env:TEMP "cpanel-cookies.txt"
Remove-Item $cookieJar -ErrorAction SilentlyContinue
$login = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "user=$($vars.HOST_USERNAME)" `
  --data-urlencode "pass=$($vars.HOST_PASSWORD)" `
  "$base/login/?login_only=1"
$tok = ($login | ConvertFrom-Json).security_token
$user = $vars.HOST_USERNAME
$app = "/home/$user/public_html"

function Save-File($file, $content) {
  $body = "dir={0}&file={1}&content={2}" -f [uri]::EscapeDataString($app), [uri]::EscapeDataString($file), [uri]::EscapeDataString($content)
  $bf = Join-Path $env:TEMP "up-$file"; [IO.File]::WriteAllText($bf, $body)
  return curl.exe -s -c $cookieJar -b $cookieJar -X POST -H "Content-Type: application/x-www-form-urlencoded" --data-binary "@$bf" "$base$tok/execute/Fileman/save_file_content"
}

$server = Get-Content -Raw (Join-Path $PSScriptRoot "..\server.js")
Write-Output "server=$(Save-File 'server.js' $server)"
$cpanel = Get-Content -Raw (Join-Path $PSScriptRoot "..\.cpanel.yml")
Write-Output "cpanel=$(Save-File '.cpanel.yml' $cpanel)"

# Remove probe files
foreach ($f in @("index.html","phpinfo-probe.php","robots.txt")) {
  $del = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
    --data-urlencode "cpanel_jsonapi_user=$user" `
    --data-urlencode "cpanel_jsonapi_apiversion=2" `
    --data-urlencode "cpanel_jsonapi_module=Fileman" `
    --data-urlencode "cpanel_jsonapi_func=fileop" `
    --data-urlencode "op=trash" `
    --data-urlencode "sourcefiles=$app/$f" `
    "$base$tok/json-api/cpanel"
  Write-Output "trash $f -> $($del.Substring(0,[Math]::Min(120,$del.Length)))"
}

curl.exe -s -c $cookieJar -b $cookieJar -X POST --data-urlencode "dir=$app/tmp" --data-urlencode "file=restart.txt" --data-urlencode "content=final-$(Get-Date -Format o)" "$base$tok/execute/Fileman/save_file_content" | Out-Null
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 2
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Start-Sleep 8

Write-Output "=== verification ==="
curl.exe -s -H "Cookie: ir_orig_path=/about" -o (Join-Path $env:TEMP "v-about.html") -w "about=%{http_code}:%{size_download}`n" "https://instagram-recover.com/about"
curl.exe -s -H "Cookie: ir_orig_path=/robots.txt" -o (Join-Path $env:TEMP "v-robots.txt") -w "robots=%{http_code}:%{content_type}:%{size_download}`n" "https://instagram-recover.com/robots.txt"
curl.exe -s -H "Cookie: ir_orig_path=/sitemap.xml" -o (Join-Path $env:TEMP "v-sitemap.xml") -w "sitemap=%{http_code}:%{content_type}:%{size_download}`n" "https://instagram-recover.com/sitemap.xml"
curl.exe -s -H "Cookie: ir_orig_path=/_next/static/chunks/1uo6c5a4x1rlr.css" -o (Join-Path $env:TEMP "v.css") -w "css=%{http_code}:%{content_type}:%{size_download}`n" "https://instagram-recover.com/_next/static/chunks/1uo6c5a4x1rlr.css"
Write-Output ("about_canon=" + [regex]::Match((Get-Content -Raw (Join-Path $env:TEMP "v-about.html")), 'rel="canonical" href="[^"]+"').Value)
Write-Output ("robots_head=" + (Get-Content -Raw (Join-Path $env:TEMP "v-robots.txt")).Substring(0,80))
Write-Output ("sitemap_head=" + (Get-Content -Raw (Join-Path $env:TEMP "v-sitemap.xml")).Substring(0,80))
Write-Output ("css_head=" + (Get-Content -Raw (Join-Path $env:TEMP "v.css")).Substring(0,40))
