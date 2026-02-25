/**
 * Unit tests for ConfigService
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import { ConfigService } from '../../src/lib/services.ts';
import {
  MockConfigProvider,
  createDefaultConfig,
  createDefaultConfigProvider,
  getPackageVersion,
} from '../fixtures/index.ts';

describe('ConfigService', () => {
  describe('with valid config provider', () => {
    let service: ConfigService;
    let provider: MockConfigProvider;

    beforeEach(() => {
      provider = createDefaultConfigProvider(true);
      service = new ConfigService(provider);
    });

    describe('getConfig', () => {
      it('should return the config from provider', () => {
        // Act
        const config = service.getConfig();

        // Assert
        expect(config.name).toBe('@atomicloud/samples-bun-lib');
        expect(config.version).toBe(getPackageVersion());
        expect(config.description).toBe('Sample Bun Library Template');
      });
    });

    describe('isValidConfig', () => {
      it('should return true for valid config', () => {
        // Arrange
        const validConfig = createDefaultConfig();

        // Act & Assert
        expect(service.isValidConfig(validConfig)).toBe(true);
      });

      it('should return false for null', () => {
        expect(service.isValidConfig(null)).toBe(false);
      });

      it('should return false for undefined', () => {
        expect(service.isValidConfig(undefined)).toBe(false);
      });

      it('should return false for non-object', () => {
        expect(service.isValidConfig('string')).toBe(false);
        expect(service.isValidConfig(123)).toBe(false);
        expect(service.isValidConfig(true)).toBe(false);
      });

      it('should return false for missing name', () => {
        const config = { version: '1.0.0', description: 'test' };
        expect(service.isValidConfig(config)).toBe(false);
      });

      it('should return false for missing version', () => {
        const config = { name: 'test', description: 'test' };
        expect(service.isValidConfig(config)).toBe(false);
      });

      it('should return false for missing description', () => {
        const config = { name: 'test', version: '1.0.0' };
        expect(service.isValidConfig(config)).toBe(false);
      });

      it('should return false for wrong types', () => {
        const config = { name: 123, version: true, description: {} };
        expect(service.isValidConfig(config)).toBe(false);
      });
    });

    describe('getDefaultConfig', () => {
      it('should return default config', () => {
        // Act
        const config = service.getDefaultConfig();

        // Assert
        expect(config.name).toBe('@atomicloud/samples-bun-lib');
        expect(config.version).toBe(getPackageVersion());
        expect(config.description).toBe('Sample Bun Library Template');
      });
    });

    describe('isConfigValid', () => {
      it('should return true when provider is valid', () => {
        expect(service.isConfigValid()).toBe(true);
      });
    });
  });

  describe('with invalid config provider', () => {
    let service: ConfigService;

    beforeEach(() => {
      const provider = createDefaultConfigProvider(false);
      service = new ConfigService(provider);
    });

    describe('isConfigValid', () => {
      it('should return false when provider is invalid', () => {
        expect(service.isConfigValid()).toBe(false);
      });
    });
  });

  describe('with custom config', () => {
    it('should return custom config from provider', () => {
      // Arrange
      const customConfig = {
        name: 'custom-lib',
        version: '2.0.0',
        description: 'Custom Library',
      };
      const provider = new MockConfigProvider(customConfig);
      const service = new ConfigService(provider);

      // Act
      const config = service.getConfig();

      // Assert
      expect(config.name).toBe('custom-lib');
      expect(config.version).toBe('2.0.0');
      expect(config.description).toBe('Custom Library');
    });
  });
});
