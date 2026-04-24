$root = 'c:\Users\dell\Downloads\mygirl'
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8899/')
$listener.Start()
Write-Host 'Server started at http://localhost:8899' -ForegroundColor Green

$mime = @{
    '.html'  = 'text/html; charset=utf-8'
    '.css'   = 'text/css'
    '.js'    = 'application/javascript'
    '.jpeg'  = 'image/jpeg'
    '.jpg'   = 'image/jpeg'
    '.png'   = 'image/png'
}

while ($listener.IsListening) {
    $ctx  = $listener.GetContext()
    $req  = $ctx.Request
    $res  = $ctx.Response
    $local = $req.Url.LocalPath
    if ($local -eq '/') { $local = '/index.html' }
    $file = Join-Path $root $local.TrimStart('/')
    $ext  = [System.IO.Path]::GetExtension($file)
    if (Test-Path $file) {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $res.ContentType = if ($mime[$ext]) { $mime[$ext] } else { 'application/octet-stream' }
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $res.StatusCode = 404
    }
    $res.Close()
}
