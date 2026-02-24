/**
 * Unit tests for StringService
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import { StringService } from '../../src/lib/services.ts';
import { createMockLogger, createMockCache } from '../fixtures/index.ts';

describe('StringService', () => {
  describe('without dependencies', () => {
    const service = new StringService();

    describe('process', () => {
      it('should process string with default options', () => {
        // Arrange
        const input = { text: 'hello world' };

        // Act
        const result = service.process(input);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.original).toBe('hello world');
          expect(result.data.processed).toBe('hello world');
          expect(result.data.length).toBe(11);
        }
      });

      it('should return error for empty input', () => {
        // Arrange
        const input = { text: '' };

        // Act
        const result = service.process(input);

        // Assert
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe('Input text cannot be empty');
          expect(result.code).toBe('EMPTY_INPUT');
        }
      });

      it('should apply trim option', () => {
        // Arrange
        const input = { text: '  hello world  ', options: { trim: true } };

        // Act
        const result = service.process(input);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.processed).toBe('hello world');
        }
      });

      it('should apply uppercase option', () => {
        // Arrange
        const input = { text: 'hello world', options: { uppercase: true } };

        // Act
        const result = service.process(input);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.processed).toBe('HELLO WORLD');
        }
      });

      it('should apply prefix option', () => {
        // Arrange
        const input = { text: 'world', options: { prefix: 'hello ' } };

        // Act
        const result = service.process(input);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.processed).toBe('hello world');
        }
      });

      it('should apply suffix option', () => {
        // Arrange
        const input = { text: 'hello', options: { suffix: ' world' } };

        // Act
        const result = service.process(input);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.processed).toBe('hello world');
        }
      });

      it('should apply multiple options', () => {
        // Arrange
        const input = {
          text: '  hello  ',
          options: { trim: true, uppercase: true, prefix: '>> ', suffix: ' <<' },
        };

        // Act
        const result = service.process(input);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.processed).toBe('>> HELLO <<');
          expect(result.data.original).toBe('  hello  ');
        }
      });
    });

    describe('reverse', () => {
      it('should reverse a string', () => {
        expect(service.reverse('hello')).toBe('olleh');
      });

      it('should handle empty string', () => {
        expect(service.reverse('')).toBe('');
      });

      it('should handle single character', () => {
        expect(service.reverse('a')).toBe('a');
      });

      it('should handle palindrome', () => {
        expect(service.reverse('racecar')).toBe('racecar');
      });
    });

    describe('isPalindrome', () => {
      it('should return true for palindrome', () => {
        expect(service.isPalindrome('racecar')).toBe(true);
        expect(service.isPalindrome('A man a plan a canal Panama')).toBe(true);
      });

      it('should return false for non-palindrome', () => {
        expect(service.isPalindrome('hello')).toBe(false);
      });

      it('should handle empty string', () => {
        expect(service.isPalindrome('')).toBe(true);
      });

      it('should ignore case and non-alphanumeric', () => {
        expect(service.isPalindrome('A man, a plan, a canal: Panama!')).toBe(true);
      });
    });

    describe('countWords', () => {
      it('should count words in a string', () => {
        expect(service.countWords('hello world')).toBe(2);
      });

      it('should handle empty string', () => {
        expect(service.countWords('')).toBe(0);
      });

      it('should handle whitespace only', () => {
        expect(service.countWords('   ')).toBe(0);
      });

      it('should handle single word', () => {
        expect(service.countWords('hello')).toBe(1);
      });

      it('should handle multiple spaces between words', () => {
        expect(service.countWords('hello    world')).toBe(2);
      });
    });

    describe('truncate', () => {
      it('should not truncate if under max length', () => {
        expect(service.truncate('hello', 10)).toBe('hello');
      });

      it('should truncate with default suffix', () => {
        expect(service.truncate('hello world', 8)).toBe('hello...');
      });

      it('should truncate with custom suffix', () => {
        expect(service.truncate('hello world', 8, '…')).toBe('hello w…');
      });

      it('should handle exact length', () => {
        expect(service.truncate('hello', 5)).toBe('hello');
      });
    });
  });

  describe('with logger', () => {
    let service: StringService;
    let logger: ReturnType<typeof createMockLogger>;

    beforeEach(() => {
      logger = createMockLogger();
      service = new StringService(logger);
    });

    it('should log debug message on process', () => {
      // Arrange
      const input = { text: 'test' };

      // Act
      service.process(input);

      // Assert
      const debugCalls = logger.getCallsForLevel('debug');
      expect(debugCalls.length).toBe(1);
      expect(debugCalls[0].message).toBe('Processed string');
    });
  });

  describe('with cache', () => {
    it('should accept cache dependency', () => {
      // Arrange
      const cache = createMockCache();
      const service = new StringService(undefined, cache);

      // Act & Assert - should not throw
      expect(() => service.process({ text: 'test' })).not.toThrow();
    });
  });
});
