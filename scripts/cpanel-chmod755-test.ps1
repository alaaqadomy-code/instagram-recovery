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

# chmod 755 home (world execute+read traverse)
curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "cpanel_jsonapi_user=$user" `
  --data-urlencode "cpanel_jsonapi_apiversion=2" `
  --data-urlencode "cpanel_jsonapi_module=Fileman" `
  --data-urlencode "cpanel_jsonapi_func=fileop" `
  --data-urlencode "op=chmod" `
  --data-urlencode "sourcefiles=/home/$user" `
  --data-urlencode "metadata=755" `
  "$base$tok/json-api/cpanel" | Out-Null

curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "cpanel_jsonapi_user=$user" `
  --data-urlencode "cpanel_jsonapi_apiversion=2" `
  --data-urlencode "cpanel_jsonapi_module=Fileman" `
  --data-urlencode "cpanel_jsonapi_func=fileop" `
  --data-urlencode "op=chmod" `
  --data-urlencode "sourcefiles=$app" `
  --data-urlencode "metadata=755" `
  "$base$tok/json-api/cpanel" | Out-Null

# World-readable index and robots as static files for crawlers
$robots = @"
User-Agent: *
Allow: /
Allow: /_next/static/
Disallow: /api/

User-Agent: GPTBot
Allow: /

User-Agent: ClaudeBot
Allow: /

User-Agent: PerplexityBot
Allow: /

User-Agent: Google-Extended
Allow: /

Host: instagram-recover.com
Sitemap: https://instagram-recover.com/sitemap.xml
"@

function Save-File($dir,$file,$content) {
  $body = "dir={0}&file={1}&content={2}" -f [uri]::EscapeDataString($dir),[uri]::EscapeDataString($file),[uri]::EscapeDataString($content)
  $bf = Join-Path $env:TEMP "f-$file"; [IO.File]::WriteAllText($bf,$body)
  curl.exe -s -c $cookieJar -b $cookieJar -X POST -H "Content-Type: application/x-www-form-urlencoded" --data-binary "@$bf" "$base$tok/execute/Fileman/save_file_content" | Out-Null
}

Save-File $app "robots.txt" $robots
Save-File $app "index.html" "<!doctype html><title>DOCROOT_OK</title><h1>DOCROOT_OK</h1>"

curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 3
Write-Output ("disabled_index=" + (curl.exe -s -o NUL -w "%{http_code}" "https://instagram-recover.com/index.html"))
Write-Output ("disabled_robots=" + (curl.exe -s -o NUL -w "%{http_code}" "https://instagram-recover.com/robots.txt"))
$idx = curl.exe -s "https://instagram-recover.com/index.html"
Write-Output ("index_body=" + $idx.Substring(0,[Math]::Min(120,[Math]::Max(0,$idx.Length))))

curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Start-Sleep 5
Write-Output ("enabled_home=" + (curl.exe -s -o NUL -w "%{http_code}" "https://instagram-recover.com/"))

# Bot-like request with cookie for about
curl.exe -s -H "Cookie: ir_orig_path=/about" -o (Join-Path $env:TEMP "a.html") -w "bot_about=%{http_code}:%{size_download}`n" "https://instagram-recover.com/about"
Write-Output ("canon=" + [regex]::Match((Get-Content -Raw (Join-Path $env:TEMP "a.html")), 'rel="canonical" href="[^"]+"').Value)
