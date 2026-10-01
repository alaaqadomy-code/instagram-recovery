$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$envFile = Join-Path $root ".env.hosting"
$vars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { $vars[$Matches[1].Trim()] = $Matches[2].Trim().Trim('"') }
}
$base = "http://46.105.32.154:2082"
$cookieJar = Join-Path $env:TEMP "cpanel-extract-bg-ck.txt"
Remove-Item $cookieJar -ErrorAction SilentlyContinue
$login = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "user=$($vars.HOST_USERNAME)" `
  --data-urlencode "pass=$($vars.HOST_PASSWORD)" `
  "$base/login/?login_only=1"
$tok = ($login | ConvertFrom-Json).security_token
if (-not $tok) { throw "login failed" }
$user = $vars.HOST_USERNAME
$app = "/home/$user/public_html"
$irapp = "/home/$user/irapp"

function Save-Remote([string]$dir, [string]$file, [string]$content) {
  $body = "dir={0}&file={1}&content={2}" -f `
    [uri]::EscapeDataString($dir), `
    [uri]::EscapeDataString($file), `
    [uri]::EscapeDataString($content)
  $bf = Join-Path $env:TEMP ("cpanel-body-" + [guid]::NewGuid().ToString("n") + ".txt")
  [IO.File]::WriteAllText($bf, $body)
  $sv = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
    -H "Content-Type: application/x-www-form-urlencoded" `
    --data-binary "@$bf" `
    "$base$tok/execute/Fileman/save_file_content"
  Remove-Item $bf -Force -ErrorAction SilentlyContinue
  return ($sv -match '"status":1')
}

Write-Output "disable"
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 2

curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "cpanel_jsonapi_user=$user" `
  --data-urlencode "cpanel_jsonapi_apiversion=2" `
  --data-urlencode "cpanel_jsonapi_module=Fileman" `
  --data-urlencode "cpanel_jsonapi_func=fileop" `
  --data-urlencode "op=trash" `
  --data-urlencode "sourcefiles=$app/tmp/extract-running" `
  "$base$tok/json-api/cpanel" | Out-Null

curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "cpanel_jsonapi_user=$user" `
  --data-urlencode "cpanel_jsonapi_apiversion=2" `
  --data-urlencode "cpanel_jsonapi_module=Fileman" `
  --data-urlencode "cpanel_jsonapi_func=fileop" `
  --data-urlencode "op=trash" `
  --data-urlencode "sourcefiles=$app/tmp/extract-log.txt" `
  "$base$tok/json-api/cpanel" | Out-Null

$bg = [IO.File]::ReadAllText((Join-Path $root "scripts\server.extract-bg.js"))
Write-Output ("bg_server=" + (Save-Remote $app "server.js" $bg))

Write-Output "enable"
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Start-Sleep 3
$trigger = "000"
for ($t = 1; $t -le 5; $t++) {
  $trigger = curl.exe -s -o NUL -w "%{http_code}" --max-time 25 --resolve "unlockaccounts.com:443:46.105.32.154" "https://unlockaccounts.com/"
  Write-Output ("trigger {0}={1}" -f $t, $trigger)
  if ($trigger -eq "200") { break }
  Start-Sleep 3
}

$done = $false
for ($i = 1; $i -le 40; $i++) {
  Start-Sleep 10
  $elog = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app/tmp&file=extract-log.txt"
  $done = $elog -match "EXTRACT_DONE"
  $tail = ""
  if ($elog -match '"content":"([^"]*)"') { $tail = $Matches[1] }
  $lines = ($tail -split '\\n' | Select-Object -Last 3) -join " | "
  Write-Output ("poll {0} done={1} {2}" -f $i, $done, $lines)
  if ($done) { break }
}

if (-not $done) { throw "extract did not finish" }

$localId = [IO.File]::ReadAllText((Join-Path $root ".next\BUILD_ID")).Trim()
$bid = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app/.next&file=BUILD_ID"
Write-Output ("BUILD_ID_ok=" + ($bid -match [regex]::Escape($localId)))
Write-Output ("BUILD_ID_local=" + $localId)

$clean = [IO.File]::ReadAllText((Join-Path $root "server.js"))
Write-Output ("clean_public=" + (Save-Remote $app "server.js" $clean))
Write-Output ("clean_irapp=" + (Save-Remote $irapp "server.js" $clean))

curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 3
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Start-Sleep 8

$htmlPath = Join-Path $env:TEMP "ua-live.html"
$code = curl.exe -s -o $htmlPath -w "%{http_code}" --max-time 60 --resolve "unlockaccounts.com:443:46.105.32.154" -H "Cookie: ir_orig_path=/" "https://unlockaccounts.com/"
Write-Output "HOME=$code size=$((Get-Item $htmlPath).Length)"
$html = [IO.File]::ReadAllText($htmlPath)
Write-Output ("canon=" + ($html -match 'https://unlockaccounts.com'))
Write-Output ("old_canon=" + ($html -match 'https://instagram-recover.com'))
Write-Output ("brand=" + ($html -match 'Unlock Accounts'))
Write-Output ("email=" + ($html -match 'hello@unlockaccounts.com'))
Write-Output ("bytes=" + $html.Length)
Write-Output ("has_canonical_tag=" + ($html -match 'rel="canonical"'))
