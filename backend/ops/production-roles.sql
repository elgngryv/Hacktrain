-- Run once as the database administrator on a NEW, dedicated HackTrain database:
-- HACKTRAIN_MIGRATION_PASSWORD and HACKTRAIN_RUNTIME_PASSWORD are environment secrets.
-- psql "$ADMIN_DATABASE_URL" -f ops/production-roles.sql
\set ON_ERROR_STOP on
\getenv migration_password HACKTRAIN_MIGRATION_PASSWORD
\getenv runtime_password HACKTRAIN_RUNTIME_PASSWORD
BEGIN;
CREATE ROLE hacktrain_migrator LOGIN PASSWORD :'migration_password' NOSUPERUSER NOBYPASSRLS;
CREATE ROLE hacktrain_runtime LOGIN PASSWORD :'runtime_password' NOSUPERUSER NOBYPASSRLS;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT USAGE,CREATE ON SCHEMA public TO hacktrain_migrator;
GRANT USAGE ON SCHEMA public TO hacktrain_runtime;
ALTER DEFAULT PRIVILEGES FOR ROLE hacktrain_migrator IN SCHEMA public
  GRANT SELECT,INSERT,UPDATE,DELETE ON TABLES TO hacktrain_runtime;
ALTER DEFAULT PRIVILEGES FOR ROLE hacktrain_migrator IN SCHEMA public
  GRANT USAGE,SELECT ON SEQUENCES TO hacktrain_runtime;
COMMIT;
