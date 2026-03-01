#!/bin/sh
set -e
export HOME=/tmp

echo "Running database migrations..."
node_modules/.bin/medusa db:migrate

# Create admin user on first run only
if [ ! -f /tmp/.admin_created ]; then
  echo "Creating admin user..."
  node_modules/.bin/medusa user \
    -e "${ADMIN_EMAIL:-admin@kuwait-marketplace.com}" \
    -p "${ADMIN_PASSWORD:-AdminPass123!}" \
    && touch /tmp/.admin_created \
    || echo "Admin user creation skipped (may already exist)"
fi

echo "Starting server..."
exec node_modules/.bin/medusa start
