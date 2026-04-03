-- Insert sample roles if needed (we used Enum locally, so no role table needed unless modified)

-- Patient: test@caremate.com / password: password123 (bcrypt hash for password123)
-- Doctor: doc@caremate.com / password: password123 (bcrypt hash for password123)
INSERT INTO users (full_name, email, password, role) VALUES 
('John Doe', 'test@caremate.com', '$2a$10$TKh8H1.PfQx37YgCzwiVceDrA7aFqL/8XnJ2E5X7W2s1C2rB9T0G.', 'ROLE_PATIENT') ON CONFLICT DO NOTHING;

INSERT INTO users (full_name, email, password, role) VALUES 
('Dr. Smith', 'doc@caremate.com', '$2a$10$TKh8H1.PfQx37YgCzwiVceDrA7aFqL/8XnJ2E5X7W2s1C2rB9T0G.', 'ROLE_DOCTOR') ON CONFLICT DO NOTHING;
