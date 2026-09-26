$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$envFile = Join-Path $root ".env.hosting"
$vars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { $vars[$Matches[1].Trim()] = $Matches[2].Trim().Trim('"') }
}
$base = "http://www.instagram-recover.com:2082"
$cookieJar = Join-Path $env:TEMP "cpanel-restore-ck.txt"
Remove-Item $cookieJar -ErrorAction SilentlyContinue
$login = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "user=$($vars.HOST_USERNAME)" `
  --data-urlencode "pass=$($vars.HOST_PASSWORD)" `
  "$base/login/?login_only=1"
$tok = ($login | ConvertFrom-Json).security_token
$user = $vars.HOST_USERNAME
$app = "/home/$user/public_html"
$clean = [IO.File]::ReadAllText((Join-Path $root "server.js"))
$body = "dir={0}&file={1}&content={2}" -f [uri]::EscapeDataString($app), [uri]::EscapeDataString("server.js"), [uri]::EscapeDataString($clean)
$bf = Join-Path $env:TEMP "server-clean-body.txt"
[IO.File]::WriteAllText($bf, $body)
$sv = curl.exe -s -c $cookieJar -b $cookieJar -X POST -H "Content-Type: application/x-www-form-urlencoded" --data-binary "@$bf" "$base$tok/execute/Fileman/save_file_content"
Write-Output ("server.js ok=" + ($sv -match '"status":1'))
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 2
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Start-Sleep 8
$code = curl.exe -s -o NUL -w "%{http_code}" --max-time 40 -H "Cookie: ir_orig_path=/" "https://instagram-recover.com/"
Write-Output "HOME=$code"
