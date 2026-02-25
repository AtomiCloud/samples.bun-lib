/**
 * Unit tests for LibraryService and createLibraryService
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import {
  CalculatorService,
  ConfigService,
  LibraryService,
  StringService,
  createLibraryService,
  createDefaultConfigProvider,
  DefaultConfigProvider,
} from '../../src/lib/services.ts';
import { createMockLogger, getPackageVersion } from '../fixtures/index.ts';

describe('LibraryService', () => {
  let service: LibraryService;
  let calculator: CalculatorService;
  let strings: StringService;
  let config: ConfigService;
  let logger: ReturnType<typeof createMockLogger>;

  beforeEach(() => {
    calculator = new CalculatorService();
    logger = createMockLogger();
    strings = new StringService(logger);
    const provider = createDefaultConfigProvider(true);
    config = new ConfigService(provider);
    service = new LibraryService(calculator, strings, config, logger);
  });

  describe('getInfo', () => {
    it('should return library information', () => {
      // Act
      const info = service.getInfo();

      // Assert
      expect(info.name).toBe('@atomicloud/samples-bun-lib');
      expect(info.version).toBe(getPackageVersion());
      expect(info.description).toBe('Sample Bun Library Template');
    });

    it('should log info message', () => {
      // Act
      service.getInfo();

      // Assert
      const infoCalls = logger.getCallsForLevel('info');
      expect(infoCalls.length).toBe(1);
      expect(infoCalls[0].message).toBe('Getting library info');
    });
  });

  describe('isReady', () => {
    it('should return true when config is valid', () => {
      expect(service.isReady()).toBe(true);
    });

    it('should return false when config is invalid', () => {
      // Arrange
      const provider = createDefaultConfigProvider(false);
      const invalidConfig = new ConfigService(provider);
      const svc = new LibraryService(calculator, strings, invalidConfig, logger);

      // Act & Assert
      expect(svc.isReady()).toBe(false);
    });
  });

  describe('getCalculator', () => {
    it('should return calculator service', () => {
      // Act
      const calc = service.getCalculator();

      // Assert
      expect(calc).toBe(calculator);
      expect(calc).toBeInstanceOf(CalculatorService);
    });
  });

  describe('getStringService', () => {
    it('should return string service', () => {
      // Act
      const str = service.getStringService();

      // Assert
      expect(str).toBe(strings);
      expect(str).toBeInstanceOf(StringService);
    });
  });
});

describe('createLibraryService', () => {
  it('should create library service with all dependencies', () => {
    // Arrange
    const provider = createDefaultConfigProvider(true);
    const logger = createMockLogger();

    // Act
    const service = createLibraryService(provider, logger);

    // Assert
    expect(service).toBeInstanceOf(LibraryService);
    expect(service.isReady()).toBe(true);
  });

  it('should create library service without logger', () => {
    // Arrange
    const provider = createDefaultConfigProvider(true);

    // Act
    const service = createLibraryService(provider);

    // Assert
    expect(service).toBeInstanceOf(LibraryService);
    expect(service.isReady()).toBe(true);
  });

  it('should have working calculator', () => {
    // Arrange
    const provider = createDefaultConfigProvider(true);
    const service = createLibraryService(provider);

    // Act
    const result = service.getCalculator().add({ a: 2, b: 3 });

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.result).toBe(5);
    }
  });

  it('should have working string service', () => {
    // Arrange
    const provider = createDefaultConfigProvider(true);
    const service = createLibraryService(provider);

    // Act
    const result = service.getStringService().reverse('hello');

    // Assert
    expect(result).toBe('olleh');
  });
});

describe('DefaultConfigProvider', () => {
  describe('getConfig', () => {
    it('should return default config', () => {
      // Arrange
      const provider = new DefaultConfigProvider(true);

      // Act
      const config = provider.getConfig();

      // Assert
      expect(config.name).toBe('@atomicloud/samples-bun-lib');
      expect(config.version).toBe(getPackageVersion());
      expect(config.description).toBe('Sample Bun Library Template');
    });
  });

  describe('isValid', () => {
    it('should return true when valid is true', () => {
      // Arrange
      const provider = new DefaultConfigProvider(true);

      // Act & Assert
      expect(provider.isValid()).toBe(true);
    });

    it('should return false when valid is false', () => {
      // Arrange
      const provider = new DefaultConfigProvider(false);

      // Act & Assert
      expect(provider.isValid()).toBe(false);
    });
  });
});

describe('createDefaultConfigProvider', () => {
  it('should create provider with valid=true by default', () => {
    // Act
    const provider = createDefaultConfigProvider();

    // Assert
    expect(provider.isValid()).toBe(true);
    expect(provider).toBeInstanceOf(DefaultConfigProvider);
  });

  it('should create provider with valid=false when specified', () => {
    // Act
    const provider = createDefaultConfigProvider(false);

    // Assert
    expect(provider.isValid()).toBe(false);
    expect(provider).toBeInstanceOf(DefaultConfigProvider);
  });

  it('should create provider with valid=true when specified', () => {
    // Act
    const provider = createDefaultConfigProvider(true);

    // Assert
    expect(provider.isValid()).toBe(true);
    expect(provider).toBeInstanceOf(DefaultConfigProvider);
  });
});
