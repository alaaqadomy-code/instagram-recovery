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
$user = $vars.HOST_USERNAME
$app = "/home/$user/public_html"

function U([string]$path) { curl.exe -s -c $cookieJar -b $cookieJar "$base$tok$path" }
function Save([string]$file, [string]$content) {
  $body = "dir={0}&file={1}&content={2}" -f [uri]::EscapeDataString($app), [uri]::EscapeDataString($file), [uri]::EscapeDataString($content)
  $bf = Join-Path $env:TEMP "save-$file.txt"
  [IO.File]::WriteAllText($bf, $body)
  curl.exe -s -c $cookieJar -b $cookieJar -X POST -H "Content-Type: application/x-www-form-urlencoded" --data-binary "@$bf" "$base$tok/execute/Fileman/save_file_content"
}

$ht = Get-Content -Raw -Path (Join-Path $PSScriptRoot "..\.htaccess")
$js = Get-Content -Raw -Path (Join-Path $PSScriptRoot "..\server.js")
Write-Output "SKIP_HT"
Write-Output ("JS " + (Save "server.js" $js).Substring(0, 80))
curl.exe -s -c $cookieJar -b $cookieJar -X POST --data-urlencode "dir=$app/tmp" --data-urlencode "file=run-cl-create" --data-urlencode "content=1" "$base$tok/execute/Fileman/save_file_content" | Out-Null
curl.exe -s -c $cookieJar -b $cookieJar -X POST --data-urlencode "dir=$app/tmp" --data-urlencode "file=cl-create.out" --data-urlencode "content=" "$base$tok/execute/Fileman/save_file_content" | Out-Null
curl.exe -s -c $cookieJar -b $cookieJar -X POST --data-urlencode "dir=$app/tmp" --data-urlencode "file=restart.txt" --data-urlencode "content=seo-fix-$(Get-Date -Format o)" "$base$tok/execute/Fileman/save_file_content" | Out-Null
U "/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 3
U "/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
$ready = $false
for ($i = 0; $i -lt 16; $i++) {
  Start-Sleep 8
  $probe = U "/execute/Fileman/get_file_content?dir=$app/tmp&file=cl-create.out" | ConvertFrom-Json
  if ($probe.status -eq 1 -and $probe.data.content -match "APACHE") { $ready = $true; break }
  Write-Output "WAIT_CREATE $i len=$($probe.data.content.Length)"
}
if (-not $ready) { Write-Output "CREATE_NOT_FINISHED" }

$ua = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
foreach ($p in @("/","/services","/articles")) {
  $out = Join-Path $env:TEMP "seo-fix-body.html"
  curl.exe -s -A $ua -o $out -w "$p %{http_code} %{size_download}`n" "https://instagram-recover.com$p"
  $text = Get-Content -Raw -Encoding UTF8 $out
  if ($text -match "ir_orig_path") { Write-Output "  SHELL" }
  elseif ($text -match "<h1") { Write-Output "  HAS_H1" }
  else { Write-Output "  OTHER" }
}

$log = U "/execute/Fileman/get_file_content?dir=$app/tmp&file=seo-fix.log" | ConvertFrom-Json
Write-Output "LOG_STATUS $($log.status) LEN $($log.data.content.Length)"
if ($log.status -eq 1 -and $log.data.content) {
  $lines = $log.data.content -split "`n" | Select-Object -Last 2
  $lines | ForEach-Object { Write-Output $_ }
}
$where = U "/execute/Fileman/get_file_content?dir=$app/tmp&file=cl-create.out" | ConvertFrom-Json
Write-Output "CREATE_STATUS $($where.status) LEN $($where.data.content.Length)"
if ($where.status -eq 1) { Write-Output $where.data.content }
