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
if (-not $tok) { throw "cpanel login failed" }

function U([string]$path) { curl.exe -s -c $cookieJar -b $cookieJar "$base$tok$path" }

$calls = @(
  "/execute/ModSecurity/list_domains",
  "/execute/ModSecurity/get_settings?domain=instagram-recover.com",
  "/execute/NginxCaching/get_cache_config"
)
foreach ($c in $calls) {
  $o = U $c
  Write-Output "==== $c"
  Write-Output $o.Substring(0, [Math]::Min(500, $o.Length))
}

Write-Output "==== disable_all_rules"
$off = curl.exe -s -c $cookieJar -b $cookieJar -X POST --data-urlencode "domain=instagram-recover.com" "$base$tok/execute/ModSecurity/disable_all_rules"
Write-Output $off.Substring(0, [Math]::Min(400, $off.Length))
Start-Sleep 2
$out = Join-Path $env:TEMP "seo-modsec.html"
curl.exe -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" -o $out -w "HOME %{http_code} %{size_download}`n" "https://instagram-recover.com/"
$text = Get-Content -Raw -Encoding UTF8 $out
if ($text -match "ir_orig_path") { "SHELL" } elseif ($text -match "<h1") { "HAS_H1" } else { "OTHER" }
