#!/usr/bin/env bash
set -euo pipefail

# Check for NPM_API_KEY before proceeding
if [[ -z ${NPM_API_KEY:-} ]]; then
  echo "❌ 'NPM_API_KEY' env var not set"
  exit 1
fi

# npm publishing script using Bun
# Requires NPM_API_KEY environment variable

echo "📦 Installing dependencies"
bun install --frozen-lockfile
echo "✅ Dependencies installed"

echo "🛠️ Generating .npmrc"
rm .npmrc || true
echo "//registry.npmjs.org/:_authToken=${NPM_API_KEY}" >.npmrc
echo "registry=https://registry.npmjs.org/" >>.npmrc
echo "always-auth=true" >>.npmrc
chmod 600 .npmrc
trap 'rm -f .npmrc' EXIT
echo "✅ .npmrc generated!"

# Build package
echo "🔨 Building package"
./scripts/ci/build.sh
echo "✅ Package built"

echo "📦 Publishing to npm"
bun publish --access public --no-git-checks
echo "✅ Published to npm"
