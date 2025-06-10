-- Create departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name TEXT NOT NULL
);

-- Create courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    credits INT NOT NULL
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    dept_code VARCHAR(10) REFERENCES departments(code),
    role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'cr')),
    student_id VARCHAR(20) UNIQUE,
    batch TEXT,
    section TEXT,
    picture_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create classes table
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    dept_id INT REFERENCES departments(id),
    session TEXT NOT NULL,
    section TEXT,
    code TEXT NOT NULL UNIQUE, -- e.g., CSE-21
    CONSTRAINT unique_class_session_section UNIQUE (dept_id, session, section)
);

-- Create notices table
CREATE TABLE notices (
    id SERIAL PRIMARY KEY,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE, -- Nullable for global notices
    content TEXT NOT NULL,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create enrollments table (many-to-many relationship between users and classes for students)
CREATE TABLE enrollments (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')), -- pending, approved, rejected
    PRIMARY KEY (user_id, class_id)
);

-- Create class_teachers table (many-to-many relationship between users (teachers) and classes)
CREATE TABLE class_teachers (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Teacher's user ID
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, class_id)
);

-- Create attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    marked_by_id UUID REFERENCES users(id), -- Teacher or CR who marked attendance
    CONSTRAINT unique_attendance_record UNIQUE (class_id, student_id, date)
);

-- Create schedules table
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
    day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 for Sunday, 6 for Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    course_code TEXT REFERENCES courses(code),
    teacher_id UUID REFERENCES users(id), -- Teacher assigned to this specific schedule slot
    room_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_schedule_slot UNIQUE (class_id, day_of_week, start_time, course_code)
);

-- Add indexes for frequently queried columns
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_dept_code ON users(dept_code);
CREATE INDEX idx_classes_dept_id ON classes(dept_id);
CREATE INDEX idx_notices_class_id ON notices(class_id);
CREATE INDEX idx_notices_author_id ON notices(author_id);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_class_id ON enrollments(class_id);
CREATE INDEX idx_class_teachers_user_id ON class_teachers(user_id);
CREATE INDEX idx_class_teachers_class_id ON class_teachers(class_id);
CREATE INDEX idx_attendance_class_id ON attendance(class_id);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_schedules_class_id ON schedules(class_id);
CREATE INDEX idx_schedules_teacher_id ON schedules(teacher_id);
CREATE INDEX idx_schedules_course_code ON schedules(course_code);

-- Insert initial department data based on Project Description
INSERT INTO departments (code, name) VALUES
('01', 'Civil Engineering'),
('02', 'Electrical and Electronic Engineering'),
('03', 'Mechanical Engineering'),
('04', 'Computer Science and Engineering'),
('05', 'Electronics and Telecommunication Engineering'),
('06', 'Petroleum and Mining Engineering'),
('07', 'Urban and Regional Planning'),
('08', 'Architecture'),
('09', 'Mechatronics and Industrial Engineering'),
('10', 'Biomedical Engineering'),
('11', 'Water Resources Engineering'),
('12', 'Materials and Metallurgical Engineering'),
('13', 'Nuclear Engineering'); -- Added Nuclear Engineering as it was missing in the prompt but is a CUET dept

-- Enable Row Level Security for all tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Grant all permissions to supabase_admin role to bypass RLS for admin operations if needed.
-- This is generally safe as supabase_admin should only be used for administrative tasks.
GRANT ALL ON departments TO supabase_admin;
GRANT ALL ON courses TO supabase_admin;
GRANT ALL ON users TO supabase_admin;
GRANT ALL ON classes TO supabase_admin;
GRANT ALL ON notices TO supabase_admin;
GRANT ALL ON enrollments TO supabase_admin;
GRANT ALL ON class_teachers TO supabase_admin;
GRANT ALL ON attendance TO supabase_admin;
GRANT ALL ON schedules TO supabase_admin;

-- Grant usage on schema public and sequences to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Grant basic permissions for authenticated users (will be restricted by RLS policies)
GRANT SELECT ON departments TO authenticated;
GRANT SELECT ON courses TO authenticated;
GRANT SELECT, INSERT, UPDATE (full_name, picture_url, section, batch) ON users TO authenticated; -- Users can update their own profiles
GRANT SELECT ON classes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON notices TO authenticated; -- Users can manage their own notices
GRANT SELECT, INSERT, UPDATE, DELETE ON enrollments TO authenticated; -- Students can manage their enrollments
GRANT SELECT ON class_teachers TO authenticated;
GRANT SELECT, INSERT, UPDATE ON attendance TO authenticated; -- Teachers/CRs can manage attendance
GRANT SELECT ON schedules TO authenticated;


-- RLS Policies Examples (to be refined in a later step)

-- Users can view all departments
CREATE POLICY "Allow all users to view departments"
ON departments FOR SELECT
USING (true);

-- Users can view all courses
CREATE POLICY "Allow all users to view courses"
ON courses FOR SELECT
USING (true);

-- Users can view their own user data
CREATE POLICY "Allow users to view their own data"
ON users FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile information
CREATE POLICY "Allow users to update their own profile"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to see all classes (further restrictions might be needed based on roles)
CREATE POLICY "Allow authenticated users to view classes"
ON classes FOR SELECT
TO authenticated
USING (true);

-- Allow users to see global notices and notices for their classes
CREATE POLICY "Allow users to view relevant notices"
ON notices FOR SELECT
TO authenticated
USING (
  class_id IS NULL OR -- Global notices
  EXISTS ( -- Notices for classes they are enrolled in or teach
    SELECT 1 FROM enrollments e WHERE e.class_id = notices.class_id AND e.user_id = auth.uid() AND e.status = 'approved'
    UNION
    SELECT 1 FROM class_teachers ct WHERE ct.class_id = notices.class_id AND ct.user_id = auth.uid()
  )
);

-- Allow users to manage their own notices (create, update, delete)
CREATE POLICY "Allow users to manage their own notices"
ON notices FOR ALL
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);


-- For enrollments, students can manage their own enrollment requests
CREATE POLICY "Students can manage their own enrollments"
ON enrollments FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- For attendance, this is more complex and will depend on roles (Teacher, CR, Student)
-- Example: Allow students to view their own attendance
CREATE POLICY "Students can view their own attendance"
ON attendance FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

-- Example: Allow teachers/CRs to manage attendance for their classes (simplified)
CREATE POLICY "Teachers/CRs can manage attendance for their classes"
ON attendance FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM class_teachers ct
        WHERE ct.class_id = attendance.class_id AND ct.user_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid() AND u.role = 'cr' AND EXISTS (
            SELECT 1 FROM enrollments e
            WHERE e.user_id = u.id AND e.class_id = attendance.class_id AND e.status = 'approved'
        )
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM class_teachers ct
        WHERE ct.class_id = attendance.class_id AND ct.user_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid() AND u.role = 'cr' AND EXISTS (
            SELECT 1 FROM enrollments e
            WHERE e.user_id = u.id AND e.class_id = attendance.class_id AND e.status = 'approved'
        )
    )
);


-- Schedules: Allow authenticated users to view schedules. More specific RLS might be needed.
CREATE POLICY "Allow authenticated users to view schedules"
ON schedules FOR SELECT
TO authenticated
USING (true);

-- Admin users should have full access. This is often handled by disabling RLS for the 'supabase_admin' role or specific admin user roles.
-- The GRANT ALL TO supabase_admin above helps with this.
-- For application-level admin roles, policies would look like:
-- CREATE POLICY "Admin full access" ON your_table FOR ALL USING (current_user_is_admin());
-- (current_user_is_admin() would be a custom security definer function)
