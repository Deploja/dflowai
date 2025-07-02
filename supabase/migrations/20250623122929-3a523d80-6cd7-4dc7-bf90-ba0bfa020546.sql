
-- Create a table for storing CVs
CREATE TABLE public.cvs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'english',
  content JSONB, -- Store CV content as JSON
  file_url TEXT, -- Store file URL if CV is uploaded as file
  is_shared BOOLEAN NOT NULL DEFAULT false,
  share_token UUID DEFAULT gen_random_uuid(), -- For public sharing
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity_by UUID REFERENCES auth.users
);

-- Add Row Level Security (RLS)
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;

-- Create policies for CV access
CREATE POLICY "Users can view their own CVs" 
  ON public.cvs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own CVs" 
  ON public.cvs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CVs" 
  ON public.cvs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CVs" 
  ON public.cvs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Allow public access to shared CVs via share_token
CREATE POLICY "Public can view shared CVs" 
  ON public.cvs 
  FOR SELECT 
  USING (is_shared = true);

-- Create an updated_at trigger
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.cvs
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Create a table for CV sharing methods
CREATE TABLE public.cv_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cv_id UUID REFERENCES public.cvs(id) ON DELETE CASCADE NOT NULL,
  share_method TEXT NOT NULL, -- 'email', 'link', 'download'
  shared_with_email TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users NOT NULL
);

-- Add RLS to cv_shares
ALTER TABLE public.cv_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage shares for their CVs" 
  ON public.cv_shares 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.cvs 
    WHERE cvs.id = cv_shares.cv_id 
    AND cvs.user_id = auth.uid()
  ));
