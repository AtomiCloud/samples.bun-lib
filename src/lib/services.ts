/**
 * Pure service classes with stateless methods and dependency injection
 * All business logic lives here.
 *
 * Note: getLibraryVersion() uses filesystem I/O to read package.json at runtime
 * for dynamic version detection. This is a pragmatic choice for accurate versioning
 * across source and bundled distributions.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { IConfigProvider, ILoggerAdapter } from './interfaces.ts';
import type {
  CalculatorInput,
  CalculatorOutput,
  LibConfig,
  OperationError,
  Result,
  StringProcessInput,
  StringProcessOutput,
} from './structures.ts';

/**
 * Get the library version from package.json
 */
function getLibraryVersion(): string {
  try {
    const dirname = fileURLToPath(new URL('.', import.meta.url));
    // Try source layout first (src/lib -> root)
    let packageJsonPath = join(dirname, '..', '..', 'package.json');
    if (!existsSync(packageJsonPath)) {
      // Fallback for bundled ESM (dist -> root)
      packageJsonPath = join(dirname, '..', 'package.json');
    }
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version as string;
  } catch {
    return '0.0.0-development';
  }
}

/**
 * CalculatorService - Performs mathematical operations
 * Stateless methods - all state is passed as parameters
 */
export class CalculatorService {
  /**
   * Add two numbers
   */
  public add(input: CalculatorInput): Result<CalculatorOutput> {
    const result = input.a + input.b;
    return {
      success: true,
      data: {
        result,
        operation: 'add',
      },
    };
  }

  /**
   * Subtract two numbers
   */
  public subtract(input: CalculatorInput): Result<CalculatorOutput> {
    const result = input.a - input.b;
    return {
      success: true,
      data: {
        result,
        operation: 'subtract',
      },
    };
  }

  /**
   * Multiply two numbers
   */
  public multiply(input: CalculatorInput): Result<CalculatorOutput> {
    const result = input.a * input.b;
    return {
      success: true,
      data: {
        result,
        operation: 'multiply',
      },
    };
  }

  /**
   * Divide two numbers
   */
  public divide(input: CalculatorInput): Result<CalculatorOutput> {
    if (input.b === 0) {
      return {
        success: false,
        error: 'Division by zero is not allowed',
        code: 'DIVISION_BY_ZERO',
      };
    }
    const result = input.a / input.b;
    return {
      success: true,
      data: {
        result,
        operation: 'divide',
      },
    };
  }

  /**
   * Get the absolute value of a number
   */
  public abs(value: number): number {
    return Math.abs(value);
  }

  /**
   * Check if a number is positive
   */
  public isPositive(value: number): boolean {
    return value > 0;
  }

  /**
   * Check if a number is negative
   */
  public isNegative(value: number): boolean {
    return value < 0;
  }

  /**
   * Check if a number is zero
   */
  public isZero(value: number): boolean {
    return value === 0;
  }
}

/**
 * StringService - Performs string operations
 * Stateless methods - all state is passed as parameters
 */
export class StringService {
  constructor(private readonly logger?: ILoggerAdapter) {}

  /**
   * Process a string according to options
   */
  public process(input: StringProcessInput): Result<StringProcessOutput> {
    const { text, options = {} } = input;

    if (!text) {
      return {
        success: false,
        error: 'Input text cannot be empty',
        code: 'EMPTY_INPUT',
      };
    }

    let processed = text;

    // Apply transformations
    if (options.trim) {
      processed = processed.trim();
    }

    if (options.uppercase) {
      processed = processed.toUpperCase();
    }

    if (options.prefix) {
      processed = options.prefix + processed;
    }

    if (options.suffix) {
      processed = processed + options.suffix;
    }

    const output: StringProcessOutput = {
      original: text,
      processed,
      length: processed.length,
    };

    this.logger?.debug('Processed string', { input, output });

    return {
      success: true,
      data: output,
    };
  }

  /**
   * Reverse a string
   */
  public reverse(text: string): string {
    return [...text].reverse().join('');
  }

  /**
   * Check if a string is a palindrome
   * Handles Unicode characters by normalizing and comparing grapheme clusters
   */
  public isPalindrome(text: string): boolean {
    // Normalize the string: lowercase and remove non-alphanumeric characters
    // Using Unicode-aware pattern to preserve non-ASCII alphanumeric characters
    const normalized = text
      .toLowerCase()
      .normalize('NFC')
      .replace(/[^\p{L}\p{N}]/gu, '');
    return normalized === this.reverse(normalized);
  }

  /**
   * Count words in a string
   */
  public countWords(text: string): number {
    if (!text.trim()) {
      return 0;
    }
    return text.trim().split(/\s+/).length;
  }

  /**
   * Truncate a string to a maximum length
   * @param text - The text to truncate
   * @param maxLength - Maximum length (must be non-negative; negative values return empty string)
   * @param suffix - Suffix to append when truncated (default: '...')
   */
  public truncate(text: string, maxLength: number, suffix = '...'): string {
    if (maxLength < 0) {
      return '';
    }
    if (text.length <= maxLength) {
      return text;
    }
    if (suffix.length >= maxLength) {
      return text.slice(0, maxLength);
    }
    return text.slice(0, maxLength - suffix.length) + suffix;
  }
}

/**
 * ConfigService - Handles configuration loading and validation
 * Stateless methods - all state passed as parameters
 */
export class ConfigService {
  constructor(private readonly configProvider: IConfigProvider) {}

  /**
   * Get the library configuration
   */
  public getConfig(): LibConfig {
    return this.configProvider.getConfig();
  }

  /**
   * Validate configuration structure - pure function
   */
  public isValidConfig(config: unknown): config is LibConfig {
    if (typeof config !== 'object' || config === null) {
      return false;
    }
    const c = config as Partial<LibConfig>;
    return typeof c.name === 'string' && typeof c.version === 'string' && typeof c.description === 'string';
  }

  /**
   * Get default config - pure function
   */
  public getDefaultConfig(): LibConfig {
    return {
      name: '@atomicloud/samples-bun-lib',
      version: getLibraryVersion(),
      description: 'Sample Bun Library Template',
    };
  }

  /**
   * Check if configuration is valid
   * Validates both provider status and config structure
   */
  public isConfigValid(): boolean {
    // First check if the provider itself is valid
    if (!this.configProvider.isValid()) {
      return false;
    }
    // Then validate the actual config structure
    const config = this.configProvider.getConfig();
    return this.isValidConfig(config);
  }
}

/**
 * LibraryService - Main service for library operations
 * Combines all services and provides a unified interface
 */
export class LibraryService {
  constructor(
    private readonly calculator: CalculatorService,
    private readonly strings: StringService,
    private readonly config: ConfigService,
    private readonly logger?: ILoggerAdapter,
  ) {}

  /**
   * Get library information
   */
  public getInfo(): { name: string; version: string; description: string } {
    const cfg = this.config.getConfig();
    this.logger?.info('Getting library info', cfg);
    return cfg;
  }

  /**
   * Check if the library is properly initialized
   */
  public isReady(): boolean {
    return this.config.isConfigValid();
  }

  /**
   * Get the calculator service
   */
  public getCalculator(): CalculatorService {
    return this.calculator;
  }

  /**
   * Get the string service
   */
  public getStringService(): StringService {
    return this.strings;
  }
}

/**
 * Create a default library service with minimal dependencies
 */
export function createLibraryService(configProvider: IConfigProvider, logger?: ILoggerAdapter): LibraryService {
  const config = new ConfigService(configProvider);
  const calculator = new CalculatorService();
  const strings = new StringService(logger);
  return new LibraryService(calculator, strings, config, logger);
}

/**
 * DefaultConfigProvider - Simple implementation of IConfigProvider
 * Uses default configuration values
 */
export class DefaultConfigProvider implements IConfigProvider {
  constructor(private readonly valid: boolean = true) {}

  getConfig(): LibConfig {
    return {
      name: '@atomicloud/samples-bun-lib',
      version: getLibraryVersion(),
      description: 'Sample Bun Library Template',
    };
  }

  isValid(): boolean {
    return this.valid;
  }
}

/**
 * Create a default config provider
 * Useful for simple use cases without custom configuration
 */
export function createDefaultConfigProvider(valid = true): DefaultConfigProvider {
  return new DefaultConfigProvider(valid);
}
