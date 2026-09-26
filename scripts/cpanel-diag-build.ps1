$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$envFile = Join-Path $root ".env.hosting"
$vars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { $vars[$Matches[1].Trim()] = $Matches[2].Trim().Trim('"') }
}
$base = "http://www.instagram-recover.com:2082"
$cookieJar = Join-Path $env:TEMP "cpanel-diag-ck.txt"
Remove-Item $cookieJar -ErrorAction SilentlyContinue
$login = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "user=$($vars.HOST_USERNAME)" `
  --data-urlencode "pass=$($vars.HOST_PASSWORD)" `
  "$base/login/?login_only=1"
$tok = ($login | ConvertFrom-Json).security_token
$user = $vars.HOST_USERNAME
$app = "/home/$user/public_html"

Write-Output "=== needs-build ==="
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app/tmp&file=needs-build"
Write-Output ""
Write-Output "=== server.js first 800 chars ==="
$sj = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app&file=server.js"
Write-Output $sj.Substring(0, [Math]::Min(1200, $sj.Length))
Write-Output ""
Write-Output "=== passenger stderr / logs ==="
$files = @("stderr.log", "passenger.log", "build.log", "npm-debug.log", "error_log")
foreach ($f in $files) {
  $r = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app&file=$f"
  if ($r -match '"status":1' -and $r -notmatch '"errors"') {
    Write-Output "FOUND $f length=$($r.Length)"
    Write-Output $r.Substring(0, [Math]::Min(1500, $r.Length))
  } else {
    Write-Output "missing $f"
  }
}
Write-Output ""
Write-Output "=== list tmp ==="
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/list_files?dir=$app/tmp&include_mime=0&include_hash=0&types=file"
Write-Output ""
Write-Output "=== home .next BUILD_ID ==="
$bid = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app/.next&file=BUILD_ID"
Write-Output $bid.Substring(0, [Math]::Min(400, $bid.Length))
Write-Output ""
Write-Output "=== package.json scripts ==="
$pkg = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app&file=package.json"
Write-Output $pkg.Substring(0, [Math]::Min(800, $pkg.Length))
Write-Output ""
Write-Output "=== live home without cookie ==="
$code = curl.exe -s -o (Join-Path $env:TEMP "home500.html") -w "%{http_code}" --max-time 30 "https://instagram-recover.com/"
Write-Output "HOME=$code size=$((Get-Item (Join-Path $env:TEMP 'home500.html')).Length)"
Get-Content (Join-Path $env:TEMP "home500.html") -TotalCount 40
