# EC-Index v2 - Data Architecture Update

## 🎯 Summary

This update implements a clean data loader architecture with:
- **5 Official Benchmarks** (3 with real JSON data, 2 with mock data ready for JSON)
- **Universal JSON Loader** (`loadSeriesFromJSON`)
- **Extended Chart Definitions** with `dataSource` and `benchmarkCode` fields
- **Smart Data Loading** with automatic fallback to mock data

---

## 📁 File Structure

```
ec-index-v2/
├── app/
│   └── charts/
│       ├── page.tsx                    # Charts index page
│       └── [slug]/
│           └── page.tsx                # Chart detail page
├── components/
│   └── charts/
│       ├── ChartCard.tsx               # Preview card component
│       └── ChartDetail.tsx             # Full chart component
└── lib/
    ├── types.ts                        # Extended type definitions
    ├── charts.ts                       # Chart definitions (8 total)
    ├── data/
    │   ├── smp-300.json                # Budget Smartphone data
    │   ├── sup-vit.json                # Supplement data
    │   └── snk-men.json                # Sneaker Supply data
    └── services/
        └── chart-service.ts            # Data loading service
```

---

## 📊 Official Benchmarks

| Code | Name | Data Source | Status |
|------|------|-------------|--------|
| **ECI-SMP-300** | Budget Smartphone Price Index | JSON | ✅ Live |
| **ECI-SUP-VIT** | Supplement Price Index | JSON | ✅ Live |
| **ECI-SNK-MEN** | Sneaker Supply Index | JSON | ✅ Live |
| **ECI-ELC-VOL** | Electronics Volatility Index | Mock | 🔶 Ready for JSON |
| **ECI-FSN-DIS** | Fashion Discount Index | Mock | 🔶 Ready for JSON |

---

## 🔧 Integration Steps

### Step 1: Copy Files

```powershell
# Create directories
mkdir lib\data -ErrorAction SilentlyContinue
mkdir lib\services -ErrorAction SilentlyContinue

# Copy from extracted ZIP:
# - lib/data/*.json → lib/data/
# - lib/services/chart-service.ts → lib/services/
# - lib/types.ts → lib/
# - lib/charts.ts → lib/
# - components/charts/*.tsx → components/charts/
# - app/charts/page.tsx → app/charts/
# - app/charts/[slug]/page.tsx → app/charts/[slug]/
```

### Step 2: Test Build

```powershell
npm run build
```

### Step 3: Deploy

```powershell
git add -A
git commit -m "feat: implement data loader architecture with 5 benchmarks"
git push
```

---

## 🏗️ Architecture Details

### Data Loading Flow

```
getChartSeries(slug)
    │
    ├─► Find chart by slug
    │
    ├─► Check dataSource === "json" ?
    │       │
    │       ├─► YES: loadSeriesFromJSON(benchmarkCode)
    │       │           │
    │       │           ├─► JSON exists? Return series
    │       │           │
    │       │           └─► No JSON? Fall back to mock
    │       │
    │       └─► NO: Return getMockSeries()
    │
    └─► Return ChartSeries[]
```

### JSON Data Structure

```json
{
  "series": [
    {
      "name": "Platform Name",
      "color": "#FF9900",
      "data": [
        { "date": "2024-01-07", "value": 248.50 }
      ]
    }
  ],
  "metadata": {
    "source": "Data source description",
    "lastUpdated": "2025-01-05",
    "sampleSize": "~5,000 products",
    "methodology": "How the data is calculated"
  }
}
```

### Chart Definition Fields

```typescript
interface ChartDefinition {
  // ... existing fields ...
  
  // NEW: Data source type
  dataSource: "json" | "mock";
  
  // NEW: Official benchmark code (null for non-benchmarks)
  benchmarkCode: BenchmarkCode | null;
}
```

---

## 🧪 Local Testing Checklist

1. **Build passes**: `npm run build` completes without errors
2. **Charts page loads**: `/charts` shows all 8 charts
3. **Benchmark badges display**: Official benchmarks show code badges
4. **JSON data loads**: ECI-SMP-300, ECI-SUP-VIT, ECI-SNK-MEN show real data
5. **Mock fallback works**: ECI-ELC-VOL, ECI-FSN-DIS show demo banner
6. **Chart detail pages**: Each chart slug resolves correctly

---

## 🔜 Adding New JSON Data

To add JSON data for a new benchmark:

1. Create JSON file in `lib/data/` (e.g., `elc-vol.json`)

2. Add import in `chart-service.ts`:
```typescript
import elcVolData from "../data/elc-vol.json";
```

3. Add to registry:
```typescript
const JSON_DATA_REGISTRY = {
  // ... existing ...
  "elc-vol": elcVolData as ChartJsonData,
};
```

4. Update chart definition:
```typescript
dataSource: "json", // Change from "mock"
```

---

## 📝 Notes

- All imports use **relative paths** (no `@/` aliases) for Turbopack compatibility
- JSON files include weekly data points for 2024
- Black Friday spike visible in November data
- Metadata is loaded from JSON when available, falls back to chart definition
