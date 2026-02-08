-- Site settings table for customization (avatar size, accent color, font, section visibility)
CREATE TABLE site_settings (
    id VARCHAR(36) PRIMARY KEY,
    avatar_size VARCHAR(20) NOT NULL DEFAULT 'medium',
    accent_color VARCHAR(7) NOT NULL DEFAULT '#3b82f6',
    font_family VARCHAR(100) NOT NULL DEFAULT 'Space Grotesk',
    hero_visible BOOLEAN NOT NULL DEFAULT TRUE,
    about_visible BOOLEAN NOT NULL DEFAULT TRUE,
    skills_visible BOOLEAN NOT NULL DEFAULT TRUE,
    experience_visible BOOLEAN NOT NULL DEFAULT TRUE,
    projects_visible BOOLEAN NOT NULL DEFAULT TRUE,
    contact_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default settings
INSERT INTO site_settings (id, avatar_size, accent_color, font_family)
VALUES (UUID(), 'medium', '#3b82f6', 'Space Grotesk');
