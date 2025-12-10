// src/collectors/amazon-dma-collector.ts
/**
 * Amazon DMA Collector - IMPROVED VERSION
 * 
 * Uses stealth techniques for reliable data collection under EU DMA.
 */

import * as cheerio from "cheerio";
import { BaseCollector, SearchOptions } from "./base-collector";
import { PriceDataPoint, BenchmarkConfig, CollectionResult } from "../models/types";
import { HttpClient } from "../utils/http-client";
import { logger } from "../utils/logger";

interface AmazonProductData extends PriceDataPoint {
  title: string;
  asin: string;
  rating?: number;
  reviewCount?: number;
  isPrime?: boolean;
}

export class AmazonDMACollector extends BaseCollector {
  private httpClient: HttpClient;
  private baseUrl = "https://www.amazon.de";
  private cookies: string = "";
  
  private userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
  ];

  constructor() {
    super("amazon");
    this.httpClient = new HttpClient({ 
      rateLimit: 0.15,
      maxRetries: 2,
      timeout: 25000,
    });
  }

  private getUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  private randomDelay(min: number, max: number): Promise<void> {
    const delay = min + Math.random() * (max - min);
    logger.debug(`Waiting ${Math.round(delay / 1000)}s...`);
    return new Promise(r => setTimeout(r, delay));
  }

  private async initSession(): Promise<void> {
    try {
      logger.debug("Initializing Amazon session...");
      const response = await this.httpClient.get(this.baseUrl, {
        headers: this.getHeaders(),
      });
      
      const setCookies = response.headers["set-cookie"];
      if (setCookies) {
        this.cookies = Array.isArray(setCookies) 
          ? setCookies.map(c => c.split(";")[0]).join("; ")
          : setCookies.split(";")[0];
        logger.debug("Got session cookies");
      }
      
      await this.randomDelay(3000, 5000);
    } catch (error) {
      logger.warn("Could not initialize Amazon session");
    }
  }

  private getHeaders(): Record<string, string> {
    return {
      "User-Agent": this.getUserAgent(),
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "DNT": "1",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Cache-Control": "max-age=0",
      ...(this.cookies && { "Cookie": this.cookies }),
    };
  }

  async search(query: string, options: SearchOptions = {}): Promise<AmazonProductData[]> {
    const params = new URLSearchParams({ k: query });

    if (options.priceMin || options.priceMax) {
      const min = Math.round((options.priceMin || 0) * 100);
      const max = Math.round((options.priceMax || 99999) * 100);
      params.append("rh", `p_36:${min}-${max}`);
    }

    const url = `${this.baseUrl}/s?${params.toString()}`;
    
    try {
      const response = await this.httpClient.get(url, { headers: this.getHeaders() });

      if (response.data.includes("captcha") || response.data.includes("robot")) {
        logger.warn("CAPTCHA detected, long backoff...");
        await this.randomDelay(60000, 120000);
        return [];
      }

      return this.parseSearchResults(response.data, options.maxResults || 20);
    } catch (error: any) {
      logger.error(`Amazon search failed: ${error.message}`);
      return [];
    }
  }

  private parseSearchResults(html: string, maxResults: number): AmazonProductData[] {
    const $ = cheerio.load(html);
    const products: AmazonProductData[] = [];

    $('[data-component-type="s-search-result"], .s-result-item[data-asin]').each((i, el) => {
      if (products.length >= maxResults) return false;

      try {
        const $item = $(el);
        const asin = $item.attr("data-asin");
        
        if (!asin || asin.length < 5) return;

        // Title
        const title = $item.find("h2 span, .a-size-medium.a-text-normal").first().text().trim();

        // Price
        const wholePrice = $item.find(".a-price-whole").first().text().replace(/[.,\s]/g, "");
        const fractionPrice = $item.find(".a-price-fraction").first().text() || "00";
        const price = wholePrice ? parseFloat(`${wholePrice}.${fractionPrice}`) : 0;

        // Rating
        const ratingClass = $item.find(".a-icon-star-small").first().attr("class") || "";
        const ratingMatch = ratingClass.match(/a-star-small-(\d)-?(\d)?/);
        const rating = ratingMatch ? parseFloat(`${ratingMatch[1]}.${ratingMatch[2] || 0}`) : undefined;

        // Prime
        const isPrime = $item.find('.a-icon-prime').length > 0;

        // URL
        const href = $item.find("h2 a").first().attr("href");
        const url = href ? `${this.baseUrl}${href}` : `${this.baseUrl}/dp/${asin}`;

        if (title && price > 0) {
          products.push({
            productId: asin,
            asin,
            title,
            platform: "amazon",
            price,
            currency: "EUR",
            rating,
            isPrime,
            condition: "new",
            inStock: true,
            url,
            collectedAt: new Date().toISOString(),
          });
        }
      } catch (err) {}
    });

    return products;
  }

  async collect(config: BenchmarkConfig): Promise<CollectionResult> {
    const startTime = new Date();
    const allDataPoints: AmazonProductData[] = [];
    const errors: string[] = [];

    logger.info(`Starting Amazon DMA collection for ${config.code}`, {
      queries: config.searchQueries.length,
      legalBasis: "EU Digital Markets Act 2022/1925",
    });

    await this.initSession();

    // Only do first 3 queries for testing
    const queries = config.searchQueries.slice(0, 3);

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      
      try {
        logger.info(`[${i + 1}/${queries.length}] Amazon: "${query}"`);
        
        const results = await this.search(query, {
          maxResults: 20,
          priceMin: config.priceFilter?.min,
          priceMax: config.priceFilter?.max,
        });

        const filtered = results.filter(item => {
          if (!config.excludeKeywords) return true;
          const titleLower = item.title.toLowerCase();
          return !config.excludeKeywords.some(kw => titleLower.includes(kw.toLowerCase()));
        });

        allDataPoints.push(...filtered);
        logger.info(`  → Found ${filtered.length} products`);

        if (i < queries.length - 1) {
          await this.randomDelay(8000, 15000);
        }

      } catch (error: any) {
        errors.push(`"${query}": ${error.message}`);
        await this.randomDelay(15000, 30000);
      }
    }

    const unique = new Map(allDataPoints.map(p => [p.asin, p]));
    const uniqueProducts = Array.from(unique.values());

    this.saveRawData(config.code, uniqueProducts);

    const stats = this.calculateStats(uniqueProducts);
    logger.info(`Amazon collection complete: ${uniqueProducts.length} products`, stats);

    return this.createResult(config.code, startTime, uniqueProducts, errors);
  }
}

export const amazonDMACollector = new AmazonDMACollector();
