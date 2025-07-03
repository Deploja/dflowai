
-- Create activity_status table for tracking user activity
CREATE TABLE public.activity_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  status TEXT NOT NULL DEFAULT 'offline', -- online, offline, busy, away
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_presentations table for personal presentations
CREATE TABLE public.user_presentations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_skills table for programming languages and skills
CREATE TABLE public.user_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  skill_name TEXT NOT NULL,
  skill_type TEXT NOT NULL DEFAULT 'programming', -- programming, framework, tool, language
  proficiency_level TEXT NOT NULL DEFAULT 'intermediate', -- beginner, intermediate, advanced, expert
  years_experience INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table for active and recent projects
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, paused, cancelled
  start_date DATE NOT NULL,
  end_date DATE,
  technologies TEXT[] DEFAULT '{}',
  client_name TEXT,
  project_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for activity_status
ALTER TABLE public.activity_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity status" 
  ON public.activity_status 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity status" 
  ON public.activity_status 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Add RLS policies for user_presentations
ALTER TABLE public.user_presentations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own presentations" 
  ON public.user_presentations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own presentations" 
  ON public.user_presentations 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Add RLS policies for user_skills
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own skills" 
  ON public.user_skills 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own skills" 
  ON public.user_skills 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Add RLS policies for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own projects" 
  ON public.projects 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own projects" 
  ON public.projects 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at_activity_status BEFORE UPDATE ON public.activity_status
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_user_presentations BEFORE UPDATE ON public.user_presentations
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_user_skills BEFORE UPDATE ON public.user_skills
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_projects BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
