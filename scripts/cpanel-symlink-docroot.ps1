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
$home = "/home/$user"
$app = "$home/instagram-recovery"

function U([string]$path) { curl.exe -s -c $cookieJar -b $cookieJar --max-time 60 "$base$tok$path" }
function UP([string]$path, [hashtable]$fields) {
  $args = @("-s","-c",$cookieJar,"-b",$cookieJar,"-X","POST","--max-time","120")
  foreach ($k in $fields.Keys) { $args += @("--data-urlencode", "$k=$($fields[$k])") }
  $args += "$base$tok$path"
  & curl.exe @args
}

Write-Output "=== probe Fileman ops ==="
foreach ($p in @(
  "/execute/Fileman/list_files?dir=$home&include_mime=0&show_hidden=1"
)) {
  $o = U $p | ConvertFrom-Json
  @($o.data) | Where-Object { $_.file -match 'public|instagram' } | ForEach-Object {
    Write-Output ("{0} {1} {2} {3}" -f $_.type, $_.nicemode, $_.file, $_.fullpath)
  }
}

# Rename public_html -> public_html.bak-20260926 then symlink
Write-Output "=== rename public_html ==="
foreach ($attempt in @(
  @{ path = "/execute/Fileman/rename_files"; fields = @{ dir = $home; "sourcefiles" = "public_html"; "destnames" = "public_html.bak-20260926" } },
  @{ path = "/execute/Fileman/mv_files"; fields = @{ dir = $home; "files" = "public_html"; "destination" = "$home/public_html.bak-20260926" } },
  @{ path = "/execute/Fileman/move_files"; fields = @{ dir = $home; "sourcefiles" = "public_html"; "destfiles" = "public_html.bak-20260926" } }
)) {
  $r = UP $attempt.path $attempt.fields
  Write-Output ("$($attempt.path) -> " + $r.Substring(0, [Math]::Min(300, $r.Length)))
}

Write-Output "=== symlink / link probes ==="
foreach ($attempt in @(
  @{ path = "/execute/Fileman/create_symlink"; fields = @{ dir = $home; name = "public_html"; target = $app } },
  @{ path = "/execute/Fileman/symlink"; fields = @{ dir = $home; "newname" = "public_html"; "linktarget" = $app } },
  @{ path = "/execute/Fileman/link_files"; fields = @{ dir = $home; "sourcefiles" = "instagram-recovery"; "destfiles" = "public_html" } }
)) {
  $r = UP $attempt.path $attempt.fields
  Write-Output ("$($attempt.path) -> " + $r.Substring(0, [Math]::Min(300, $r.Length)))
}

Write-Output "=== home after ==="
$o = U "/execute/Fileman/list_files?dir=$home&include_mime=0&show_hidden=1" | ConvertFrom-Json
@($o.data) | Where-Object { $_.file -match 'public|instagram' } | ForEach-Object {
  Write-Output ("{0} {1} {2}" -f $_.type, $_.file, $_.humansize)
}
