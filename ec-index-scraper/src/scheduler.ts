// src/scheduler.ts
/**
 * Scheduled Data Collection
 * 
 * Runs automatic data collection on a schedule.
 * Recommended: Run weekly (Sundays at 3 AM) for consistent index data.
 * 
 * For production, consider using:
 * - GitHub Actions (scheduled workflows)
 * - Vercel Cron Jobs
 * - AWS Lambda + CloudWatch Events
 * - Railway/Render scheduled tasks
 */

import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import { BENCHMARK_CONFIGS, CollectionResult } from "./models/types";
import { ebayCollector } from "./collectors/ebay-collector";
import { idealoCollector } from "./collectors/idealo-collector";
import { geizhalsCollector } from "./collectors/geizhals-collector";
import { amazonDMACollector } from "./collectors/amazon-dma-collector";
import { aggregator } from "./utils/aggregator";
import { logger } from "./utils/logger";

/**
 * Run collection for all benchmarks
 */
async function runFullCollection(): Promise<void> {
  logger.info("╔══════════════════════════════════════════════════════════╗");
  logger.info("║           SCHEDULED COLLECTION STARTED                   ║");
  logger.info(`║           ${new Date().toISOString()}             ║`);
  logger.info("╚══════════════════════════════════════════════════════════╝");

  const allResults: CollectionResult[] = [];

  for (const [benchmarkCode, config] of Object.entries(BENCHMARK_CONFIGS)) {
    logger.info(`\nCollecting ${benchmarkCode}...`);

    for (const platform of config.platforms) {
      try {
        let result: CollectionResult;

        switch (platform) {
          case "ebay":
            result = await ebayCollector.collect(config);
            break;
          case "idealo":
            result = await idealoCollector.collect(config);
            break;
          case "geizhals":
            result = await geizhalsCollector.collect(config);
            break;
          case "amazon":
            result = await amazonDMACollector.collect(config);
            break;
          default:
            continue;
        }

        allResults.push(result);
        logger.info(`  ✓ ${platform}: ${result.validProducts} products`);

      } catch (error: any) {
        logger.error(`  ✗ ${platform}: ${error.message}`);
      }
    }

    // Aggregate and save
    const results = allResults.filter(r => r.benchmark === benchmarkCode);
    const aggregated = aggregator.aggregateResults(results);
    
    for (const [code, data] of aggregated) {
      aggregator.saveToHistory(code, data);
    }

    // Export to website format
    aggregator.exportToWebsiteFormat(benchmarkCode);
  }

  const totalProducts = allResults.reduce((sum, r) => sum + r.validProducts, 0);
  logger.info(`\n✅ Scheduled collection complete: ${totalProducts} products total`);
}

// ============================================================================
// CRON SCHEDULES
// ============================================================================

// Main weekly collection: Sunday at 3:00 AM
cron.schedule("0 3 * * 0", async () => {
  logger.info("Starting weekly scheduled collection...");
  try {
    await runFullCollection();
  } catch (error: any) {
    logger.error("Scheduled collection failed", { error: error.message });
  }
}, {
  timezone: "Europe/Berlin"
});

// Mid-week update: Wednesday at 3:00 AM (optional, for more frequent data)
cron.schedule("0 3 * * 3", async () => {
  logger.info("Starting mid-week collection...");
  try {
    await runFullCollection();
  } catch (error: any) {
    logger.error("Mid-week collection failed", { error: error.message });
  }
}, {
  timezone: "Europe/Berlin"
});

// Health check: Daily at 9:00 AM
cron.schedule("0 9 * * *", () => {
  logger.info("Scheduler health check: Running");
}, {
  timezone: "Europe/Berlin"
});

logger.info("╔══════════════════════════════════════════════════════════╗");
logger.info("║           EC-Index Scheduler Started                     ║");
logger.info("║                                                          ║");
logger.info("║  Schedule:                                               ║");
logger.info("║  - Weekly collection: Sunday 3:00 AM (Europe/Berlin)     ║");
logger.info("║  - Mid-week update: Wednesday 3:00 AM (Europe/Berlin)    ║");
logger.info("║  - Health check: Daily 9:00 AM                           ║");
logger.info("║                                                          ║");
logger.info("║  Press Ctrl+C to stop                                    ║");
logger.info("╚══════════════════════════════════════════════════════════╝");

// Keep process running
process.on("SIGINT", () => {
  logger.info("Scheduler stopped");
  process.exit(0);
});
