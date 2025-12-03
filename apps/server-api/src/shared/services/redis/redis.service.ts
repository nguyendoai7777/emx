import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { c } from '@emx/core';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private readonly logger = new Logger(RedisService.name);

  onModuleInit() {
    this.client = new Redis(process.env.REDIS_URL as string);
    // retry backoff
    // retryStrategy: ((times) => Math.min(times * 100, 2000)
    console.log(c.green(`Redis Initialed`));
    this.client.on('connect', () => console.log('@@ Redis Connected'));
    this.client.on('error', (err) => console.error('@@ Redis error', err));
  }

  onModuleDestroy() {
    this.client.quit();
  }

  async get<T = any>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async set<T = any>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.set(key, serialized, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  // Returns true if key exists
  async exists(key: string): Promise<boolean> {
    const client = this.client;
    const res = await client.exists(key);
    return res === 1;
  }

  // Try to set lock key with NX and EX
  private async acquireLock(lockKey: string, token: string, ttlSeconds: number): Promise<boolean> {
    const client = this.client;
    const res = await client.set(lockKey, token, 'EX', ttlSeconds, 'NX');
    return res === 'OK';
  }

  // Release lock only if token matches (atomic via Lua)
  private async releaseLock(lockKey: string, token: string): Promise<void> {
    const client = this.client;
    const script = 'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end';
    await client.eval(script, 1, lockKey, token);
  }

  async delByPrefix(prefix: string): Promise<number> {
    const pattern = `${prefix}:*`;
    // For simplicity use KEYS; consider SCAN for production to avoid blocking
    const keys: string[] = await this.client.keys(pattern);
    if (!keys || keys.length === 0) return 0;
    // `del` accepts spread keys

    return this.client.del(...keys);
  }

  // Execute loader only once for same payload/cacheKey. Others wait and read from Redis.
  // - cacheKey: key to store the result
  // - loader: function that performs DB work and returns the result
  // - cacheTtlSeconds: optional TTL for the cached result
  // - lockTtlSeconds: TTL for the lock to avoid deadlocks
  // - waitIntervalMs: polling interval for waiting requests
  // - waitTimeoutMs: how long waiting requests will wait before attempting to acquire lock themselves
  async executeExclusive<T = any>(
    cacheKey: string,
    loader: () => Promise<T>,
    cacheTtlSeconds?: number,
    lockTtlSeconds = 30,
    waitIntervalMs = 300,
    waitTimeoutMs = 10000
  ): Promise<T> {
    const requestId = `${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    console.log(c.bgCyan`[RQ:${requestId}] start for ${cacheKey}`);

    // Fast path: if cached, return immediately
    const existing = await this.get<T>(cacheKey);
    if (existing !== null) {
      console.log(c.bgCyan`[RQ:${requestId}] cache hit - returning from Redis for ${cacheKey}`);
      return existing;
    }

    const lockKey = `${cacheKey}:lock`;
    const token = `${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const deadline = Date.now() + waitTimeoutMs;

    console.log(c.bgCyan`[RQ:${requestId}] attempting to acquire lock ${lockKey}`);

    // Try to acquire the lock
    if (await this.acquireLock(lockKey, token, lockTtlSeconds)) {
      console.log(c.bgCyan`[RQ:${requestId}] acquired lock - will run loader (DB) for ${cacheKey}`);
      try {
        // Re-check cache in case another process populated it between checks
        const recheck = await this.get<T>(cacheKey);
        if (recheck !== null) {
          console.log(c.bgCyan`[RQ:${requestId}] recheck hit - returning from Redis for ${cacheKey}`);
          return recheck;
        }

        // Execute loader and cache result
        const result = await loader();
        await this.set<T>(cacheKey, result, cacheTtlSeconds);
        console.log(c.bgCyan`[RQ:${requestId}] loader finished and cached result for ${cacheKey}`);
        return result;
      } finally {
        try {
          await this.releaseLock(lockKey, token);
          console.log(c.bgCyan`[RQ:${requestId}] released lock ${lockKey}`);
        } catch (err) {
          this.logger.error(`[RQ:${requestId}] Failed to release Redis lock`, err as any);
        }
      }
    }

    console.log(c.bgCyan`[RQ:${requestId}] lock held by another - waiting for cache population for ${cacheKey}`);

    // If lock not acquired, wait for the cache to be populated by the owner
    while (Date.now() < deadline) {
      const val = await this.get<T>(cacheKey);
      if (val !== null) {
        console.log(c.bgCyan`[RQ:${requestId}] waited and got cached value - returning from Redis for ${cacheKey}`);
        return val;
      }
      await new Promise((res) => setTimeout(res, waitIntervalMs));
    }

    console.log(c.bgCyan`[RQ:${requestId}] wait timeout, attempting to acquire lock once more for ${cacheKey}`);

    // Timeout waiting: try once more to acquire lock and run loader to avoid indefinite waits
    if (await this.acquireLock(lockKey, token, lockTtlSeconds)) {
      console.log(c.bgCyan`[RQ:${requestId}] acquired lock after timeout - running loader (DB) for ${cacheKey}`);
      try {
        const result = await loader();
        await this.set<T>(cacheKey, result, cacheTtlSeconds);
        console.log(c.bgCyan`[RQ:${requestId}] loader finished after timeout and cached result for ${cacheKey}`);
        return result;
      } finally {
        try {
          await this.releaseLock(lockKey, token);
          console.log(c.bgCyan`[RQ:${requestId}] released lock after timeout ${lockKey}`);
        } catch (err) {
          this.logger.error(`[RQ:${requestId}] Failed to release Redis lock after timeout-acquire`, err as any);
        }
      }
    }

    this.logger.error(`[RQ:${requestId}] Timeout waiting for exclusive execution of cacheKey: ${cacheKey}`);
    throw new Error('Timeout waiting for exclusive execution of cacheKey: ' + cacheKey);
  }
}
