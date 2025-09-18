-- Update default currency to GHS for donations table
ALTER TABLE donations ALTER COLUMN currency SET DEFAULT 'GHS';