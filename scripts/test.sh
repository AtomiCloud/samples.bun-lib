#!/usr/bin/env bash
set -euo pipefail

# Test runner for unit and integration tests
# Run via: ./scripts/test.sh [unit|int] [--cover] [--watch]

# Handle test type
TEST_TYPE="unit"
if [[ ${1:-} == "unit" || ${1:-} == "int" ]]; then
  TEST_TYPE="$1"
  shift
elif [[ -n ${1:-} && ${1:-} != --* ]]; then
  echo "❌ Invalid test type: ${1}. Must be 'unit' or 'int'"
  exit 1
fi

# Test configuration
COVER=false
WATCH=false

# Parse flags
for flag in "$@"; do
  case $flag in
  --cover)
    COVER=true
    shift
    ;;
  --watch)
    WATCH=true
    shift
    ;;
  *)
    echo "❌ Unknown flag: $flag"
    exit 1
    ;;
  esac
done

echo "🧪 Running $TEST_TYPE tests..."

# Set test directory
TEST_DIR="test/$TEST_TYPE"

# Check if test directory exists
if [[ ! -d $TEST_DIR ]]; then
  echo "❌ Test directory not found: $TEST_DIR"
  exit 1
fi

# Set bunfig config file
BUNFIG_CONFIG="bunfig.$TEST_TYPE.toml"

if [[ $WATCH == true ]]; then
  echo "⏺️  Running in watch mode..."
  bun test --config "$BUNFIG_CONFIG" --watch "$TEST_DIR"
else
  if [[ $COVER == true ]]; then
    echo "📊 Running with coverage..."
    mkdir -p "coverage/$TEST_TYPE"
    bun test --config "$BUNFIG_CONFIG" --coverage --coverage-reporter=text --coverage-reporter=lcov --coverage-dir="coverage/$TEST_TYPE" "$TEST_DIR"
  else
    bun test --config "$BUNFIG_CONFIG" "$TEST_DIR"
  fi
fi
