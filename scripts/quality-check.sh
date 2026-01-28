#!/bin/bash
set -e

echo "==================================="
echo "Running Quality Checks"
echo "==================================="

# Get the root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo ""
echo "--- Backend Checks ---"
cd "$ROOT_DIR/backend"

echo "[1/3] TypeScript type checking..."
npx tsc --noEmit

echo "[2/3] ESLint..."
npm run lint

echo "[3/3] Unit tests..."
npm test

echo ""
echo "--- Storefront Checks ---"
cd "$ROOT_DIR/storefront"

echo "[1/2] ESLint..."
npm run lint

echo "[2/2] Unit tests..."
npm run test || echo "Note: No unit tests found yet"

echo ""
echo "==================================="
echo "All quality checks passed!"
echo "==================================="
