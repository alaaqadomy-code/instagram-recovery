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
$app = "/home/$user/instagram-recovery"

function U([string]$path) { curl.exe -s -c $cookieJar -b $cookieJar "$base$tok$path" }
function UP([string]$path, [string[]]$fields) {
  $args = @("-s","-c",$cookieJar,"-b",$cookieJar,"-X","POST")
  foreach ($f in $fields) { $args += @("--data-urlencode", $f) }
  $args += "$base$tok$path"
  & curl.exe @args
}

Write-Output "=== enable ==="
Write-Output (U "/execute/PassengerApps/enable_application?name=instagram-recovery")

Write-Output "=== list ==="
Write-Output (U "/execute/PassengerApps/list_applications")

Write-Output "=== build-status.txt ==="
$bs = U "/execute/Fileman/get_file_content?dir=/home/$user&file=build-status.txt"
Write-Output $bs.Substring(0, [Math]::Min(2000, $bs.Length))

Write-Output "=== error logs if any ==="
$logs = U "/execute/Fileman/list_files?dir=$app&include_mime=0&show_hidden=1" | ConvertFrom-Json
@($logs.data) | Where-Object { $_.file -match 'log|err|stderr|stdout|passenger' } | ForEach-Object { Write-Output $_.file }

# Touch restart again
UP "/execute/Fileman/save_file_content" @(
  "dir=$app/tmp",
  "file=restart.txt",
  "content=reenable-$(Get-Date -Format o)"
) | Out-Null
Write-Output "restart touched"
