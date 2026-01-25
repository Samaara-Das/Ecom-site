-- PostgreSQL Initialization Script for Medusa
-- This script runs automatically when the PostgreSQL container is first created

-- Create extensions that Medusa may use
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Grant privileges (the database and user are created by POSTGRES_USER/POSTGRES_DB env vars)
GRANT ALL PRIVILEGES ON DATABASE medusa TO medusa;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'Database initialized successfully for Medusa';
END $$;
