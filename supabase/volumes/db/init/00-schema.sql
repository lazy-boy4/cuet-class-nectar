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

-- Create class_events table (missing in schema.sql but referenced in RLS)
CREATE TABLE class_events (
    id SERIAL PRIMARY KEY,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
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
('13', 'Nuclear Engineering'); 

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
ALTER TABLE class_events ENABLE ROW LEVEL SECURITY;

-- Grant all permissions to supabase_admin role to bypass RLS for admin operations if needed.
GRANT ALL ON departments TO supabase_admin;
GRANT ALL ON courses TO supabase_admin;
GRANT ALL ON users TO supabase_admin;
GRANT ALL ON classes TO supabase_admin;
GRANT ALL ON notices TO supabase_admin;
GRANT ALL ON enrollments TO supabase_admin;
GRANT ALL ON class_teachers TO supabase_admin;
GRANT ALL ON attendance TO supabase_admin;
GRANT ALL ON schedules TO supabase_admin;
GRANT ALL ON class_events TO supabase_admin;

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
GRANT SELECT, INSERT, UPDATE, DELETE ON class_events TO authenticated;

-- Helper function to get a user's role from the public.users table
CREATE OR REPLACE FUNCTION get_user_role(user_id_to_check uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role FROM public.users WHERE id = user_id_to_check;
$$;
-- Grant execute permission on the helper function to authenticated users
GRANT EXECUTE ON FUNCTION get_user_role(uuid) TO authenticated;


-- =====================================================================
-- RLS Policies for 'users' table
-- =====================================================================
-- Users can select their own user record.
CREATE POLICY "Users can select their own data"
ON public.users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can update their own profile (specific fields handled by backend logic).
-- The policy here allows update if it's their own record.
CREATE POLICY "Users can update their own profile"
ON public.users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins can select all user records.
CREATE POLICY "Admins can select all users"
ON public.users FOR SELECT
TO authenticated
USING (get_user_role(auth.uid()) = 'admin');

-- Admins can update any user record.
CREATE POLICY "Admins can update any user"
ON public.users FOR UPDATE
TO authenticated
USING (get_user_role(auth.uid()) = 'admin');
-- Note: Admin user creation and deletion involves auth.users and is handled by Supabase internal mechanisms
-- or special admin API calls, potentially bypassing RLS on public.users for these specific actions if service key is used by backend.
-- RLS for INSERT on public.users by admin is tricky if ID must match auth.uid().
-- Assume admin backend functions use service role for creating the public.users entry after auth.users creation.
-- For self-signup, the backend service uses the user's session to insert into public.users.
CREATE POLICY "Users can insert their own profile after signup"
ON public.users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);


-- =====================================================================
-- RLS Policies for 'departments' table
-- =====================================================================
-- Any authenticated user can view departments.
CREATE POLICY "Authenticated users can view departments"
ON public.departments FOR SELECT
TO authenticated
USING (true);

-- Only admins can create, update, delete departments.
CREATE POLICY "Admins can manage departments"
ON public.departments FOR ALL -- CUD
TO authenticated
USING (get_user_role(auth.uid()) = 'admin')
WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- =====================================================================
-- RLS Policies for 'courses' table
-- =====================================================================
-- Any authenticated user can view courses.
CREATE POLICY "Authenticated users can view courses"
ON public.courses FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage courses.
CREATE POLICY "Admins can manage courses"
ON public.courses FOR ALL
TO authenticated
USING (get_user_role(auth.uid()) = 'admin')
WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- =====================================================================
-- RLS Policies for 'classes' table
-- =====================================================================
-- Any authenticated user can view classes.
CREATE POLICY "Authenticated users can view classes"
ON public.classes FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage classes.
CREATE POLICY "Admins can manage classes"
ON public.classes FOR ALL
TO authenticated
USING (get_user_role(auth.uid()) = 'admin')
WITH CHECK (get_user_role(auth.uid()) = 'admin');


-- =====================================================================
-- RLS Policies for 'enrollments' table
-- =====================================================================
-- Students can create enrollment requests for themselves.
CREATE POLICY "Students can create their own enrollment requests"
ON public.enrollments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Students can view their own enrollment records.
CREATE POLICY "Students can view their own enrollments"
ON public.enrollments FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Students can cancel (delete) their own 'pending' enrollment requests.
CREATE POLICY "Students can delete their own pending enrollment requests"
ON public.enrollments FOR DELETE
TO authenticated
USING (auth.uid() = user_id AND status = 'pending');

-- CRs can view enrollment requests for classes they are a CR for.
CREATE POLICY "CRs can view enrollment requests for their classes"
ON public.enrollments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid() AND u.role = 'cr'
    AND EXISTS (
      SELECT 1 FROM public.enrollments e_cr
      WHERE e_cr.user_id = auth.uid() AND e_cr.class_id = public.enrollments.class_id AND e_cr.status = 'approved'
    )
  )
);

-- CRs can update (approve/reject) 'pending' enrollment requests for their classes.
CREATE POLICY "CRs can update enrollment requests for their classes"
ON public.enrollments FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid() AND u.role = 'cr'
    AND EXISTS (
      SELECT 1 FROM public.enrollments e_cr
      WHERE e_cr.user_id = auth.uid() AND e_cr.class_id = public.enrollments.class_id AND e_cr.status = 'approved'
    )
  )
)
WITH CHECK ( -- Ensure CR doesn't change user_id or class_id, only status and review fields.
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid() AND u.role = 'cr'
    AND EXISTS (
      SELECT 1 FROM public.enrollments e_cr
      WHERE e_cr.user_id = auth.uid() AND e_cr.class_id = public.enrollments.class_id AND e_cr.status = 'approved'
    )
  ) AND status IN ('approved', 'rejected') -- CR can only set to these statuses
);

-- Admins can manage all enrollment records.
CREATE POLICY "Admins can manage all enrollments"
ON public.enrollments FOR ALL
TO authenticated
USING (get_user_role(auth.uid()) = 'admin')
WITH CHECK (get_user_role(auth.uid()) = 'admin');


-- =====================================================================
-- RLS Policies for 'class_teachers' table (Teacher assignments to classes)
-- =====================================================================
-- Any authenticated user can view teacher assignments for classes.
CREATE POLICY "Authenticated users can view class teacher assignments"
ON public.class_teachers FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage class teacher assignments.
CREATE POLICY "Admins can manage class teacher assignments"
ON public.class_teachers FOR ALL
TO authenticated
USING (get_user_role(auth.uid()) = 'admin')
WITH CHECK (get_user_role(auth.uid()) = 'admin');


-- =====================================================================
-- RLS Policies for 'notices' table
-- =====================================================================
-- Users can view global notices (class_id IS NULL).
CREATE POLICY "Users can view global notices"
ON public.notices FOR SELECT
TO authenticated
USING (class_id IS NULL);

-- Users can view notices for classes they are enrolled in (approved).
CREATE POLICY "Enrolled students can view their class notices"
ON public.notices FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.enrollments e
    WHERE e.user_id = auth.uid() AND e.class_id = public.notices.class_id AND e.status = 'approved'
  )
);

-- Teachers can view notices for classes they are assigned to.
CREATE POLICY "Assigned teachers can view their class notices"
ON public.notices FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.class_teachers ct
    WHERE ct.user_id = auth.uid() AND ct.class_id = public.notices.class_id
  )
);

-- Users can create notices if they are the author (for class notices, further checks needed).
-- This policy is basic, specific creation logic is in backend (e.g. teacher for class, CR for class).
CREATE POLICY "Users can create their own notices"
ON public.notices FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- Users can update their own notices.
CREATE POLICY "Users can update their own notices"
ON public.notices FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Users can delete their own notices.
CREATE POLICY "Users can delete their own notices"
ON public.notices FOR DELETE
TO authenticated
USING (auth.uid() = author_id);

-- Admins can manage all notices.
CREATE POLICY "Admins can manage all notices"
ON public.notices FOR ALL
TO authenticated
USING (get_user_role(auth.uid()) = 'admin')
WITH CHECK (get_user_role(auth.uid()) = 'admin');


-- =====================================================================
-- RLS Policies for 'attendance' table
-- =====================================================================
-- Students can view their own attendance records.
CREATE POLICY "Students can view their own attendance"
ON public.attendance FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

-- Teachers/CRs can manage attendance for classes they are responsible for.
-- This is a complex policy: needs to check if user is teacher for the class OR CR for the class.
CREATE POLICY "Teachers and CRs can manage attendance for their classes"
ON public.attendance FOR ALL -- CUD
TO authenticated
USING (
  ( -- User is a teacher for this class
    EXISTS (
      SELECT 1 FROM public.class_teachers ct
      WHERE ct.user_id = auth.uid() AND ct.class_id = public.attendance.class_id
    ) AND get_user_role(auth.uid()) = 'teacher'
  ) OR
  ( -- User is a CR for this class
    EXISTS (
      SELECT 1 FROM public.enrollments e_cr
      WHERE e_cr.user_id = auth.uid() AND e_cr.class_id = public.attendance.class_id AND e_cr.status = 'approved'
    ) AND get_user_role(auth.uid()) = 'cr'
  )
)
WITH CHECK ( -- On insert/update, ensure marked_by_id is the current user
  auth.uid() = marked_by_id AND
  (
    (EXISTS (SELECT 1 FROM public.class_teachers ct WHERE ct.user_id = auth.uid() AND ct.class_id = public.attendance.class_id) AND get_user_role(auth.uid()) = 'teacher') OR
    (EXISTS (SELECT 1 FROM public.enrollments e_cr WHERE e_cr.user_id = auth.uid() AND e_cr.class_id = public.attendance.class_id AND e_cr.status = 'approved') AND get_user_role(auth.uid()) = 'cr')
  )
);

-- Admins can manage all attendance records.
CREATE POLICY "Admins can manage all attendance"
ON public.attendance FOR ALL
TO authenticated
USING (get_user_role(auth.uid()) = 'admin')
WITH CHECK (get_user_role(auth.uid()) = 'admin');


-- =====================================================================
-- RLS Policies for 'schedules' table
-- =====================================================================
-- Any authenticated user can view schedules.
CREATE POLICY "Authenticated users can view schedules"
ON public.schedules FOR SELECT
TO authenticated
USING (true);

-- Teachers/CRs can manage schedules for their classes.
CREATE POLICY "Teachers and CRs can manage schedules for their classes"
ON public.schedules FOR ALL -- CUD
TO authenticated
USING (
  ( -- User is a teacher for this class
    EXISTS (
      SELECT 1 FROM public.class_teachers ct
      WHERE ct.user_id = auth.uid() AND ct.class_id = public.schedules.class_id
    ) AND get_user_role(auth.uid()) = 'teacher'
  ) OR
  ( -- User is a CR for this class
    EXISTS (
      SELECT 1 FROM public.enrollments e_cr
      WHERE e_cr.user_id = auth.uid() AND e_cr.class_id = public.schedules.class_id AND e_cr.status = 'approved'
    ) AND get_user_role(auth.uid()) = 'cr'
  )
)
WITH CHECK (
  (EXISTS (SELECT 1 FROM public.class_teachers ct WHERE ct.user_id = auth.uid() AND ct.class_id = public.schedules.class_id) AND get_user_role(auth.uid()) = 'teacher') OR
  (EXISTS (SELECT 1 FROM public.enrollments e_cr WHERE e_cr.user_id = auth.uid() AND e_cr.class_id = public.schedules.class_id AND e_cr.status = 'approved') AND get_user_role(auth.uid()) = 'cr')
);

-- Admins can manage all schedules.
CREATE POLICY "Admins can manage all schedules"
ON public.schedules FOR ALL
TO authenticated
USING (get_user_role(auth.uid()) = 'admin')
WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- =====================================================================
-- RLS Policies for 'class_events' table
-- =====================================================================
-- Any authenticated user can view class events.
CREATE POLICY "Authenticated users can view class events"
ON public.class_events FOR SELECT
TO authenticated
USING (true);

-- CRs can manage events for classes they are CR for.
CREATE POLICY "CRs can manage events for their classes"
ON public.class_events FOR ALL -- CUD
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.enrollments e_cr
    WHERE e_cr.user_id = auth.uid() AND e_cr.class_id = public.class_events.class_id AND e_cr.status = 'approved'
  ) AND get_user_role(auth.uid()) = 'cr'
)
WITH CHECK (
  auth.uid() = created_by_id AND -- CR must be the creator to modify/delete (or use a different logic for updates)
  EXISTS (
    SELECT 1 FROM public.enrollments e_cr
    WHERE e_cr.user_id = auth.uid() AND e_cr.class_id = public.class_events.class_id AND e_cr.status = 'approved'
  ) AND get_user_role(auth.uid()) = 'cr'
);
-- Consider if a CR should only be able to update/delete events they created.
-- The above policy for update/delete implies CR must be the creator.
-- For INSERT, created_by_id should be auth.uid().

-- Admins can manage all class events.
CREATE POLICY "Admins can manage all class events"
ON public.class_events FOR ALL
TO authenticated
USING (get_user_role(auth.uid()) = 'admin')
WITH CHECK (get_user_role(auth.uid()) = 'admin');
