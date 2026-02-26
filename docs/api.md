# API Reference

This document provides detailed API documentation for `@atomicloud/samples-bun-lib`.

## Table of Contents

- [Structures](#structures)
- [Interfaces](#interfaces)
- [Services](#services)
- [Factory Functions](#factory-functions)

---

## Structures

Pure data structures with readonly properties. These are immutable data containers.

### LibConfig

Library configuration structure.

```typescript
interface LibConfig {
  readonly name: string;
  readonly version: string;
  readonly description: string;
}
```

| Property      | Type     | Description              |
| ------------- | -------- | ------------------------ |
| `name`        | `string` | Library name             |
| `version`     | `string` | Library version (semver) |
| `description` | `string` | Library description      |

### Result\<T\>

Combined result type for operations that can fail. Uses discriminated union pattern.

```typescript
type Result<T> = OperationResult<T> | OperationError;
```

### OperationResult\<T\>

Result structure for successful operations.

```typescript
interface OperationResult<T> {
  readonly success: true;
  readonly data: T;
}
```

| Property  | Type   | Description                            |
| --------- | ------ | -------------------------------------- |
| `success` | `true` | Discriminant for successful operations |
| `data`    | `T`    | The result data                        |

### OperationError

Result structure for failed operations.

```typescript
interface OperationError {
  readonly success: false;
  readonly error: string;
  readonly code: string;
}
```

| Property  | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `success` | `false`  | Discriminant for failed operations |
| `error`   | `string` | Human-readable error message       |
| `code`    | `string` | Machine-readable error code        |

### CalculatorInput

Input for calculator operations.

```typescript
interface CalculatorInput {
  readonly a: number;
  readonly b: number;
}
```

| Property | Type     | Description    |
| -------- | -------- | -------------- |
| `a`      | `number` | First operand  |
| `b`      | `number` | Second operand |

### CalculatorOutput

Output from calculator operations.

```typescript
interface CalculatorOutput {
  readonly result: number;
  readonly operation: string;
}
```

| Property    | Type     | Description                                      |
| ----------- | -------- | ------------------------------------------------ |
| `result`    | `number` | Calculation result                               |
| `operation` | `string` | Operation name (add, subtract, multiply, divide) |

### StringProcessInput

Input for string processing operations.

```typescript
interface StringProcessInput {
  readonly text: string;
  readonly options?: StringProcessOptions;
}
```

| Property  | Type                   | Description                 |
| --------- | ---------------------- | --------------------------- |
| `text`    | `string`               | Input text to process       |
| `options` | `StringProcessOptions` | Optional processing options |

### StringProcessOptions

Options for string processing.

```typescript
interface StringProcessOptions {
  readonly uppercase?: boolean;
  readonly trim?: boolean;
  readonly prefix?: string;
  readonly suffix?: string;
}
```

| Property    | Type      | Description                        |
| ----------- | --------- | ---------------------------------- |
| `uppercase` | `boolean` | Convert to uppercase               |
| `trim`      | `boolean` | Remove leading/trailing whitespace |
| `prefix`    | `string`  | Add prefix to result               |
| `suffix`    | `string`  | Add suffix to result               |

### StringProcessOutput

Output from string processing operations.

```typescript
interface StringProcessOutput {
  readonly original: string;
  readonly processed: string;
  readonly length: number;
}
```

| Property    | Type     | Description                                    |
| ----------- | -------- | ---------------------------------------------- |
| `original`  | `string` | Original input text                            |
| `processed` | `string` | Processed result                               |
| `length`    | `number` | Length of processed string (UTF-16 code units) |

---

## Interfaces

Contracts for impure dependencies. Implement these to integrate with external systems.

### ILoggerAdapter

Logging contract for dependency injection.

```typescript
interface ILoggerAdapter {
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}
```

| Method                    | Description         |
| ------------------------- | ------------------- |
| `info(message, ...args)`  | Log info message    |
| `warn(message, ...args)`  | Log warning message |
| `error(message, ...args)` | Log error message   |
| `debug(message, ...args)` | Log debug message   |

### IConfigProvider

Configuration provider contract.

```typescript
interface IConfigProvider {
  getConfig(): LibConfig;
  isValid(): boolean;
}
```

| Method        | Return Type | Description                     |
| ------------- | ----------- | ------------------------------- |
| `getConfig()` | `LibConfig` | Get library configuration       |
| `isValid()`   | `boolean`   | Check if configuration is valid |

### ICacheAdapter

Caching contract for key-value storage.

```typescript
interface ICacheAdapter {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T, ttlMs?: number): void;
  delete(key: string): void;
  has(key: string): boolean;
}
```

| Method                       | Return Type      | Description                        |
| ---------------------------- | ---------------- | ---------------------------------- |
| `get<T>(key)`                | `T \| undefined` | Get cached value                   |
| `set<T>(key, value, ttlMs?)` | `void`           | Set cached value with optional TTL |
| `delete(key)`                | `void`           | Delete cached value                |
| `has(key)`                   | `boolean`        | Check if key exists                |

---

## Services

Stateless service classes with dependency injection.

### CalculatorService

Performs mathematical operations.

```typescript
class CalculatorService {
  add(input: CalculatorInput): Result<CalculatorOutput>;
  subtract(input: CalculatorInput): Result<CalculatorOutput>;
  multiply(input: CalculatorInput): Result<CalculatorOutput>;
  divide(input: CalculatorInput): Result<CalculatorOutput>;
  abs(value: number): number;
  isPositive(value: number): boolean;
  isNegative(value: number): boolean;
  isZero(value: number): boolean;
}
```

| Method               | Return Type                | Description                    |
| -------------------- | -------------------------- | ------------------------------ |
| `add({ a, b })`      | `Result<CalculatorOutput>` | Add two numbers                |
| `subtract({ a, b })` | `Result<CalculatorOutput>` | Subtract b from a              |
| `multiply({ a, b })` | `Result<CalculatorOutput>` | Multiply two numbers           |
| `divide({ a, b })`   | `Result<CalculatorOutput>` | Divide a by b (errors on zero) |
| `abs(value)`         | `number`                   | Absolute value                 |
| `isPositive(value)`  | `boolean`                  | Check if positive              |
| `isNegative(value)`  | `boolean`                  | Check if negative              |
| `isZero(value)`      | `boolean`                  | Check if zero                  |

**Error Codes:**

- `DIVISION_BY_ZERO` - Attempted to divide by zero

### StringService

Performs string operations.

```typescript
class StringService {
  constructor(logger?: ILoggerAdapter);

  process(input: StringProcessInput): Result<StringProcessOutput>;
  reverse(text: string): string;
  isPalindrome(text: string): boolean;
  countWords(text: string): number;
  truncate(text: string, maxLength: number, suffix?: string): string;
}
```

| Method                               | Return Type                   | Description                    |
| ------------------------------------ | ----------------------------- | ------------------------------ |
| `process({ text, options })`         | `Result<StringProcessOutput>` | Process string with options    |
| `reverse(text)`                      | `string`                      | Reverse string (Unicode-aware) |
| `isPalindrome(text)`                 | `boolean`                     | Check if palindrome            |
| `countWords(text)`                   | `number`                      | Count words                    |
| `truncate(text, maxLength, suffix?)` | `string`                      | Truncate with suffix           |

**Error Codes:**

- `EMPTY_INPUT` - Input text was empty

### ConfigService

Handles configuration loading and validation.

```typescript
class ConfigService {
  constructor(configProvider: IConfigProvider);

  getConfig(): LibConfig;
  isValidConfig(config: unknown): config is LibConfig;
  getDefaultConfig(): LibConfig;
  isConfigValid(): boolean;
}
```

| Method                  | Return Type | Description               |
| ----------------------- | ----------- | ------------------------- |
| `getConfig()`           | `LibConfig` | Get configuration         |
| `isValidConfig(config)` | `boolean`   | Type guard for LibConfig  |
| `getDefaultConfig()`    | `LibConfig` | Get default configuration |
| `isConfigValid()`       | `boolean`   | Check if config is valid  |

### LibraryService

Main service combining all functionality.

```typescript
class LibraryService {
  constructor(calculator: CalculatorService, strings: StringService, config: ConfigService, logger?: ILoggerAdapter);

  getInfo(): { name: string; version: string; description: string };
  isReady(): boolean;
  getCalculator(): CalculatorService;
  getStringService(): StringService;
}
```

| Method               | Return Type         | Description                     |
| -------------------- | ------------------- | ------------------------------- |
| `getInfo()`          | `object`            | Get library information         |
| `isReady()`          | `boolean`           | Check if library is initialized |
| `getCalculator()`    | `CalculatorService` | Get calculator service          |
| `getStringService()` | `StringService`     | Get string service              |

---

## Factory Functions

### createLibraryService

Create a library service with minimal configuration.

```typescript
function createLibraryService(configProvider: IConfigProvider, logger?: ILoggerAdapter): LibraryService;
```

**Example:**

```typescript
import { createLibraryService, createDefaultConfigProvider } from '@atomicloud/samples-bun-lib';

const configProvider = createDefaultConfigProvider();
const library = createLibraryService(configProvider);

const result = library.getCalculator().add({ a: 5, b: 3 });
```

### createDefaultConfigProvider

Create a default configuration provider.

```typescript
function createDefaultConfigProvider(valid?: boolean): DefaultConfigProvider;
```

| Parameter | Type      | Default | Description                           |
| --------- | --------- | ------- | ------------------------------------- |
| `valid`   | `boolean` | `true`  | Whether config should report as valid |

---

## Type Exports

All types are exported from the main entry point:

```typescript
import type {
  // Structures
  LibConfig,
  Result,
  OperationResult,
  OperationError,
  CalculatorInput,
  CalculatorOutput,
  StringProcessInput,
  StringProcessOptions,
  StringProcessOutput,

  // Interfaces
  ILoggerAdapter,
  IConfigProvider,
  ICacheAdapter,
} from '@atomicloud/samples-bun-lib';
```
