
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own presentations" ON public.user_presentations;
DROP POLICY IF EXISTS "Users can create their own presentations" ON public.user_presentations;
DROP POLICY IF EXISTS "Users can update their own presentations" ON public.user_presentations;
DROP POLICY IF EXISTS "Users can delete their own presentations" ON public.user_presentations;

DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

DROP POLICY IF EXISTS "Users can view their own activity status" ON public.activity_status;
DROP POLICY IF EXISTS "Users can create their own activity status" ON public.activity_status;
DROP POLICY IF EXISTS "Users can update their own activity status" ON public.activity_status;
DROP POLICY IF EXISTS "Users can delete their own activity status" ON public.activity_status;

-- Enable RLS on all tables
ALTER TABLE public.user_presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_status ENABLE ROW LEVEL SECURITY;

-- Create policies for user_presentations table
CREATE POLICY "Users can view their own presentations" 
  ON public.user_presentations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own presentations" 
  ON public.user_presentations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own presentations" 
  ON public.user_presentations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own presentations" 
  ON public.user_presentations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for projects table
CREATE POLICY "Users can view their own projects" 
  ON public.projects 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
  ON public.projects 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
  ON public.projects 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
  ON public.projects 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for activity_status table
CREATE POLICY "Users can view their own activity status" 
  ON public.activity_status 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity status" 
  ON public.activity_status 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity status" 
  ON public.activity_status 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activity status" 
  ON public.activity_status 
  FOR DELETE 
  USING (auth.uid() = user_id);
