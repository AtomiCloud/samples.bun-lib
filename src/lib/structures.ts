/**
 * Pure data structures - no behavior, just properties
 * These are immutable data containers used throughout the application
 */

/**
 * Library configuration structure
 */
export interface LibConfig {
  readonly name: string;
  readonly version: string;
  readonly description: string;
}

/**
 * Result structure for successful operations
 */
export interface OperationResult<T> {
  readonly success: true;
  readonly data: T;
}

/**
 * Result structure for failed operations
 */
export interface OperationError {
  readonly success: false;
  readonly error: string;
  readonly code: string;
}

/**
 * Combined result type for operations that can fail
 */
export type Result<T> = OperationResult<T> | OperationError;

/**
 * Calculator input structure
 */
export interface CalculatorInput {
  readonly a: number;
  readonly b: number;
}

/**
 * Calculator output structure
 */
export interface CalculatorOutput {
  readonly result: number;
  readonly operation: string;
}

/**
 * String processing input
 */
export interface StringProcessInput {
  readonly text: string;
  readonly options?: StringProcessOptions;
}

/**
 * String processing options
 */
export interface StringProcessOptions {
  readonly uppercase?: boolean;
  readonly trim?: boolean;
  readonly prefix?: string;
  readonly suffix?: string;
}

/**
 * String processing output
 */
export interface StringProcessOutput {
  readonly original: string;
  readonly processed: string;
  readonly length: number;
}
