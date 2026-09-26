$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$envFile = Join-Path $root ".env.hosting"
$vars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { $vars[$Matches[1].Trim()] = $Matches[2].Trim().Trim('"') }
}
$base = "http://www.instagram-recover.com:2082"
$cookieJar = Join-Path $env:TEMP "cpanel-diag2-ck.txt"
Remove-Item $cookieJar -ErrorAction SilentlyContinue
$login = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "user=$($vars.HOST_USERNAME)" `
  --data-urlencode "pass=$($vars.HOST_PASSWORD)" `
  "$base/login/?login_only=1"
$tok = ($login | ConvertFrom-Json).security_token
$user = $vars.HOST_USERNAME
$app = "/home/$user/public_html"
$HOMEU = "/home/$user"

function Get-Remote([string]$dir, [string]$file) {
  curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$dir&file=$file"
}

Write-Output "=== build-status.txt ==="
$r = Get-Remote $HOMEU "build-status.txt"
Write-Output $r.Substring(0, [Math]::Min(3000, $r.Length))
Write-Output ""
Write-Output "=== req-debug.log tail ==="
$r = Get-Remote "$app/tmp" "req-debug.log"
Write-Output $r.Substring([Math]::Max(0, $r.Length - 2000))
Write-Output ""
Write-Output "=== list .next ==="
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/list_files?dir=$app/.next&include_mime=0&include_hash=0&types=file%7Cdir"
Write-Output ""
Write-Output "=== passenger apps ==="
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/list_applications"
Write-Output ""
Write-Output "=== node version via ensure_deps? ==="
# try reading any node logs in home
$candidates = @(
  @{d=$HOMEU; f="stderr.log"},
  @{d="$HOMEU/logs"; f="stderr.log"},
  @{d=$app; f=".passenger_restart"},
  @{d="$HOMEU/.passenger"; f="log"},
  @{d="$app/tmp"; f="build-error.log"}
)
foreach ($c in $candidates) {
  $r = Get-Remote $c.d $c.f
  if ($r -match '"status":1' -and $r -notmatch '"The file') {
    Write-Output "FOUND $($c.d)/$($c.f) len=$($r.Length)"
    Write-Output $r.Substring(0, [Math]::Min(1500, $r.Length))
  } else {
    Write-Output "no $($c.d)/$($c.f)"
  }
}
Write-Output ""
Write-Output "=== list home root files ==="
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/list_files?dir=$HOMEU&include_mime=0&include_hash=0&types=file"
