#!/usr/bin/env bash
set -euo pipefail

# CI pre-commit script
# Run via: nix develop .#ci -c ./scripts/ci/pre-commit.sh
# Nix environment provides all necessary dependencies

# run precommit
echo "🏃‍➡️ Running Pre-Commit..."
pre-commit run --all -v
echo "✅ Done!"
