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

# Seed demo data when SEED_DEMO_DATA=true (scripts are idempotent)
if [ "${SEED_DEMO_DATA:-false}" = "true" ]; then
  echo "=== Seeding demo data (SEED_DEMO_DATA=true) ==="
  node_modules/.bin/medusa exec ./src/scripts/seed-vendors-v2.ts && echo "Vendors seeded" || echo "Vendor seeding failed (continuing)"
  node_modules/.bin/medusa exec ./src/scripts/seed-products-v2.ts && echo "Products seeded" || echo "Product seeding failed (continuing)"
  node_modules/.bin/medusa exec ./src/scripts/seed-customers-v2.ts && echo "Customers seeded" || echo "Customer seeding failed (continuing)"
  node_modules/.bin/medusa exec ./src/scripts/seed-orders-v2.ts && echo "Orders seeded" || echo "Order seeding failed (continuing)"
  node_modules/.bin/medusa exec ./src/scripts/fix-auth-prod.ts && echo "Customer auth fixed" || echo "Auth fix failed (continuing)"
  echo "=== Demo data seeding complete ==="
fi

echo "Starting server..."
exec node_modules/.bin/medusa start
