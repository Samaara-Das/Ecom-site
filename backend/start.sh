#!/bin/sh
set -e
echo "Running database migrations..."
node_modules/.bin/medusa db:migrate
echo "Migrations complete. Starting server..."
exec node .medusa/server/index.js
