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
$src = Join-Path $PSScriptRoot "..\server.js"
$content = Get-Content -Raw -Path $src

$body = "dir={0}&file={1}&content={2}" -f [uri]::EscapeDataString($app), [uri]::EscapeDataString("server.js"), [uri]::EscapeDataString($content)
$bf = Join-Path $env:TEMP "srv-body.txt"; [IO.File]::WriteAllText($bf, $body)
Write-Output (curl.exe -s -c $cookieJar -b $cookieJar -X POST -H "Content-Type: application/x-www-form-urlencoded" --data-binary "@$bf" "$base$tok/execute/Fileman/save_file_content")

curl.exe -s -c $cookieJar -b $cookieJar -X POST --data-urlencode "dir=$app/tmp" --data-urlencode "file=restart.txt" --data-urlencode "content=cookie-fix-$(Get-Date -Format o)" "$base$tok/execute/Fileman/save_file_content" | Out-Null
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 2
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Start-Sleep 8

# Simulate browser: first request gets bootstrap, second with cookie gets real page
$cj = Join-Path $env:TEMP "site-cookies.txt"
Remove-Item $cj -ErrorAction SilentlyContinue

Write-Output "=== first about (expect bootstrap) ==="
$r1 = curl.exe -s -c $cj -b $cj -w "`nHTTP=%{http_code} SIZE=%{size_download}" "https://instagram-recover.com/about"
Write-Output $r1.Substring(0, [Math]::Min(250, $r1.Length))

Write-Output "=== cookies after first ==="
Get-Content $cj -ErrorAction SilentlyContinue

Write-Output "=== second about with cookie ==="
$r2 = curl.exe -s -c $cj -b $cj -w "`nHTTP=%{http_code} SIZE=%{size_download}" "https://instagram-recover.com/about"
Write-Output ("CANON=" + [regex]::Match($r2, 'rel="canonical" href="[^"]+"').Value)
Write-Output ("HTTP_LINE=" + ($r2 -split "`n" | Select-Object -Last 1))

Write-Output "=== robots second ==="
Remove-Item $cj -ErrorAction SilentlyContinue
curl.exe -s -c $cj -b $cj "https://instagram-recover.com/robots.txt" | Out-Null
$robots = curl.exe -s -c $cj -b $cj "https://instagram-recover.com/robots.txt"
Write-Output $robots.Substring(0, [Math]::Min(120, $robots.Length))

Write-Output "=== css second ==="
Remove-Item $cj -ErrorAction SilentlyContinue
curl.exe -s -c $cj -b $cj "https://instagram-recover.com/_next/static/chunks/1uo6c5a4x1rlr.css" | Out-Null
$cssCode = curl.exe -s -c $cj -b $cj -o (Join-Path $env:TEMP "t.css") -w "%{http_code} %{content_type} %{size_download}" "https://instagram-recover.com/_next/static/chunks/1uo6c5a4x1rlr.css"
Write-Output $cssCode
