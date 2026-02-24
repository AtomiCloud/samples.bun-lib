/**
 * Unit tests for CalculatorService
 */

import { describe, expect, it } from 'bun:test';
import { CalculatorService } from '../../src/lib/services.ts';

describe('CalculatorService', () => {
  const service = new CalculatorService();

  describe('add', () => {
    it('should add two positive numbers', () => {
      // Arrange
      const input = { a: 5, b: 3 };

      // Act
      const result = service.add(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.result).toBe(8);
        expect(result.data.operation).toBe('add');
      }
    });

    it('should add two negative numbers', () => {
      // Arrange
      const input = { a: -5, b: -3 };

      // Act
      const result = service.add(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.result).toBe(-8);
      }
    });

    it('should add positive and negative numbers', () => {
      // Arrange
      const input = { a: 5, b: -3 };

      // Act
      const result = service.add(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.result).toBe(2);
      }
    });

    it('should handle zero correctly', () => {
      // Arrange
      const input = { a: 5, b: 0 };

      // Act
      const result = service.add(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.result).toBe(5);
      }
    });
  });

  describe('subtract', () => {
    it('should subtract two positive numbers', () => {
      // Arrange
      const input = { a: 10, b: 3 };

      // Act
      const result = service.subtract(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.result).toBe(7);
        expect(result.data.operation).toBe('subtract');
      }
    });

    it('should handle negative results', () => {
      // Arrange
      const input = { a: 3, b: 10 };

      // Act
      const result = service.subtract(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.result).toBe(-7);
      }
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers', () => {
      // Arrange
      const input = { a: 4, b: 3 };

      // Act
      const result = service.multiply(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.result).toBe(12);
        expect(result.data.operation).toBe('multiply');
      }
    });

    it('should multiply by zero', () => {
      // Arrange
      const input = { a: 5, b: 0 };

      // Act
      const result = service.multiply(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.result).toBe(0);
      }
    });

    it('should multiply negative numbers', () => {
      // Arrange
      const input = { a: -3, b: -4 };

      // Act
      const result = service.multiply(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.result).toBe(12);
      }
    });
  });

  describe('divide', () => {
    it('should divide two positive numbers', () => {
      // Arrange
      const input = { a: 10, b: 2 };

      // Act
      const result = service.divide(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.result).toBe(5);
        expect(result.data.operation).toBe('divide');
      }
    });

    it('should return error for division by zero', () => {
      // Arrange
      const input = { a: 10, b: 0 };

      // Act
      const result = service.divide(input);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Division by zero is not allowed');
        expect(result.code).toBe('DIVISION_BY_ZERO');
      }
    });

    it('should handle decimal results', () => {
      // Arrange
      const input = { a: 7, b: 2 };

      // Act
      const result = service.divide(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.result).toBe(3.5);
      }
    });
  });

  describe('abs', () => {
    it('should return positive for positive input', () => {
      expect(service.abs(5)).toBe(5);
    });

    it('should return positive for negative input', () => {
      expect(service.abs(-5)).toBe(5);
    });

    it('should return zero for zero', () => {
      expect(service.abs(0)).toBe(0);
    });
  });

  describe('isPositive', () => {
    it('should return true for positive numbers', () => {
      expect(service.isPositive(1)).toBe(true);
      expect(service.isPositive(100)).toBe(true);
    });

    it('should return false for zero', () => {
      expect(service.isPositive(0)).toBe(false);
    });

    it('should return false for negative numbers', () => {
      expect(service.isPositive(-1)).toBe(false);
      expect(service.isPositive(-100)).toBe(false);
    });
  });

  describe('isNegative', () => {
    it('should return true for negative numbers', () => {
      expect(service.isNegative(-1)).toBe(true);
      expect(service.isNegative(-100)).toBe(true);
    });

    it('should return false for zero', () => {
      expect(service.isNegative(0)).toBe(false);
    });

    it('should return false for positive numbers', () => {
      expect(service.isNegative(1)).toBe(false);
      expect(service.isNegative(100)).toBe(false);
    });
  });

  describe('isZero', () => {
    it('should return true for zero', () => {
      expect(service.isZero(0)).toBe(true);
    });

    it('should return false for positive numbers', () => {
      expect(service.isZero(1)).toBe(false);
    });

    it('should return false for negative numbers', () => {
      expect(service.isZero(-1)).toBe(false);
    });
  });
});
