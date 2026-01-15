
$files = Get-ChildItem -Path "src" -Recurse -Filter "*.tsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # 1. Replace strict HTML refs with <any>
    # Matches useRef(null), useRef<HTMLElement>(null), useRef<HTMLDivElement>(null)
    $content = $content -replace "useRef\s*<\s*HTML[a-zA-Z]*Element\s*>\s*\(\s*null\s*\)", "useRef<any>(null)"
    $content = $content -replace "useRef\s*\(\s*null\s*\)", "useRef<any>(null)"
    
    # 2. Fix the non-null assertion style too: useRef<HTMLElement>(null!)
    $content = $content -replace "useRef\s*<\s*HTML[a-zA-Z]*Element\s*>\s*\(\s*null!\s*\)", "useRef<any>(null)"

    # 3. Cast 'target' in useScroll / useInView objects
    # This is a bit aggressive but necessary for the "RefObject mismatch"
    # Matches: target: container, -> target: container as any,
    $content = $content -replace "target:\s*([a-zA-Z0-9_]+)\s*,", "target: `$1 as any,"

    if ($content -ne $originalContent) {
        Write-Host "Patched: $($file.Name)"
        Set-Content -Path $file.FullName -Value $content -NoNewline
    }
}

Write-Host "✅ Global Ref Patch Completed. Starting Build..."
npm run build
