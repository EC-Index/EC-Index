# EC-Index Data Collector

**Legal e-commerce market data collection for EC-Index benchmarks.**

## 🎯 Overview

This tool collects publicly available pricing and listing data from major e-commerce platforms to power the EC-Index market benchmarks.

### Supported Platforms

| Platform | Method | Status | Legal Basis |
|----------|--------|--------|-------------|
| **Amazon** | DMA Public Data | ✅ Ready | EU DMA 2022/1925 |
| **eBay** | Official Browse API | ✅ Ready | Official API |
| **Idealo** | Public price comparison | ✅ Ready | Public Data |
| **Geizhals** | Public price comparison | ✅ Ready | Public Data |

### Benchmarks

| Code | Name | Platforms |
|------|------|-----------|
| **ECI-SMP-300** | Budget Smartphone Price Index | Amazon, eBay, Idealo |
| **ECI-SUP-VIT** | Supplement Price Index | Amazon, eBay |
| **ECI-SNK-MEN** | Sneaker Supply Index | Amazon, eBay, Idealo |

---

## ⚖️ Legal Compliance

This tool is designed for **100% legal** data collection:

### EU Digital Markets Act (DMA) - Amazon Data

Amazon is designated as a "Gatekeeper" under EU Regulation 2022/1925 (Digital Markets Act).

**What this means:**
- Art. 6(10): Amazon must provide fair access to ranking and search data
- Art. 6(11): No self-preferencing with publicly available data
- Recital 62: Third parties can access publicly visible product information

**Data we collect under DMA protection:**
- ✅ Product title
- ✅ Current price
- ✅ Best Seller Rank (BSR)
- ✅ Star rating & review count
- ✅ Number of sellers
- ✅ Category
- ✅ Prime eligibility
- ✅ Stock status

**What we DON'T do:**
- ❌ No authentication bypass
- ❌ No personal data collection
- ❌ No private seller information
- ❌ No aggressive crawling

### Other Platforms

✅ **eBay**: Official Browse API (free tier, 5,000 calls/day)  
✅ **Idealo/Geizhals**: Public price comparison data  
✅ Rate limited (1-2 req/sec) - respectful crawling  
✅ Identifies itself via User-Agent  
✅ Only public product pages  

---

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/EC-Index/EC-Index.git
cd EC-Index/ec-index-scraper
npm install
```

### 2. Configure API Keys

```bash
cp .env.example .env
# Edit .env with your API credentials
```

**Minimum required:** eBay API credentials (free tier available)

### 3. Run Collection

```bash
# Collect all benchmarks
npm run dev -- --all

# Collect specific benchmark
npm run dev -- --benchmark ECI-SMP-300

# Export to website JSON format
npm run dev -- --export
```

---

## 🔑 API Setup

### eBay Browse API (Recommended - Free)

1. Go to [eBay Developer Program](https://developer.ebay.com/)
2. Create an account and application
3. Get your **App ID** and **Cert ID**
4. Add to `.env`:
   ```
   EBAY_APP_ID=your_app_id
   EBAY_CERT_ID=your_cert_id
   ```

**Free tier:** 5,000 API calls/day

### Amazon PA-API (Optional)

1. Join [Amazon Associates](https://affiliate-program.amazon.de/)
2. Apply for PA-API access
3. Add credentials to `.env`

**Note:** Requires active affiliate sales to maintain access.

### Idealo (No API needed)

Idealo data is collected from public price comparison pages. No API key required.

---

## 📁 Project Structure

```
ec-index-scraper/
├── src/
│   ├── index.ts              # Main entry point
│   ├── scheduler.ts          # Cron scheduler
│   ├── collectors/
│   │   ├── base-collector.ts # Abstract base class
│   │   ├── ebay-collector.ts # eBay Browse API
│   │   ├── idealo-collector.ts # Idealo scraper
│   │   └── amazon-collector.ts # Amazon PA-API
│   ├── models/
│   │   └── types.ts          # TypeScript types
│   └── utils/
│       ├── http-client.ts    # Rate-limited HTTP
│       ├── logger.ts         # Winston logger
│       └── aggregator.ts     # Data aggregation
├── data/
│   ├── raw/                  # Raw collected data
│   ├── processed/            # Aggregated history
│   └── export/               # Website JSON files
├── .github/
│   └── workflows/
│       └── collect-data.yml  # GitHub Actions
└── package.json
```

---

## ⏰ Automated Collection

### Option 1: GitHub Actions (Recommended)

The included GitHub Actions workflow runs automatically:
- **Sunday 3:00 AM UTC** - Weekly collection
- Commits new data directly to the repository
- Triggers Vercel rebuild (optional)

**Setup:**
1. Add secrets to your GitHub repository:
   - `EBAY_APP_ID`
   - `EBAY_CERT_ID`
   - `VERCEL_DEPLOY_HOOK` (optional)

2. Enable Actions in your repository settings

### Option 2: Local Scheduler

```bash
npm run schedule
```

Runs continuously with cron-based scheduling.

### Option 3: External Cron

Use services like:
- Railway (scheduled tasks)
- Render (cron jobs)
- AWS Lambda + CloudWatch

---

## 📊 Data Output

### Raw Data (per collection)

```json
// data/raw/ECI-SMP-300_ebay_2025-01-15.json
[
  {
    "productId": "123456789",
    "platform": "ebay",
    "price": 219.99,
    "currency": "EUR",
    "seller": "techstore_de",
    "sellerRating": 0.98,
    "condition": "new",
    "url": "https://...",
    "collectedAt": "2025-01-15T03:00:00Z"
  }
]
```

### Aggregated History

```json
// data/processed/ECI-SMP-300_history.json
{
  "2025-01-15_ebay": [
    {
      "date": "2025-01-15",
      "platform": "ebay",
      "averagePrice": 224.50,
      "medianPrice": 219.99,
      "sampleSize": 487
    }
  ]
}
```

### Website Export

```json
// data/export/smp-300.json
{
  "series": [
    {
      "name": "eBay",
      "color": "#E53238",
      "data": [
        { "date": "2024-01-07", "value": 238.90 },
        { "date": "2024-01-14", "value": 237.50 }
      ]
    }
  ],
  "metadata": {
    "source": "EC-Index Data Collection",
    "lastUpdated": "2025-01-15",
    "sampleSize": "~5,000 products"
  }
}
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `EBAY_APP_ID` | Yes | eBay API application ID |
| `EBAY_CERT_ID` | Yes | eBay API certificate ID |
| `EBAY_MARKETPLACE` | No | Default: EBAY_DE |
| `AMAZON_ACCESS_KEY` | No | Amazon PA-API access key |
| `AMAZON_SECRET_KEY` | No | Amazon PA-API secret key |
| `AMAZON_PARTNER_TAG` | No | Amazon affiliate tag |
| `RATE_LIMIT_RPS` | No | Requests per second (default: 1) |
| `MAX_RETRIES` | No | Retry attempts (default: 3) |
| `LOG_LEVEL` | No | info, debug, warn, error |

### Benchmark Configuration

Edit `src/models/types.ts` to modify:
- Search queries
- Price filters
- Excluded keywords
- Platform selection

---

## 📈 Roadmap

- [x] eBay Browse API integration
- [x] Idealo price scraper
- [x] Amazon PA-API support
- [x] GitHub Actions automation
- [ ] Geizhals integration
- [ ] Check24 integration
- [ ] Historical data backfill
- [ ] Real-time price alerts

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file for details.

---

## ⚠️ Disclaimer

This tool collects only publicly available data for market research purposes. Users are responsible for complying with the terms of service of any platform they collect data from. The EC-Index team is not responsible for misuse of this tool.
