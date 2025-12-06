-- Run this SQL in your Supabase SQL Editor or via psql to update the schema
-- This adds the dept_code column to the notices table to support Department-level notices.

ALTER TABLE notices ADD COLUMN IF NOT EXISTS dept_code VARCHAR(10) REFERENCES departments(code);
CREATE INDEX IF NOT EXISTS idx_notices_dept_code ON notices(dept_code);

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notices' AND column_name = 'dept_code';
