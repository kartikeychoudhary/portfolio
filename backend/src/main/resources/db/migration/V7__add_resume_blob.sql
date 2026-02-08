-- Add resume BLOB storage columns to profile table
-- Resume PDFs stored directly in database (max 10MB enforced in application)

ALTER TABLE profile
  ADD COLUMN resume_data LONGBLOB,
  ADD COLUMN resume_content_type VARCHAR(50),
  ADD COLUMN resume_file_size INT,
  ADD COLUMN resume_updated_at TIMESTAMP NULL;
