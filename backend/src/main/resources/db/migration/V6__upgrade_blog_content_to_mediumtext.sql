-- Upgrade blog content column from TEXT (64KB) to MEDIUMTEXT (16MB)
-- Needed for rich HTML content from Quill editor

ALTER TABLE blogs MODIFY COLUMN content MEDIUMTEXT NOT NULL;
