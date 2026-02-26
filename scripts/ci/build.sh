#!/usr/bin/env bash
set -euo pipefail

# CI build script - builds ESM and CJS outputs
# Run via: nix develop .#ci -c ./scripts/ci/build.sh

echo "📦 Installing dependencies..."
bun install --frozen-lockfile
echo "✅ Dependencies installed"

echo "🔨 Building library (ESM + CJS)..."

# Clean previous build
rm -rf dist

# Build using bun build API
bun run build.config.ts

echo "✅ Build complete!"

# Generate TypeScript declaration files
echo "📝 Generating type declarations..."
tsc --emitDeclarationOnly --declaration --outDir ./dist
echo "✅ Declarations generated!"

# Verify outputs
echo "🔍 Verifying build outputs..."
test -f dist/index.js || {
  echo "  ✗ dist/index.js (ESM) MISSING"
  exit 1
}
echo "  ✓ dist/index.js (ESM)"
test -f dist/index.cjs || {
  echo "  ✗ dist/index.cjs (CJS) MISSING"
  exit 1
}
echo "  ✓ dist/index.cjs (CJS)"
test -f dist/index.d.ts || {
  echo "  ✗ dist/index.d.ts (Types) MISSING"
  exit 1
}
echo "  ✓ dist/index.d.ts (Types)"
test -f dist/index.js.map || {
  echo "  ✗ dist/index.js.map (Sourcemap) MISSING"
  exit 1
}
echo "  ✓ dist/index.js.map (Sourcemap)"
test -f dist/index.cjs.map || {
  echo "  ✗ dist/index.cjs.map (Sourcemap) MISSING"
  exit 1
}
echo "  ✓ dist/index.cjs.map (Sourcemap)"

echo "✅ All build outputs verified!"
