// lib/utils/rate-limit.ts

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

export function rateLimit(key: string, limit: number, windowMs: number = 60000) {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1, resetTime: now + windowMs };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { success: true, remaining: limit - record.count, resetTime: record.resetTime };
}

export function cleanupRateLimitStore() {
  const now = Date.now();
  const keys = Array.from(store.keys());
  for (const key of keys) {
    const value = store.get(key);
    if (value && now > value.resetTime) {
      store.delete(key);
    }
  }
}
