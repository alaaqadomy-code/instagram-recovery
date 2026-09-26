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

$html = "<!doctype html><title>DOCROOT_INDEX_TEST</title><h1>DOCROOT_INDEX_TEST</h1>"
$body = "dir={0}&file={1}&content={2}" -f [uri]::EscapeDataString($app), [uri]::EscapeDataString("index.html"), [uri]::EscapeDataString($html)
$bf = Join-Path $env:TEMP "idx-body.txt"; [IO.File]::WriteAllText($bf, $body)
curl.exe -s -c $cookieJar -b $cookieJar -X POST -H "Content-Type: application/x-www-form-urlencoded" --data-binary "@$bf" "$base$tok/execute/Fileman/save_file_content" | Out-Null

# Temporarily disable passenger to see raw docroot behavior
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 3
Write-Output "=== passenger DISABLED ==="
$c1 = curl.exe -s "https://instagram-recover.com/"
Write-Output ("disabled_home_code check: " + (curl.exe -s -o NUL -w "%{http_code}" "https://instagram-recover.com/"))
Write-Output ("has_DOCROOT_TEST=" + ($c1 -match "DOCROOT_INDEX_TEST"))
Write-Output ("has_403shtml_or_next=" + ($c1 -match "403|استرجاع|not-found|غير موجودة"))
Write-Output $c1.Substring(0, [Math]::Min(300, $c1.Length))

curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Start-Sleep 5
Write-Output "=== passenger ENABLED ==="
$c2 = curl.exe -s "https://instagram-recover.com/"
Write-Output ("enabled_code=" + (curl.exe -s -o NUL -w "%{http_code}" "https://instagram-recover.com/"))
Write-Output ("has_DOCROOT_TEST=" + ($c2 -match "DOCROOT_INDEX_TEST"))
Write-Output ("has_next=" + ($c2 -match "استرجاع انستا"))
