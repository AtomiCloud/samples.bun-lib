/**
 * Interfaces for impure dependencies
 * These define contracts for external systems and can be mocked in tests
 */

import type { LibConfig } from './structures.ts';

/**
 * Logger adapter interface - for logging operations
 */
export interface ILoggerAdapter {
  /**
   * Log an info message
   */
  info(message: string, ...args: unknown[]): void;

  /**
   * Log a warning message
   */
  warn(message: string, ...args: unknown[]): void;

  /**
   * Log an error message
   */
  error(message: string, ...args: unknown[]): void;

  /**
   * Log a debug message
   */
  debug(message: string, ...args: unknown[]): void;
}

/**
 * Configuration provider interface - for loading configuration
 */
export interface IConfigProvider {
  /**
   * Get the library configuration
   */
  getConfig(): LibConfig;

  /**
   * Check if configuration is valid
   */
  isValid(): boolean;
}

/**
 * Cache adapter interface - for caching operations
 */
export interface ICacheAdapter {
  /**
   * Get a cached value
   */
  get<T>(key: string): T | undefined;

  /**
   * Set a cached value
   */
  set<T>(key: string, value: T, ttlMs?: number): void;

  /**
   * Delete a cached value
   */
  delete(key: string): void;

  /**
   * Check if a key exists
   */
  has(key: string): boolean;
}
