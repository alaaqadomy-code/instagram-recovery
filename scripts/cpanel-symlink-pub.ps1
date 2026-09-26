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
$userHome = "/home/$user"
$app = "$userHome/instagram-recovery"

function Api2([hashtable]$extra) {
  $args = @(
    "-s","-c",$cookieJar,"-b",$cookieJar,"-X","POST",
    "--data-urlencode","cpanel_jsonapi_user=$user",
    "--data-urlencode","cpanel_jsonapi_apiversion=2",
    "--data-urlencode","cpanel_jsonapi_module=$($extra.module)",
    "--data-urlencode","cpanel_jsonapi_func=$($extra.func)"
  )
  foreach ($k in $extra.Keys) {
    if ($k -eq "module" -or $k -eq "func") { continue }
    $args += @("--data-urlencode", "$k=$($extra[$k])")
  }
  $args += "$base$tok/json-api/cpanel"
  & curl.exe @args
}

# Try symlink via fileop link
Write-Output "=== link ==="
$link = Api2 @{
  module = "Fileman"; func = "fileop"; op = "link"
  sourcefiles = $app
  destfiles = "$userHome/public_html"
}
Write-Output $link

$link2 = Api2 @{
  module = "Fileman"; func = "fileop"; op = "symlink"
  sourcefiles = $app
  destfiles = "$userHome/public_html"
}
Write-Output $link2

# Fallback: copy tree is too heavy; try mkdir + link differently
# Some cPanels: op=link creates hardlink; for dirs need symlink

# If still missing public_html, recreate by renaming bak back temporarily and...
Write-Output "=== listing ==="
$o = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/list_files?dir=$userHome&include_mime=0&show_hidden=1" | ConvertFrom-Json
@($o.data) | Where-Object { $_.file -match 'public|instagram' } | ForEach-Object {
  Write-Output ("{0} {1} {2}" -f $_.type, $_.file, $_.nicemode)
}

# Try UAPI Fileman::mkdir then ... 
# Alternative: move app contents - too dangerous

# Use API2 Terminal or Shell if available
Write-Output "=== shell ln -s ==="
$sh = Api2 @{
  module = "Shell"; func = "exec"
  command = "ln -sfn $app $userHome/public_html && ls -la $userHome | head -20"
}
Write-Output $sh.Substring(0, [Math]::Min(800, $sh.Length))
