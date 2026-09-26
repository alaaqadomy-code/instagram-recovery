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
$userHome = "/home/$user"

function Api2Rename([string]$src, [string]$dst) {
  curl.exe -s -c $cookieJar -b $cookieJar -X POST `
    --data-urlencode "cpanel_jsonapi_user=$user" `
    --data-urlencode "cpanel_jsonapi_apiversion=2" `
    --data-urlencode "cpanel_jsonapi_module=Fileman" `
    --data-urlencode "cpanel_jsonapi_func=fileop" `
    --data-urlencode "op=rename" `
    --data-urlencode "sourcefiles=$src" `
    --data-urlencode "destfiles=$dst" `
    "$base$tok/json-api/cpanel"
}

Write-Output "1) public_html -> public_html.static-bak"
Write-Output (Api2Rename "$userHome/public_html" "$userHome/public_html.static-bak")

Write-Output "2) instagram-recovery -> public_html"
Write-Output (Api2Rename "$userHome/instagram-recovery" "$userHome/public_html")

Write-Output "3) update Passenger path"
$edit = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "name=instagram-recovery" `
  --data-urlencode "path=$userHome/public_html" `
  --data-urlencode "domain=instagram-recover.com" `
  --data-urlencode "base_uri=/" `
  --data-urlencode "enabled=1" `
  --data-urlencode "deployment_mode=production" `
  --data-urlencode "nodejs=/usr/bin/node" `
  "$base$tok/execute/PassengerApps/edit_application"
Write-Output $edit

# Ensure .well-known exists for SSL
curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "path=$userHome/public_html/.well-known" `
  --data-urlencode "permissions=0755" `
  "$base$tok/execute/Fileman/mkdir" | Out-Null

# Copy .well-known from bak if present
$well = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "cpanel_jsonapi_user=$user" `
  --data-urlencode "cpanel_jsonapi_apiversion=2" `
  --data-urlencode "cpanel_jsonapi_module=Fileman" `
  --data-urlencode "cpanel_jsonapi_func=fileop" `
  --data-urlencode "op=copy" `
  --data-urlencode "sourcefiles=$userHome/public_html.static-bak/.well-known" `
  --data-urlencode "destfiles=$userHome/public_html/.well-known" `
  "$base$tok/json-api/cpanel"
Write-Output "wellknown_copy=$well"

curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "dir=$userHome/public_html/tmp" `
  --data-urlencode "file=restart.txt" `
  --data-urlencode "content=docroot-swap-$(Get-Date -Format o)" `
  "$base$tok/execute/Fileman/save_file_content" | Out-Null

curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 2
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Start-Sleep 10

Write-Output "=== listing ==="
$o = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/list_files?dir=$userHome&include_mime=0&show_hidden=1" | ConvertFrom-Json
@($o.data) | Where-Object { $_.file -match 'public|instagram' } | ForEach-Object { Write-Output ("{0} {1}" -f $_.type, $_.file) }

Write-Output "=== domain docroot ==="
$d = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/DomainInfo/single_domain_data?domain=instagram-recover.com"
Write-Output $d.Substring(0, [Math]::Min(400, $d.Length))

Write-Output "=== live ==="
foreach ($p in "/","/about","/robots.txt","/sitemap.xml","/services","/_next/static/chunks/1uo6c5a4x1rlr.css","/faq") {
  $tmp = Join-Path $env:TEMP "chk.bin"
  $code = curl.exe -s -o $tmp -w "%{http_code}" "https://instagram-recover.com$p"
  $len = (Get-Item $tmp).Length
  $ct = curl.exe -s -o NUL -w "%{content_type}" "https://instagram-recover.com$p"
  Write-Output "$p -> $code $len $ct"
}
$about = curl.exe -s "https://instagram-recover.com/about"
$robots = curl.exe -s "https://instagram-recover.com/robots.txt"
Write-Output ("about_ok=" + ($about -match "من نحن"))
Write-Output ("robots_ok=" + ($robots -match "Sitemap:"))
