-- Seed Courses
INSERT INTO courses (code, name, credits) VALUES
('CSE-101', 'Introduction to Computer Systems', 3),
('CSE-102', 'Discrete Mathematics', 3),
('EEE-101', 'Electrical Circuits I', 3),
('MATH-101', 'Differential and Integral Calculus', 3),
('PHY-101', 'Physics I', 3);

-- Seed Users (Note: Passwords are not handled here as they are in auth.users, but we can seed public.users)
-- In a real scenario, we would need to create users in auth.users first.
-- For local dev, we can use the Supabase Studio or API to create users, or just insert into auth.users if we have access.
-- However, since we are using GoTrue, we should probably create users via the API or a script that interacts with GoTrue.
-- But for now, let's just insert into public.users so we have some data if we manually create the auth users with matching IDs.

-- Actually, it's better to not seed users here if we can't ensure ID matching with auth.users easily without a complex script.
-- Instead, I will provide a script to run AFTER the containers are up to create users via the API, OR I can just document that users need to be created.
-- But the user asked to "use real data".
-- Let's insert some departments and courses which are static data.

-- Seed Classes
INSERT INTO classes (dept_id, session, section, code) VALUES
(4, '2023-2024', 'A', 'CSE-23-A'),
(4, '2023-2024', 'B', 'CSE-23-B'),
(2, '2023-2024', 'A', 'EEE-23-A');

-- We will rely on manual sign up or a separate script for users to ensure auth sync.
