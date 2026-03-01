#!/bin/sh
set -e
export HOME=/tmp
echo "Running database migrations..."
node_modules/.bin/medusa db:migrate
echo "Migrations complete. Starting server..."
exec node_modules/.bin/medusa start
