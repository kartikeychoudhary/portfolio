-- Add cover image BLOB storage columns to blogs table
-- Enables storing cover images directly in the database (max 2MB enforced in application)

ALTER TABLE blogs
  ADD COLUMN cover_image_data MEDIUMBLOB COMMENT 'Cover image binary data (max 2MB enforced in app)',
  ADD COLUMN cover_image_content_type VARCHAR(50) COMMENT 'Image MIME type (image/jpeg, image/png, image/webp)',
  ADD COLUMN cover_image_file_size INT COMMENT 'Image file size in bytes';
