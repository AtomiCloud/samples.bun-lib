/**
 * Test fixtures and mock implementations
 * These provide test doubles for unit testing
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ICacheAdapter, IConfigProvider, ILoggerAdapter } from '../../src/lib/interfaces.ts';
import type { LibConfig } from '../../src/lib/structures.ts';

/**
 * Get the library version from package.json for test consistency
 * Exported for use across test files to avoid duplication
 */
export function getPackageVersion(): string {
  try {
    const dirname = fileURLToPath(new URL('.', import.meta.url));
    // Try source layout first (test/fixtures -> root)
    let packageJsonPath = join(dirname, '..', '..', 'package.json');
    if (!existsSync(packageJsonPath)) {
      // Fallback for bundled output
      packageJsonPath = join(dirname, '..', 'package.json');
    }
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version as string;
  } catch {
    return '0.0.0-development';
  }
}

/**
 * Mock logger adapter - collects all log calls for verification
 */
export class MockLoggerAdapter implements ILoggerAdapter {
  public readonly calls: Array<{ level: string; message: string; args: unknown[] }> = [];

  info(message: string, ...args: unknown[]): void {
    this.calls.push({ level: 'info', message, args });
  }

  warn(message: string, ...args: unknown[]): void {
    this.calls.push({ level: 'warn', message, args });
  }

  error(message: string, ...args: unknown[]): void {
    this.calls.push({ level: 'error', message, args });
  }

  debug(message: string, ...args: unknown[]): void {
    this.calls.push({ level: 'debug', message, args });
  }

  /**
   * Get all calls for a specific level
   */
  getCallsForLevel(level: string): Array<{ message: string; args: unknown[] }> {
    return this.calls.filter(c => c.level === level).map(c => ({ message: c.message, args: c.args }));
  }

  /**
   * Clear all recorded calls
   */
  clear(): void {
    this.calls.length = 0;
  }
}

/**
 * Mock configuration provider - returns configurable config
 */
export class MockConfigProvider implements IConfigProvider {
  constructor(
    private readonly config: LibConfig,
    private readonly valid = true,
  ) {}

  getConfig(): LibConfig {
    return this.config;
  }

  isValid(): boolean {
    return this.valid;
  }
}

/**
 * Mock cache adapter - in-memory cache for testing
 */
export class MockCacheAdapter implements ICacheAdapter {
  private readonly cache: Map<string, { value: unknown; expires?: number }> = new Map();

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (entry.expires && Date.now() > entry.expires) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value as T;
  }

  /**
   * Set a cache value with optional TTL
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttlMs - Time-to-live in milliseconds. Note: ttlMs=0 is treated as "no TTL"
   *                 (never expires) due to truthiness check. Pass undefined for no expiry,
   *                 or use a small positive value for immediate expiration behavior.
   */
  set<T>(key: string, value: T, ttlMs?: number): void {
    this.cache.set(key, {
      value,
      expires: ttlMs ? Date.now() + ttlMs : undefined,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (entry.expires && Date.now() > entry.expires) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Clear all cached values
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the number of cached items
   *
   * Note: This returns the internal Map size, which may include expired entries
   * that have not yet been evicted. Expired entries are lazily evicted on
   * access via get() or has() calls.
   */
  size(): number {
    return this.cache.size;
  }
}

/**
 * Default test configuration
 */
export function createDefaultConfig(): LibConfig {
  return {
    name: '@atomicloud/samples-bun-lib',
    version: getPackageVersion(),
    description: 'Sample Bun Library Template',
  };
}

/**
 * Create a mock config provider with default config
 */
export function createDefaultConfigProvider(valid = true): MockConfigProvider {
  return new MockConfigProvider(createDefaultConfig(), valid);
}

/**
 * Create a mock logger with optional pre-seeded calls
 */
export function createMockLogger(): MockLoggerAdapter {
  return new MockLoggerAdapter();
}

/**
 * Create a mock cache with optional pre-seeded values
 */
export function createMockCache(initialValues?: Record<string, unknown>): MockCacheAdapter {
  const cache = new MockCacheAdapter();
  if (initialValues) {
    for (const [key, value] of Object.entries(initialValues)) {
      cache.set(key, value);
    }
  }
  return cache;
}
