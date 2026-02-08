-- Add thumbnail BLOB storage columns to projects table
-- Thumbnail images stored directly in database (max 2MB enforced in application)

ALTER TABLE projects
  ADD COLUMN thumbnail_data LONGBLOB,
  ADD COLUMN thumbnail_content_type VARCHAR(50),
  ADD COLUMN thumbnail_file_size INT,
  ADD COLUMN thumbnail_updated_at TIMESTAMP NULL;
