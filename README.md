# @atomicloud/samples-bun-lib

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](#)

A production-ready Bun (TypeScript) library template demonstrating best practices for library development.

## Features

- **Pure Data Structures** - Immutable interfaces with no behavior
- **Interface Contracts** - Dependency injection contracts for testability
- **Stateless Services** - Business logic with constructor injection
- **100% Test Coverage** - Unit tests with comprehensive coverage
- **Dual Module Support** - ESM and CommonJS outputs
- **TypeScript Declarations** - Full type support out of the box
- **Source Maps** - For better debugging experience

## Installation

```bash
# Using bun
bun add @atomicloud/samples-bun-lib

# Using npm
npm install @atomicloud/samples-bun-lib

# Using yarn
yarn add @atomicloud/samples-bun-lib
```

## Usage

### Basic Usage

```typescript
import { createLibraryService, createDefaultConfigProvider } from '@atomicloud/samples-bun-lib';

// Create a library service
const configProvider = createDefaultConfigProvider(true);
const library = createLibraryService(configProvider);

// Use the calculator service
const calculator = library.getCalculator();
const result = calculator.add({ a: 5, b: 3 });
console.log(result); // { success: true, data: { result: 8, operation: 'add' } }

// Use the string service
const stringService = library.getStringService();
const processed = stringService.process({
  text: '  hello world  ',
  options: { trim: true, uppercase: true }
});
console.log(processed); // { success: true, data: { original: '  hello world  ', processed: 'HELLO WORLD', length: 11 } }
```

### Calculator Service

```typescript
import { CalculatorService } from '@atomicloud/samples-bun-lib';

const calculator = new CalculatorService();

// Basic operations
calculator.add({ a: 10, b: 5 });     // { success: true, data: { result: 15, operation: 'add' } }
calculator.subtract({ a: 10, b: 5 }); // { success: true, data: { result: 5, operation: 'subtract' } }
calculator.multiply({ a: 10, b: 5 }); // { success: true, data: { result: 50, operation: 'multiply' } }
calculator.divide({ a: 10, b: 5 });   // { success: true, data: { result: 2, operation: 'divide' } }

// Error handling
calculator.divide({ a: 10, b: 0 }); // { success: false, error: 'Division by zero is not allowed', code: 'DIVISION_BY_ZERO' }

// Utility methods
calculator.abs(-5);      // 5
calculator.isPositive(5); // true
calculator.isNegative(-5); // true
calculator.isZero(0);     // true
```

### String Service

```typescript
import { StringService } from '@atomicloud/samples-bun-lib';

const strings = new StringService();

// Process with options
strings.process({
  text: 'hello',
  options: { uppercase: true, prefix: '>> ', suffix: ' <<' }
}); // { success: true, data: { original: 'hello', processed: '>> HELLO <<', length: 10 } }

// Utility methods
strings.reverse('hello');           // 'olleh'
strings.isPalindrome('racecar');    // true
strings.countWords('hello world');  // 2
strings.truncate('hello world', 8); // 'hello...'
```

### With Dependency Injection

```typescript
import {
  LibraryService,
  CalculatorService,
  StringService,
  ConfigService,
  type ILoggerAdapter,
  type IConfigProvider
} from '@atomicloud/samples-bun-lib';

// Implement your own logger
class ConsoleLogger implements ILoggerAdapter {
  info(msg: string, ...args: unknown[]) { console.log(`[INFO] ${msg}`, ...args); }
  warn(msg: string, ...args: unknown[]) { console.warn(`[WARN] ${msg}`, ...args); }
  error(msg: string, ...args: unknown[]) { console.error(`[ERROR] ${msg}`, ...args); }
  debug(msg: string, ...args: unknown[]) { console.debug(`[DEBUG] ${msg}`, ...args); }
}

// Implement your own config provider
class EnvConfigProvider implements IConfigProvider {
  getConfig() {
    return {
      name: 'my-app',
      version: '1.0.0',
      description: 'My Application'
    };
  }
  isValid() { return true; }
}

// Wire up dependencies
const logger = new ConsoleLogger();
const configProvider = new EnvConfigProvider();
const config = new ConfigService(configProvider);
const calculator = new CalculatorService();
const stringService = new StringService(logger, undefined);
const library = new LibraryService(calculator, stringService, config, logger);
```

## API Documentation

### Structures

| Type | Description |
|------|-------------|
| `LibConfig` | Library configuration with name, version, description |
| `Result<T>` | Either `OperationResult<T>` or `OperationError` |
| `CalculatorInput` | Input for calculator operations (a, b) |
| `CalculatorOutput` | Output with result and operation name |
| `StringProcessInput` | Input text with optional processing options |
| `StringProcessOutput` | Original, processed text and length |

### Interfaces

| Interface | Description |
|-----------|-------------|
| `ILoggerAdapter` | Logging contract (info, warn, error, debug) |
| `IConfigProvider` | Configuration provider contract |
| `ICacheAdapter` | Caching contract (get, set, delete, has) |

### Services

| Service | Description |
|---------|-------------|
| `CalculatorService` | Math operations (add, subtract, multiply, divide, abs, etc.) |
| `StringService` | String operations (process, reverse, isPalindrome, truncate, etc.) |
| `ConfigService` | Configuration handling and validation |
| `LibraryService` | Main service combining all functionality |

## Development

### Setup

```bash
bun install
```

### Run Tests

```bash
# Run unit tests
./scripts/test.sh unit

# Run with coverage
./scripts/test.sh unit --cover

# Watch mode
./scripts/test.sh unit --watch
```

### Build

```bash
./scripts/ci/build.sh
```

### Lint

```bash
task lint
```

## Project Structure

```
src/
  lib/
    structures.ts    # Pure data structures
    interfaces.ts    # DI contracts
    services.ts      # Stateless services
    index.ts         # Library exports
  index.ts           # Entry point

test/
  fixtures/
    index.ts         # Mock implementations
  unit/
    *.test.ts        # Unit tests

scripts/
  test.sh            # Test runner
  ci/
    test.sh          # CI test script
    build.sh         # CI build script
    publish.sh       # npm publishing script

tasks/
  test.tasks.yaml    # Test tasks
```

## License

MIT © AtomiCloud
