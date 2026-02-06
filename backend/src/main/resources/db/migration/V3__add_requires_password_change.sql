-- Add requires_password_change column to users table
ALTER TABLE users
ADD COLUMN requires_password_change BOOLEAN NOT NULL DEFAULT FALSE
AFTER role;
