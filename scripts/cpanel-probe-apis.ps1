$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$envFile = Join-Path $root ".env.hosting"
$vars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { $vars[$Matches[1].Trim()] = $Matches[2].Trim().Trim('"') }
}
$base = "http://www.instagram-recover.com:2082"
$cookieJar = Join-Path $env:TEMP "cpanel-api-ck.txt"
Remove-Item $cookieJar -ErrorAction SilentlyContinue
$login = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "user=$($vars.HOST_USERNAME)" `
  --data-urlencode "pass=$($vars.HOST_PASSWORD)" `
  "$base/login/?login_only=1"
$tok = ($login | ConvertFrom-Json).security_token

Write-Output "=== PassengerApps ensure_deps variants ==="
foreach ($body in @(
  "name=instagram-recovery",
  "name=instagram-recovery&type=npm",
  "name=instagram-recovery&dependency=npm",
  "name=instagram-recovery&app_path=/home/instagra/public_html"
)) {
  $r = curl.exe -s -c $cookieJar -b $cookieJar -X POST --max-time 30 --data $body "$base$tok/execute/PassengerApps/ensure_deps"
  Write-Output "BODY=$body"
  Write-Output $r.Substring(0, [Math]::Min(300, $r.Length))
  Write-Output "---"
}

Write-Output "=== Fileman extract / upload related ==="
foreach ($fn in @("extract_files","extract","upload_files","upload","mkdir","trash_files","remove_files","fileop","compress_files")) {
  $r = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/$fn"
  Write-Output "$fn : $($r.Substring(0, [Math]::Min(220, $r.Length)))"
}

Write-Output "=== live curl verbose codes ==="
foreach ($url in @("https://instagram-recover.com/","http://instagram-recover.com/","https://www.instagram-recover.com/")) {
  $out = Join-Path $env:TEMP ("probe-" + [Guid]::NewGuid().ToString("n").Substring(0,6) + ".bin")
  $code = curl.exe -s -L --max-time 20 -o $out -w "%{http_code} size=%{size_download} err=%{errormsg}" $url
  Write-Output "$url -> $code"
  if (Test-Path $out) {
    $bytes = [IO.File]::ReadAllBytes($out)
    $preview = [Text.Encoding]::UTF8.GetString($bytes, 0, [Math]::Min(120, $bytes.Length))
    Write-Output ("  preview=" + ($preview -replace "`r|`n"," "))
  }
}

Write-Output "=== list Application Manager / VersionControl ==="
foreach ($mod in @("VersionControl","VersionControlDeployment","TwoFactorAuth","SSH","Terminal")) {
  $r = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/$mod/list"
  Write-Output "$mod/list : $($r.Substring(0, [Math]::Min(250, $r.Length)))"
}
