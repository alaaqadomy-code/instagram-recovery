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

function Save-File([string]$dir, [string]$file, [string]$content) {
  $body = "dir={0}&file={1}&content={2}" -f [uri]::EscapeDataString($dir), [uri]::EscapeDataString($file), [uri]::EscapeDataString($content)
  $bf = Join-Path $env:TEMP "save-$file.txt"; [IO.File]::WriteAllText($bf, $body)
  curl.exe -s -c $cookieJar -b $cookieJar -X POST -H "Content-Type: application/x-www-form-urlencoded" --data-binary "@$bf" "$base$tok/execute/Fileman/save_file_content"
}

# Probe PHP
Save-File $app "phpinfo-probe.php" "<?php echo 'PHP_OK '.PHP_VERSION;' ?>" | Out-Null
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 3
Write-Output "=== PHP with passenger off ==="
Write-Output ("php_code=" + (curl.exe -s -o NUL -w "%{http_code}" "https://instagram-recover.com/phpinfo-probe.php"))
Write-Output ("php_body=" + (curl.exe -s "https://instagram-recover.com/phpinfo-probe.php").Substring(0,[Math]::Min(100,500)))
Write-Output ("index_code=" + (curl.exe -s -o NUL -w "%{http_code}" "https://instagram-recover.com/index.html"))

# Check home dir mode via API2
$ls = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "cpanel_jsonapi_user=$user" `
  --data-urlencode "cpanel_jsonapi_apiversion=2" `
  --data-urlencode "cpanel_jsonapi_module=Fileman" `
  --data-urlencode "cpanel_jsonapi_func=listfiles" `
  --data-urlencode "dir=/home" `
  --data-urlencode "showdotfiles=1" `
  "$base$tok/json-api/cpanel"
Write-Output "=== /home listing snippet ==="
Write-Output $ls.Substring(0, [Math]::Min(1500, $ls.Length))

curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
