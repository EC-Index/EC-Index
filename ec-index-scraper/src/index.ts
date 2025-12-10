// src/index.ts
/**
 * EC-Index Data Collector
 * Main entry point for data collection
 * 
 * Usage:
 *   npm run dev                    # Run single collection
 *   npm run dev -- --all           # Collect all benchmarks
 *   npm run dev -- --benchmark ECI-SMP-300
 *   npm run dev -- --export        # Export to website format
 */

import dotenv from "dotenv";
dotenv.config();

import { BENCHMARK_CONFIGS, CollectionResult, BenchmarkConfig } from "./models/types";
import { ebayCollector } from "./collectors/ebay-collector";
import { idealoCollector } from "./collectors/idealo-collector";
import { geizhalsCollector } from "./collectors/geizhals-collector";
import { amazonDMACollector } from "./collectors/amazon-dma-collector";
import { aggregator } from "./utils/aggregator";
import { logger } from "./utils/logger";

// Parse command line arguments
function parseArgs(): { benchmarks: string[]; exportOnly: boolean } {
  const args = process.argv.slice(2);
  
  if (args.includes("--export")) {
    return { benchmarks: [], exportOnly: true };
  }
  
  if (args.includes("--all")) {
    return { benchmarks: Object.keys(BENCHMARK_CONFIGS), exportOnly: false };
  }
  
  const benchmarkIndex = args.indexOf("--benchmark");
  if (benchmarkIndex !== -1 && args[benchmarkIndex + 1]) {
    return { benchmarks: [args[benchmarkIndex + 1]], exportOnly: false };
  }
  
  // Default: collect all
  return { benchmarks: Object.keys(BENCHMARK_CONFIGS), exportOnly: false };
}

/**
 * Collect data for a single benchmark from all configured platforms
 */
async function collectBenchmark(config: BenchmarkConfig): Promise<CollectionResult[]> {
  const results: CollectionResult[] = [];
  
  logger.info(`\n${"=".repeat(60)}`);
  logger.info(`Collecting: ${config.name} (${config.code})`);
  logger.info(`Platforms: ${config.platforms.join(", ")}`);
  logger.info(`${"=".repeat(60)}\n`);

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
          logger.warn(`No collector for platform: ${platform}`);
          continue;
      }

      results.push(result);
      
      logger.info(`✓ ${platform}: ${result.validProducts} products collected`);

    } catch (error: any) {
      logger.error(`✗ ${platform}: Collection failed`, { error: error.message });
    }
  }

  return results;
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  const startTime = Date.now();
  const { benchmarks, exportOnly } = parseArgs();

  logger.info("\n╔══════════════════════════════════════════════════════════╗");
  logger.info("║           EC-Index Data Collector v1.0                   ║");
  logger.info("║           Legal E-Commerce Data Collection               ║");
  logger.info("╚══════════════════════════════════════════════════════════╝\n");

  // Export only mode
  if (exportOnly) {
    logger.info("Export mode - generating website JSON files...\n");
    
    for (const benchmarkCode of Object.keys(BENCHMARK_CONFIGS)) {
      const exported = aggregator.exportToWebsiteFormat(benchmarkCode);
      if (exported) {
        logger.info(`✓ Exported ${benchmarkCode}`);
      } else {
        logger.warn(`✗ No data to export for ${benchmarkCode}`);
      }
    }
    
    logger.info("\nExport complete!");
    return;
  }

  // Collection mode
  logger.info(`Collecting data for ${benchmarks.length} benchmark(s)...\n`);
  
  const allResults: CollectionResult[] = [];

  for (const benchmarkCode of benchmarks) {
    const config = BENCHMARK_CONFIGS[benchmarkCode];
    
    if (!config) {
      logger.error(`Unknown benchmark: ${benchmarkCode}`);
      continue;
    }

    const results = await collectBenchmark(config);
    allResults.push(...results);

    // Aggregate and save results
    const aggregated = aggregator.aggregateResults(results);
    
    for (const [code, data] of aggregated) {
      aggregator.saveToHistory(code, data);
    }
  }

  // Summary
  const totalProducts = allResults.reduce((sum, r) => sum + r.validProducts, 0);
  const totalErrors = allResults.reduce((sum, r) => sum + r.errors.length, 0);
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  logger.info("\n" + "═".repeat(60));
  logger.info("COLLECTION SUMMARY");
  logger.info("═".repeat(60));
  logger.info(`Total products collected: ${totalProducts.toLocaleString()}`);
  logger.info(`Total errors: ${totalErrors}`);
  logger.info(`Duration: ${duration}s`);
  logger.info("═".repeat(60) + "\n");

  // Auto-export after collection
  logger.info("Exporting to website format...\n");
  
  for (const benchmarkCode of benchmarks) {
    const exported = aggregator.exportToWebsiteFormat(benchmarkCode);
    if (exported) {
      logger.info(`✓ Exported ${benchmarkCode} (${exported.series.length} series)`);
    }
  }

  logger.info("\n✅ Collection complete!\n");
}

// Run
main().catch((error) => {
  logger.error("Fatal error", { error: error.message, stack: error.stack });
  process.exit(1);
});
