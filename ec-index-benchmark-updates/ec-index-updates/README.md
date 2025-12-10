# EC-Index Benchmark Updates

## Übersicht

Dieses Update fügt die **drei offiziellen EC-Index Benchmarks** zum bestehenden Chart-System hinzu:

| Benchmark Code | Name | Beschreibung |
|----------------|------|--------------|
| **ECI-SMP-300** | Budget Smartphone Price Index | Durchschnittspreis für Smartphones unter €300 |
| **ECI-SUP-VIT** | Supplement Price Index | Preisentwicklung von Nahrungsergänzungsmitteln |
| **ECI-SNK-MEN** | Sneaker Supply Index | Anzahl aktiver Herren-Sneaker-Angebote |

## Enthaltene Dateien

```
ec-index-updates/
├── app/
│   └── charts/
│       └── [slug]/
│           └── page.tsx          # Aktualisierte Chart-Detail-Seite
├── components/
│   └── charts/
│       └── ChartDetail.tsx       # Aktualisierte Chart-Komponente
└── lib/
    ├── charts.ts                 # Chart-Definitionen mit Benchmarks
    ├── types.ts                  # TypeScript-Typen
    ├── services/
    │   └── chart-service.ts      # Neuer Chart-Service
    └── data/
        ├── eci-smp-300.json      # Mock-Daten Smartphone Index
        ├── eci-sup-vit.json      # Mock-Daten Supplement Index
        └── eci-snk-men.json      # Mock-Daten Sneaker Index
```

## Integration in dein Projekt

### Schritt 1: Dateien kopieren

```powershell
# In deinem ec-index Projekt-Verzeichnis:

# 1. Erstelle das data-Verzeichnis
mkdir lib\data

# 2. Erstelle das services-Verzeichnis  
mkdir lib\services

# 3. Kopiere die JSON-Dateien
# (aus dem ZIP in lib/data/)

# 4. Kopiere chart-service.ts
# (aus dem ZIP in lib/services/)

# 5. Ersetze lib/charts.ts
# (mit der neuen Version aus dem ZIP)

# 6. Ersetze lib/types.ts
# (mit der neuen Version aus dem ZIP)

# 7. Ersetze components/charts/ChartDetail.tsx
# (mit der neuen Version aus dem ZIP)

# 8. Ersetze app/charts/[slug]/page.tsx
# (mit der neuen Version aus dem ZIP)
```

### Schritt 2: Build prüfen

```powershell
npm run build
```

Falls Fehler auftreten, prüfe:
- Sind alle Imports korrekt? (@/lib/..., @/components/...)
- Ist `"use client";` in Client-Komponenten vorhanden?

### Schritt 3: Deploy

```powershell
git add -A
git commit -m "feat: add official EC-Index benchmarks (ECI-SMP-300, ECI-SUP-VIT, ECI-SNK-MEN)"
git push
```

## Änderungen im Detail

### lib/charts.ts
- Drei neue offizielle Benchmarks als Featured Charts
- Deutsche Beschreibungen und Methodik
- Benchmark-Codes im Titel (z.B. "Budget Smartphone Price Index (ECI-SMP-300)")

### lib/services/chart-service.ts (NEU)
- `getChartSeries(slug)` - Hauptfunktion für Datenzugriff
- `getChartWithSeries(slug)` - Chart mit Daten kombiniert
- `isOfficialBenchmark(slug)` - Prüft auf Benchmark-Status
- Vorbereitet für spätere JSON-Daten-Integration

### app/charts/[slug]/page.tsx
- Nutzt jetzt `getChartSeries()` statt direktem `getMockSeries()`
- Zeigt Benchmark-Badge für offizielle Benchmarks
- Mock-Daten-Hinweis für Transparenz

### components/charts/ChartDetail.tsx
- Akzeptiert `series` als optionalen Prop
- Fallback auf `getMockSeries()` wenn keine series übergeben

## Wichtige Hinweise

### Mock-Daten
Alle Daten sind aktuell **Mock-Daten** zu Demonstrationszwecken. 
Die Methodik entspricht jedoch bereits der geplanten realen Berechnung.

### Spätere Umstellung auf echte Daten
Der Chart-Service ist so gebaut, dass du später einfach auf echte Daten umstellen kannst:

1. JSON-Imports in `chart-service.ts` aktivieren
2. `transformJsonToSeries()` Funktion aktivieren
3. Switch in `getChartSeries()` auf JSON-Daten umstellen

### TypeScript-Fehler ignorieren (falls nötig)
Falls Build-Fehler auftreten, ist bereits in `next.config.ts` konfiguriert:
```typescript
typescript: {
  ignoreBuildErrors: true,
}
```

## Support

Bei Fragen zur Integration wende dich an das Entwicklungsteam.
