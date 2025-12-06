-- Initialize Supabase Roles
-- This script sets up the necessary roles and permissions for Supabase services

-- Create roles if they don't exist (although the image might create them without passwords)
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'anon') THEN
      CREATE ROLE anon NOLOGIN;
   END IF;
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'authenticated') THEN
      CREATE ROLE authenticated NOLOGIN;
   END IF;
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'service_role') THEN
      CREATE ROLE service_role NOLOGIN;
   END IF;
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'authenticator') THEN
      CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'postgres';
   END IF;
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'supabase_auth_admin') THEN
      CREATE ROLE supabase_auth_admin NOINHERIT LOGIN PASSWORD 'postgres';
   END IF;
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'supabase_storage_admin') THEN
      CREATE ROLE supabase_storage_admin NOINHERIT LOGIN PASSWORD 'postgres';
   END IF;
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'dashboard_user') THEN
      CREATE ROLE dashboard_user NOINHERIT LOGIN PASSWORD 'postgres';
   END IF;
END
$do$;

-- Set passwords for existing roles to ensure they match what services expect (defaulting to 'postgres' based on docker-compose env)
ALTER ROLE authenticator WITH PASSWORD 'postgres';
ALTER ROLE supabase_auth_admin WITH PASSWORD 'postgres';
ALTER ROLE supabase_storage_admin WITH PASSWORD 'postgres';
ALTER ROLE dashboard_user WITH PASSWORD 'postgres';

-- Grant permissions
GRANT anon TO authenticator;
GRANT authenticated TO authenticator;
GRANT service_role TO authenticator;
GRANT supabase_auth_admin TO postgres;
GRANT supabase_storage_admin TO postgres;
GRANT dashboard_user TO postgres;

-- Allow authenticator to switch to other roles
GRANT anon TO authenticator;
GRANT authenticated TO authenticator;
GRANT service_role TO authenticator;

-- Basic schema permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Auth schema setup (if not exists)
CREATE SCHEMA IF NOT EXISTS auth;
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role, supabase_auth_admin, dashboard_user;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO supabase_auth_admin, dashboard_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO supabase_auth_admin, dashboard_user;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO supabase_auth_admin, dashboard_user;

-- Storage schema setup (if not exists)
CREATE SCHEMA IF NOT EXISTS storage;
GRANT USAGE ON SCHEMA storage TO anon, authenticated, service_role, supabase_storage_admin, dashboard_user;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO supabase_storage_admin, dashboard_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO supabase_storage_admin, dashboard_user;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA storage TO supabase_storage_admin, dashboard_user;

-- Realtime schema setup
CREATE SCHEMA IF NOT EXISTS _realtime;
GRANT USAGE ON SCHEMA _realtime TO postgres, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA _realtime TO postgres;
