
-- Create users table to support the foreign key relationships
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert the mock user that the application is using
INSERT INTO public.users (id, email) 
VALUES ('00000000-0000-0000-0000-000000000001', 'demo@example.com')
ON CONFLICT (id) DO NOTHING;

-- Add foreign key constraints to existing tables if they don't exist
DO $$ 
BEGIN
  -- Check and add foreign key for activity_status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'activity_status_user_id_fkey'
  ) THEN
    ALTER TABLE public.activity_status 
    ADD CONSTRAINT activity_status_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;

  -- Check and add foreign key for user_skills
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_skills_user_id_fkey'
  ) THEN
    ALTER TABLE public.user_skills 
    ADD CONSTRAINT user_skills_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;

  -- Check and add foreign key for user_presentations
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_presentations_user_id_fkey'
  ) THEN
    ALTER TABLE public.user_presentations 
    ADD CONSTRAINT user_presentations_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;

  -- Check and add foreign key for projects
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'projects_user_id_fkey'
  ) THEN
    ALTER TABLE public.projects 
    ADD CONSTRAINT projects_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;

  -- Check and add foreign key for cvs
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'cvs_user_id_fkey'
  ) THEN
    ALTER TABLE public.cvs 
    ADD CONSTRAINT cvs_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;

  -- Check and add foreign key for profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_id_fkey'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create organization_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.organization_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT,
  industry TEXT,
  website TEXT,
  description TEXT,
  address TEXT,
  timezone TEXT DEFAULT 'Europe/Stockholm',
  currency TEXT DEFAULT 'SEK',
  fiscal_year_start TEXT DEFAULT 'January',
  working_days TEXT DEFAULT 'Monday-Friday',
  default_working_hours INTEGER DEFAULT 8,
  email_notifications BOOLEAN DEFAULT true,
  public_profile BOOLEAN DEFAULT true,
  auto_assignments BOOLEAN DEFAULT false,
  require_approval BOOLEAN DEFAULT true,
  locations TEXT[] DEFAULT ARRAY['Stockholm, Sweden'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for demo mode (allow all operations for now)
-- Users table policies
DROP POLICY IF EXISTS "Allow all operations on users" ON public.users;
CREATE POLICY "Allow all operations on users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- Activity status policies
DROP POLICY IF EXISTS "Allow all operations on activity_status" ON public.activity_status;
CREATE POLICY "Allow all operations on activity_status" ON public.activity_status FOR ALL USING (true) WITH CHECK (true);

-- User skills policies
DROP POLICY IF EXISTS "Allow all operations on user_skills" ON public.user_skills;
CREATE POLICY "Allow all operations on user_skills" ON public.user_skills FOR ALL USING (true) WITH CHECK (true);

-- User presentations policies
DROP POLICY IF EXISTS "Allow all operations on user_presentations" ON public.user_presentations;
CREATE POLICY "Allow all operations on user_presentations" ON public.user_presentations FOR ALL USING (true) WITH CHECK (true);

-- Projects policies
DROP POLICY IF EXISTS "Allow all operations on projects" ON public.projects;
CREATE POLICY "Allow all operations on projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

-- CVs policies
DROP POLICY IF EXISTS "Allow all operations on cvs" ON public.cvs;
CREATE POLICY "Allow all operations on cvs" ON public.cvs FOR ALL USING (true) WITH CHECK (true);

-- Profiles policies
DROP POLICY IF EXISTS "Allow all operations on profiles" ON public.profiles;
CREATE POLICY "Allow all operations on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- Organization settings policies
DROP POLICY IF EXISTS "Allow all operations on organization_settings" ON public.organization_settings;
CREATE POLICY "Allow all operations on organization_settings" ON public.organization_settings FOR ALL USING (true) WITH CHECK (true);
