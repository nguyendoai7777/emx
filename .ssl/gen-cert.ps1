# ===============================
# Generate localhost SSL cert + key (SAN enabled)
# ===============================

# --- YOUR PATH HERE ---
$basePath = "C:\Workspace\prx\jp-appliances\apps\fe-console\pem"
# ------------------------

$certName = "localhost-dev"
$certPath = "Cert:\CurrentUser\My"

$crtFile = "$basePath\localhost.crt"
$keyFile = "$basePath\localhost.key"
$pfxFile = "$basePath\localhost.pfx"
$pfxPassword = "1234"

Write-Host "🔹 Creating SAN certificate for localhost..."

# 1. Create cert with SAN
$cert = New-SelfSignedCertificate `
    -Subject "CN=localhost" `
    -DnsName "localhost" `
    -CertStoreLocation $certPath `
    -FriendlyName $certName `
    -KeyExportPolicy Exportable `
    -NotAfter (Get-Date).AddYears(2)

Write-Host "✔ Certificate created."

# 2. Export PFX (private key)
$password = ConvertTo-SecureString -String $pfxPassword -Force -AsPlainText

Export-PfxCertificate `
    -Cert $cert `
    -FilePath $pfxFile `
    -Password $password | Out-Null

Write-Host "✔ Exported: $pfxFile"

# 3. Export CRT
Export-Certificate `
    -Cert $cert `
    -FilePath $crtFile | Out-Null

Write-Host "✔ Exported: $crtFile"

# 4. Extract private key with OpenSSL
Write-Host "🔹 Extracting private key (.key)..."

openssl pkcs12 -in $pfxFile -nocerts -nodes -password pass:$pfxPassword | `
    openssl rsa -out $keyFile

Write-Host "✔ Exported: $keyFile"

# 5. Import CRT into Trusted Root CA
Write-Host "🔹 Importing certificate to Trusted Root CA..."

Import-Certificate `
    -FilePath $crtFile `
    -CertStoreLocation Cert:\CurrentUser\Root | Out-Null

Write-Host "`n🎉 DONE!"
Write-Host "Saved to:"
Write-Host "  📄 $crtFile"
Write-Host "  🔑 $keyFile"

