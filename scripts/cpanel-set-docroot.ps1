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

function U([string]$path) { curl.exe -s -c $cookieJar -b $cookieJar --max-time 60 "$base$tok$path" }
function UP([string]$path, [hashtable]$fields) {
  $args = @("-s","-c",$cookieJar,"-b",$cookieJar,"-X","POST","--max-time","120")
  foreach ($k in $fields.Keys) { $args += @("--data-urlencode", "$k=$($fields[$k])") }
  $args += "$base$tok$path"
  & curl.exe @args
}

Write-Output "=== probe docroot APIs ==="
foreach ($p in @(
  "/execute/DomainInfo/set_docroot?domain=instagram-recover.com&docroot=$app",
  "/execute/DomainInfo/set_main_domain_docroot?dir=$app",
  "/execute/DocRoot/setdocroot?domain=instagram-recover.com&docroot=$app",
  "/execute/Variables/set_user_meta_data?name=test"
)) {
  Write-Output "---- GET $p"
  Write-Output (U $p).Substring(0, [Math]::Min(350, (U $p).Length))
}

Write-Output "=== POST set docroot variants ==="
foreach ($attempt in @(
  @{ path = "/execute/DomainInfo/set_docroot"; fields = @{ domain = "instagram-recover.com"; docroot = $app } },
  @{ path = "/execute/DomainInfo/set_main_domain_docroot"; fields = @{ dir = $app } },
  @{ path = "/execute/DomainInfo/change_docroot"; fields = @{ domain = "instagram-recover.com"; documentroot = $app } },
  @{ path = "/execute/PassengerApps/edit_application"; fields = @{ name = "instagram-recovery"; path = $app; domain = "instagram-recover.com"; base_uri = "/"; enabled = "1"; deployment_mode = "production"; nodejs = "/usr/bin/node" } }
)) {
  Write-Output "---- POST $($attempt.path)"
  $r = UP $attempt.path $attempt.fields
  Write-Output $r.Substring(0, [Math]::Min(500, $r.Length))
}

Write-Output "=== verify docroot ==="
Write-Output (U "/execute/DomainInfo/single_domain_data?domain=instagram-recover.com")
