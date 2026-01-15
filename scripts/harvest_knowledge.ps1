# ==========================================
# TITAN KNOWLEDGE HARVESTER v2.0
# ==========================================
$RootPath = "C:\Users\Starwek\Documents\MARVYN\TitanFit-V2"
$OutputFile = "$RootPath\RECOVERED_KNOWLEDGE_BASE.md"

Write-Host "🚀 Protocole de moisson haute précision..." -ForegroundColor Cyan

# On vide le fichier
"" | Out-File -FilePath $OutputFile -Encoding UTF8

# On cherche récursivement en excluant EXPLICITEMENT les dossiers lourds
$Files = Get-ChildItem -Path $RootPath -Recurse -Filter *.md | Where-Object { 
    $_.FullName -notmatch "node_modules" -and 
    $_.FullName -notmatch ".git" -and 
    $_.FullName -notmatch ".next" -and
    $_.FullName -notmatch "dist" -and
    $_.FullName -notmatch ".gemini" -and
    $_.FullName -ne $OutputFile
}

$Count = 0
foreach ($File in $Files) {
    $Count++
    Write-Host "Harvesting [$Count]: $($File.FullName.Replace($RootPath, ''))" -ForegroundColor Green
    
    $Content = Get-Content -Path $File.FullName -Raw
    $Section = "`n`n================================================================================" +
    "`n📂 SOURCE: $($File.FullName)" +
    "`n================================================================================`n" +
    $Content
               
    Add-Content -Path $OutputFile -Value $Section
}

Write-Host "`n✅ Moisson terminée. $Count fichiers récupérés." -ForegroundColor Cyan
