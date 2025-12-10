// src/collectors/idealo-collector.ts
/**
 * Idealo Price Collector - IMPROVED VERSION
 * 
 * Much more conservative rate limiting to avoid 429 errors.
 */

import * as cheerio from "cheerio";
import { BaseCollector, SearchOptions } from "./base-collector";
import { PriceDataPoint, BenchmarkConfig, CollectionResult } from "../models/types";
import { HttpClient } from "../utils/http-client";
import { logger } from "../utils/logger";

export class IdealoCollector extends BaseCollector {
  private httpClient: HttpClient;
  private baseUrl = "https://www.idealo.de";

  constructor() {
    super("idealo");
    this.httpClient = new HttpClient({ 
      rateLimit: 0.1, // 1 request per 10 seconds!
      maxRetries: 1,
      timeout: 20000,
    });
  }

  private randomDelay(min: number, max: number): Promise<void> {
    const delay = min + Math.random() * (max - min);
    logger.debug(`Waiting ${Math.round(delay / 1000)}s...`);
    return new Promise(r => setTimeout(r, delay));
  }

  private getHeaders(): Record<string, string> {
    return {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "de-DE,de;q=0.9,en;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Cache-Control": "max-age=0",
    };
  }

  async search(query: string, options: SearchOptions = {}): Promise<PriceDataPoint[]> {
    const encodedQuery = encodeURIComponent(query);
    let url = `${this.baseUrl}/preisvergleich/MainSearchProductCategory.html?q=${encodedQuery}`;
    
    try {
      const response = await this.httpClient.get(url, {
        headers: this.getHeaders(),
      });

      return this.parseSearchResults(response.data, options.maxResults || 20);
    } catch (error: any) {
      if (error.response?.status === 429) {
        logger.warn("Idealo rate limited, long backoff...");
        await this.randomDelay(60000, 120000);
      }
      logger.error(`Idealo search failed: ${error.message}`);
      return [];
    }
  }

  private parseSearchResults(html: string, maxResults: number): PriceDataPoint[] {
    const $ = cheerio.load(html);
    const products: PriceDataPoint[] = [];

    // Try multiple selectors
    $(".offerList-item, .sr-resultList__item, [data-testid='product']").each((i, el) => {
      if (products.length >= maxResults) return false;

      try {
        const $item = $(el);
        
        const title = $item.find(".offerList-item-description-title, h3, .sr-productSummary__title").first().text().trim();
        const priceText = $item.find(".offerList-item-priceMin, .sr-detailedPriceInfo__price, [class*='price']").first().text().trim();
        const price = this.parseGermanPrice(priceText);
        const link = $item.find("a").first().attr("href");
        
        if (title && price > 0) {
          products.push({
            productId: this.generateId(title),
            platform: "idealo",
            price,
            currency: "EUR",
            condition: "new",
            inStock: true,
            url: link ? (link.startsWith("http") ? link : `${this.baseUrl}${link}`) : this.baseUrl,
            collectedAt: new Date().toISOString(),
          });
        }
      } catch (err) {}
    });

    return products;
  }

  private parseGermanPrice(text: string): number {
    if (!text) return 0;
    const cleaned = text.replace(/[€\s]/g, "").replace(".", "").replace(",", ".");
    return parseFloat(cleaned) || 0;
  }

  private generateId(title: string): string {
    const hash = title.split("").reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0);
    return `idealo_${Math.abs(hash)}`;
  }

  async collect(config: BenchmarkConfig): Promise<CollectionResult> {
    const startTime = new Date();
    const allDataPoints: PriceDataPoint[] = [];
    const errors: string[] = [];

    logger.info(`Starting Idealo collection for ${config.code}`);

    // Only do first 2 queries to avoid rate limiting
    const queries = config.searchQueries.slice(0, 2);

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      
      try {
        logger.info(`[${i + 1}/${queries.length}] Idealo: "${query}"`);
        
        const results = await this.search(query, { maxResults: 15 });
        allDataPoints.push(...results);
        logger.info(`  → Found ${results.length} products`);

        // Very long delay between queries (15-25 seconds)
        if (i < queries.length - 1) {
          await this.randomDelay(15000, 25000);
        }

      } catch (error: any) {
        errors.push(`"${query}": ${error.message}`);
        await this.randomDelay(30000, 60000);
      }
    }

    const uniqueProducts = this.deduplicateByPrice(allDataPoints);
    this.saveRawData(config.code, uniqueProducts);

    const stats = this.calculateStats(uniqueProducts);
    logger.info(`Idealo collection complete: ${uniqueProducts.length} products`, stats);

    return this.createResult(config.code, startTime, uniqueProducts, errors);
  }

  private deduplicateByPrice(products: PriceDataPoint[]): PriceDataPoint[] {
    const seen = new Map<string, PriceDataPoint>();
    for (const product of products) {
      const existing = seen.get(product.productId);
      if (!existing || product.price < existing.price) {
        seen.set(product.productId, product);
      }
    }
    return Array.from(seen.values());
  }
}

export const idealoCollector = new IdealoCollector();
