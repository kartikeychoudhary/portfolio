-- Insert sample profile
INSERT INTO profile (id, full_name, title, bio, email, phone, location, avatar_url, resume_url)
VALUES (
    'profile-001',
    'John Doe',
    'Full Stack Developer',
    'Passionate software developer with expertise in modern web technologies.',
    'john.doe@example.com',
    '+1-234-567-8900',
    'San Francisco, CA',
    'https://via.placeholder.com/150',
    'https://example.com/resume.pdf'
);

-- Insert sample social links
INSERT INTO social_links (id, profile_id, platform, url, icon, sort_order)
VALUES
    ('social-001', 'profile-001', 'GitHub', 'https://github.com/johndoe', 'fa-brands fa-github', 1),
    ('social-002', 'profile-001', 'LinkedIn', 'https://linkedin.com/in/johndoe', 'fa-brands fa-linkedin', 2),
    ('social-003', 'profile-001', 'Twitter', 'https://twitter.com/johndoe', 'fa-brands fa-twitter', 3);

-- Insert sample skills
INSERT INTO skills (id, name, icon, category, proficiency, sort_order)
VALUES
    ('skill-001', 'Angular', 'fa-brands fa-angular', 'frontend', 90, 1),
    ('skill-002', 'React', 'fa-brands fa-react', 'frontend', 85, 2),
    ('skill-003', 'Spring Boot', 'fa-brands fa-java', 'backend', 88, 3),
    ('skill-004', 'Node.js', 'fa-brands fa-node-js', 'backend', 82, 4),
    ('skill-005', 'MySQL', 'fa-solid fa-database', 'database', 85, 5),
    ('skill-006', 'Docker', 'fa-brands fa-docker', 'devops', 80, 6);

-- Insert sample experiences
INSERT INTO experiences (id, company, position, location, start_date, end_date, is_current, description, technologies, sort_order)
VALUES
    ('exp-001', 'Tech Corp', 'Senior Full Stack Developer', 'San Francisco, CA', '2022-01-01', NULL, TRUE,
     'Leading development of enterprise web applications.',
     '["Angular", "Spring Boot", "MySQL", "Docker"]', 1),
    ('exp-002', 'StartUp Inc', 'Full Stack Developer', 'Remote', '2020-01-01', '2021-12-31', FALSE,
     'Developed and maintained multiple client projects.',
     '["React", "Node.js", "MongoDB"]', 2);

-- Insert sample projects
INSERT INTO projects (id, title, description, image_url, project_url, github_url, technologies, featured, sort_order)
VALUES
    ('proj-001', 'E-Commerce Platform', 'Full-featured e-commerce platform with payment integration.',
     'https://via.placeholder.com/400x300', 'https://example.com/ecommerce', 'https://github.com/johndoe/ecommerce',
     '["Angular", "Spring Boot", "MySQL", "Stripe"]', TRUE, 1),
    ('proj-002', 'Task Management App', 'Real-time collaborative task management application.',
     'https://via.placeholder.com/400x300', 'https://example.com/taskapp', 'https://github.com/johndoe/taskapp',
     '["React", "Node.js", "Socket.io", "MongoDB"]', TRUE, 2);

-- Insert sample blogs
INSERT INTO blogs (id, title, slug, excerpt, content, cover_image, tags, is_published, published_at)
VALUES
    ('blog-001', 'Getting Started with Spring Boot', 'getting-started-with-spring-boot',
     'Learn the basics of Spring Boot and build your first application.',
     '# Getting Started with Spring Boot\n\nSpring Boot makes it easy to create stand-alone, production-grade Spring applications...',
     'https://via.placeholder.com/800x400',
     '["Spring Boot", "Java", "Tutorial"]', TRUE, CURRENT_TIMESTAMP),
    ('blog-002', 'Angular Best Practices', 'angular-best-practices',
     'Essential best practices for building scalable Angular applications.',
     '# Angular Best Practices\n\nFollow these guidelines to write clean, maintainable Angular code...',
     'https://via.placeholder.com/800x400',
     '["Angular", "TypeScript", "Best Practices"]', TRUE, CURRENT_TIMESTAMP);

-- Insert sample contact
INSERT INTO contacts (id, name, email, subject, message, is_read)
VALUES
    ('contact-001', 'Jane Smith', 'jane.smith@example.com', 'Project Inquiry',
     'Hi, I would like to discuss a potential project with you.', FALSE);
