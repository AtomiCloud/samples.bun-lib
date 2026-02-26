/**
 * Integration tests for the library
 * Tests the library as a whole system with all services working together
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import {
  createLibraryService,
  createDefaultConfigProvider,
  CalculatorService,
  StringService,
  type LibraryService,
} from '../../src/lib/services.ts';
import { createMockLogger } from '../fixtures/index.ts';

describe('Library Integration Tests', () => {
  describe('End-to-end library usage', () => {
    it('should create and use a fully configured library service', () => {
      // Arrange - Create library with all dependencies
      const configProvider = createDefaultConfigProvider(true);
      const logger = createMockLogger();
      const library = createLibraryService(configProvider, logger);

      // Act - Use the library
      const info = library.getInfo();
      const calcResult = library.getCalculator().add({ a: 10, b: 20 });
      const strResult = library.getStringService().process({
        text: '  Hello World  ',
        options: { trim: true, uppercase: true },
      });

      // Assert - Verify end-to-end behavior
      expect(info.name).toBe('@atomicloud/samples-bun-lib');
      expect(calcResult.success).toBe(true);
      if (calcResult.success) {
        expect(calcResult.data.result).toBe(30);
      }
      expect(strResult.success).toBe(true);
      if (strResult.success) {
        expect(strResult.data.processed).toBe('HELLO WORLD');
      }
    });

    it('should chain multiple calculator operations', () => {
      // Arrange
      const configProvider = createDefaultConfigProvider();
      const library = createLibraryService(configProvider);
      const calc = library.getCalculator();

      // Act - Chain multiple operations
      const r1 = calc.add({ a: 100, b: 50 });
      expect(r1.success).toBe(true);
      if (!r1.success) return;

      const r2 = calc.subtract({ a: r1.data.result, b: 25 });
      expect(r2.success).toBe(true);
      if (!r2.success) return;

      const r3 = calc.multiply({ a: r2.data.result, b: 2 });
      expect(r3.success).toBe(true);
      if (!r3.success) return;

      const r4 = calc.divide({ a: r3.data.result, b: 5 });

      // Assert - Final result should be 50
      expect(r4.success).toBe(true);
      if (r4.success) {
        expect(r4.data.result).toBe(50);
      }
    });

    it('should handle error cases gracefully across services', () => {
      // Arrange
      const configProvider = createDefaultConfigProvider();
      const library = createLibraryService(configProvider);

      // Act - Trigger error cases
      const divResult = library.getCalculator().divide({ a: 10, b: 0 });
      const strResult = library.getStringService().process({ text: '' });

      // Assert - Both should fail gracefully
      expect(divResult.success).toBe(false);
      if (!divResult.success) {
        expect(divResult.code).toBe('DIVISION_BY_ZERO');
      }

      expect(strResult.success).toBe(false);
      if (!strResult.success) {
        expect(strResult.code).toBe('EMPTY_INPUT');
      }
    });
  });

  describe('Service composition', () => {
    let library: LibraryService;

    beforeEach(() => {
      const configProvider = createDefaultConfigProvider(true);
      library = createLibraryService(configProvider);
    });

    it('should provide access to all underlying services', () => {
      // Act
      const calc = library.getCalculator();
      const str = library.getStringService();

      // Assert
      expect(calc).toBeInstanceOf(CalculatorService);
      expect(str).toBeInstanceOf(StringService);
    });

    it('should validate configuration through config service', () => {
      // Act
      const isReady = library.isReady();

      // Assert
      expect(isReady).toBe(true);
    });
  });

  describe('Complex operations', () => {
    it('should process complex string transformations', () => {
      // Arrange
      const configProvider = createDefaultConfigProvider();
      const library = createLibraryService(configProvider);
      const str = library.getStringService();

      // Act - Multiple transformations
      const input = '  hello world  ';
      const trimmed = str.process({ text: input, options: { trim: true } });
      expect(trimmed.success).toBe(true);
      if (!trimmed.success) return;

      const uppercased = str.process({
        text: trimmed.data.processed,
        options: { uppercase: true },
      });
      expect(uppercased.success).toBe(true);
      if (!uppercased.success) return;

      const prefixed = str.process({
        text: uppercased.data.processed,
        options: { prefix: '>> ' },
      });
      expect(prefixed.success).toBe(true);
      if (!prefixed.success) return;

      const suffixed = str.process({
        text: prefixed.data.processed,
        options: { suffix: ' <<' },
      });

      // Assert
      expect(suffixed.success).toBe(true);
      if (suffixed.success) {
        expect(suffixed.data.processed).toBe('>> HELLO WORLD <<');
        expect(suffixed.data.original).toBe('>> HELLO WORLD');
        expect(suffixed.data.length).toBe(17);
      }
    });

    it('should perform calculator operations with various number types', () => {
      // Arrange
      const configProvider = createDefaultConfigProvider();
      const library = createLibraryService(configProvider);
      const calc = library.getCalculator();

      // Act & Assert - Various number combinations
      const r1 = calc.add({ a: -5, b: 10 });
      expect(r1.success).toBe(true);
      if (r1.success) expect(r1.data.result).toBe(5);

      const r2 = calc.multiply({ a: 2.5, b: 4 });
      expect(r2.success).toBe(true);
      if (r2.success) expect(r2.data.result).toBe(10);

      const r3 = calc.divide({ a: 7, b: 2 });
      expect(r3.success).toBe(true);
      if (r3.success) expect(r3.data.result).toBe(3.5);

      const r4 = calc.subtract({ a: 0, b: -5 });
      expect(r4.success).toBe(true);
      if (r4.success) expect(r4.data.result).toBe(5);
    });
  });

  describe('Library information and metadata', () => {
    it('should return consistent library information', () => {
      // Arrange
      const configProvider = createDefaultConfigProvider();
      const library = createLibraryService(configProvider);

      // Act
      const info1 = library.getInfo();
      const info2 = library.getInfo();

      // Assert
      expect(info1.name).toBe(info2.name);
      expect(info1.version).toBe(info2.version);
      expect(info1.description).toBe(info2.description);
      expect(info1.name).toBe('@atomicloud/samples-bun-lib');
    });
  });

  describe('Edge cases and boundary conditions', () => {
    it('should handle large numbers correctly', () => {
      // Arrange
      const configProvider = createDefaultConfigProvider();
      const library = createLibraryService(configProvider);
      const calc = library.getCalculator();

      // Act
      const result = calc.multiply({ a: 1_000_000, b: 1_000_000 });

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.result).toBe(1_000_000_000_000);
      }
    });

    it('should handle very small decimal numbers', () => {
      // Arrange
      const configProvider = createDefaultConfigProvider();
      const library = createLibraryService(configProvider);
      const calc = library.getCalculator();

      // Act
      const result = calc.multiply({ a: 0.001, b: 0.001 });

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.result).toBeCloseTo(0.000001);
      }
    });

    it('should handle unicode strings', () => {
      // Arrange
      const configProvider = createDefaultConfigProvider();
      const library = createLibraryService(configProvider);
      const str = library.getStringService();

      // Act
      const result = str.reverse('Hello 世界');

      // Assert
      expect(result).toBe('界世 olleH');
    });

    it('should detect palindromes (ASCII examples)', () => {
      // Arrange
      const configProvider = createDefaultConfigProvider();
      const library = createLibraryService(configProvider);
      const str = library.getStringService();

      // Act & Assert - Testing English/ASCII palindromes
      expect(str.isPalindrome('racecar')).toBe(true);
      expect(str.isPalindrome('A man a plan a canal Panama')).toBe(true);
      expect(str.isPalindrome('Was it a car or a cat I saw')).toBe(true);
      expect(str.isPalindrome('hello world')).toBe(false);
    });
  });
});
