# Erzeugt die Arbeitsbilder in src/assets/images aus den Originalen in assets-src/.
# Originale (bis 10 MB) bleiben ausserhalb von Git; Astro optimiert die Arbeitsbilder beim Build weiter.
# Aufruf: pwsh scripts/prepare-images.ps1

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root 'assets-src'
$out = Join-Path $root 'src/assets/images'
New-Item -ItemType Directory -Force $out | Out-Null

$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 90L

function Save-Crop($file, $name, $x, $y, $w, $h, $maxWidth = 2400) {
  $img = [System.Drawing.Image]::FromFile((Join-Path $src $file))
  if ($w -le 0) { $w = $img.Width - $x }
  if ($h -le 0) { $h = $img.Height - $y }
  $scale = [Math]::Min([double]1, [double]$maxWidth / $w)
  $tw = [int]($w * $scale); $th = [int]($h * $scale)
  $bmp = New-Object System.Drawing.Bitmap $tw, $th
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $tw, $th), (New-Object System.Drawing.Rectangle $x, $y, $w, $h), [System.Drawing.GraphicsUnit]::Pixel)
  $bmp.Save((Join-Path $out "$name.jpg"), $jpeg, $params)
  "$name.jpg  ${tw}x${th}"
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
}

# Hero: Dose mit Zutaten, Spruch oben weggeschnitten
Save-Crop 'Ohni-Zwifel_fritz.jpg' 'hero-dose-zutaten' 0 1486 0 0
# Einzelne Zutaten fuer die Einflug-Animation (Argument 1)
Save-Crop 'Ohni-Zwifel_fritz.jpg' 'zutat-basilikum' 0 1588 724 508
Save-Crop 'Ohni-Zwifel_fritz.jpg' 'zutat-kartoffeln' 114 1956 636 457
Save-Crop 'Ohni-Zwifel_fritz.jpg' 'zutat-peperoni-knoblauch' 1181 1689 635 699
Save-Crop 'Ohni-Zwifel_fritz.jpg' 'zutat-dose' 743 1530 445 858
# Produkte auf Schwarz (bis freigestellte PNGs vom Shooting da sind)
Save-Crop 'Produktepreise_Versand.jpg' 'produkt-nachfueller' 272 363 572 827
Save-Crop 'Produktepreise_Versand.jpg' 'produkt-dose' 1218 538 365 720
# Person mit Dose (Spruch weggeschnitten) fuer "Unsere Geschichte"
Save-Crop 'Hero_Startbild_Fritz.jpg' 'team-person-dose' 1400 1050 2350 2950 1600

# Gelben Pfeil-Rest am linken Rand des Nachfuellers entfernen (Kraftpapier-Farbe bzw. Schwarz)
$bagPath = Join-Path $out 'produkt-nachfueller.jpg'
$bag = New-Object System.Drawing.Bitmap ([System.Drawing.Image]::FromFile($bagPath))
for ($y = 270; $y -lt 460; $y++) {
  $kraft = $bag.GetPixel(170, $y)
  for ($x = 0; $x -lt 160; $x++) {
    $p = $bag.GetPixel($x, $y)
    $edge = [int](($y - 75) * 130 / 725) + 4
    if ($x -lt $edge) { $bag.SetPixel($x, $y, [System.Drawing.Color]::Black); continue }
    if ($p.R -gt 150 -and $p.G -gt 120 -and ($p.G - $p.B) -gt 70) {
      $bag.SetPixel($x, $y, $kraft)
    }
  }
}
$bag.Save("$bagPath.tmp", $jpeg, $params); $bag.Dispose()
Move-Item -Force "$bagPath.tmp" $bagPath
'produkt-nachfueller.jpg  Pfeil entfernt'
# Stimmungsbilder Dosen + Nachfueller
Save-Crop '_DSC6483.JPG' 'stimmung-dosen-nachfueller' 0 0 0 0
Save-Crop '_DSC6485.JPG' 'stimmung-dosen-nachfueller-hoch' 1500 0 3000 4000 1600
Copy-Item -Force (Join-Path $src 'Logo_FRITZ_kreis.png') (Join-Path $out 'logo-fritz.png')
Copy-Item -Force (Join-Path $out 'hero-dose-zutaten.jpg') (Join-Path $root 'public/og-image.jpg')
