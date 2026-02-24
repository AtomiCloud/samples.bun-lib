/**
 * Unit tests for test fixtures
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import {
  MockLoggerAdapter,
  MockCacheAdapter,
  MockConfigProvider,
  createDefaultConfig,
  createDefaultConfigProvider,
  createMockLogger,
  createMockCache,
} from '../fixtures/index.ts';

describe('MockLoggerAdapter', () => {
  let logger: MockLoggerAdapter;

  beforeEach(() => {
    logger = new MockLoggerAdapter();
  });

  describe('info', () => {
    it('should record info calls', () => {
      // Act
      logger.info('test message', { key: 'value' });

      // Assert
      expect(logger.calls.length).toBe(1);
      expect(logger.calls[0].level).toBe('info');
      expect(logger.calls[0].message).toBe('test message');
      expect(logger.calls[0].args).toEqual([{ key: 'value' }]);
    });
  });

  describe('warn', () => {
    it('should record warn calls', () => {
      logger.warn('warning');
      expect(logger.calls[0].level).toBe('warn');
    });
  });

  describe('error', () => {
    it('should record error calls', () => {
      logger.error('error');
      expect(logger.calls[0].level).toBe('error');
    });
  });

  describe('debug', () => {
    it('should record debug calls', () => {
      logger.debug('debug');
      expect(logger.calls[0].level).toBe('debug');
    });
  });

  describe('getCallsForLevel', () => {
    it('should filter calls by level', () => {
      logger.info('info1');
      logger.info('info2');
      logger.error('error1');

      const infoCalls = logger.getCallsForLevel('info');
      expect(infoCalls.length).toBe(2);
      expect(infoCalls[0].message).toBe('info1');
      expect(infoCalls[1].message).toBe('info2');
    });

    it('should return empty array for no matching calls', () => {
      logger.info('test');
      const errorCalls = logger.getCallsForLevel('error');
      expect(errorCalls.length).toBe(0);
    });
  });

  describe('clear', () => {
    it('should clear all recorded calls', () => {
      logger.info('test');
      logger.error('test');
      expect(logger.calls.length).toBe(2);

      logger.clear();

      expect(logger.calls.length).toBe(0);
    });
  });
});

describe('MockCacheAdapter', () => {
  let cache: MockCacheAdapter;

  beforeEach(() => {
    cache = new MockCacheAdapter();
  });

  describe('set and get', () => {
    it('should store and retrieve values', () => {
      cache.set('key', 'value');
      expect(cache.get('key')).toBe('value');
    });

    it('should return undefined for missing keys', () => {
      expect(cache.get('missing')).toBeUndefined();
    });

    it('should handle different value types', () => {
      cache.set('string', 'text');
      cache.set('number', 42);
      cache.set('object', { a: 1 });

      expect(cache.get('string')).toBe('text');
      expect(cache.get('number')).toBe(42);
      expect(cache.get('object')).toEqual({ a: 1 });
    });
  });

  describe('delete', () => {
    it('should delete stored values', () => {
      cache.set('key', 'value');
      expect(cache.has('key')).toBe(true);

      cache.delete('key');

      expect(cache.has('key')).toBe(false);
      expect(cache.get('key')).toBeUndefined();
    });
  });

  describe('has', () => {
    it('should return true for existing keys', () => {
      cache.set('key', 'value');
      expect(cache.has('key')).toBe(true);
    });

    it('should return false for missing keys', () => {
      expect(cache.has('missing')).toBe(false);
    });
  });

  describe('TTL support', () => {
    it('should expire values after TTL', () => {
      cache.set('key', 'value', 10); // 10ms TTL

      expect(cache.get('key')).toBe('value');

      // Wait for expiry
      const start = Date.now();
      while (Date.now() - start < 20) {
        // busy wait
      }

      expect(cache.get('key')).toBeUndefined();
    });

    it('has should return false for expired values', () => {
      cache.set('key', 'value', 10);

      expect(cache.has('key')).toBe(true);

      const start = Date.now();
      while (Date.now() - start < 20) {
        // busy wait
      }

      expect(cache.has('key')).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all values', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      expect(cache.size()).toBe(2);

      cache.clear();

      expect(cache.size()).toBe(0);
    });
  });

  describe('size', () => {
    it('should return number of cached items', () => {
      expect(cache.size()).toBe(0);

      cache.set('a', 1);
      expect(cache.size()).toBe(1);

      cache.set('b', 2);
      expect(cache.size()).toBe(2);

      cache.delete('a');
      expect(cache.size()).toBe(1);
    });
  });
});

describe('MockConfigProvider', () => {
  it('should return provided config', () => {
    const config = { name: 'test', version: '1.0.0', description: 'Test lib' };
    const provider = new MockConfigProvider(config);

    expect(provider.getConfig()).toEqual(config);
  });

  it('should return validity status', () => {
    const config = { name: 'test', version: '1.0.0', description: 'Test lib' };

    const validProvider = new MockConfigProvider(config, true);
    expect(validProvider.isValid()).toBe(true);

    const invalidProvider = new MockConfigProvider(config, false);
    expect(invalidProvider.isValid()).toBe(false);
  });
});

describe('Factory functions', () => {
  describe('createDefaultConfig', () => {
    it('should return default config', () => {
      const config = createDefaultConfig();

      expect(config.name).toBe('@atomicloud/samples-bun-lib');
      expect(config.version).toBe('0.1.0');
      expect(config.description).toBe('Sample Bun Library Template');
    });
  });

  describe('createDefaultConfigProvider', () => {
    it('should create provider with default config', () => {
      const provider = createDefaultConfigProvider(true);

      expect(provider.isValid()).toBe(true);
      expect(provider.getConfig().name).toBe('@atomicloud/samples-bun-lib');
    });

    it('should respect validity parameter', () => {
      const validProvider = createDefaultConfigProvider(true);
      const invalidProvider = createDefaultConfigProvider(false);

      expect(validProvider.isValid()).toBe(true);
      expect(invalidProvider.isValid()).toBe(false);
    });
  });

  describe('createMockLogger', () => {
    it('should create empty logger', () => {
      const logger = createMockLogger();

      expect(logger.calls.length).toBe(0);
      expect(logger).toBeInstanceOf(MockLoggerAdapter);
    });
  });

  describe('createMockCache', () => {
    it('should create empty cache', () => {
      const cache = createMockCache();

      expect(cache.size()).toBe(0);
    });

    it('should create cache with initial values', () => {
      const cache = createMockCache({
        key1: 'value1',
        key2: 'value2',
      });

      expect(cache.size()).toBe(2);
      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBe('value2');
    });
  });
});
