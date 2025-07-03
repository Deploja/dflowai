
-- Add a column to track if CV content was parsed and extracted
ALTER TABLE public.cvs ADD COLUMN IF NOT EXISTS is_parsed BOOLEAN DEFAULT false;
ALTER TABLE public.cvs ADD COLUMN IF NOT EXISTS parsed_data JSONB;

-- Create a table to store CV parsing results and extracted information
CREATE TABLE IF NOT EXISTS public.cv_parsing_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cv_id UUID REFERENCES public.cvs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  extracted_data JSONB NOT NULL,
  parsing_status TEXT NOT NULL DEFAULT 'completed',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.cv_parsing_results ENABLE ROW LEVEL SECURITY;

-- Create policies for CV parsing results
CREATE POLICY "Users can view their own parsing results" 
  ON public.cv_parsing_results 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own parsing results" 
  ON public.cv_parsing_results 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Update the cvs table policies to include consultant_id access
DROP POLICY IF EXISTS "Users can view their own CVs" ON public.cvs;
DROP POLICY IF EXISTS "Users can create their own CVs" ON public.cvs;
DROP POLICY IF EXISTS "Users can update their own CVs" ON public.cvs;
DROP POLICY IF EXISTS "Users can delete their own CVs" ON public.cvs;

CREATE POLICY "Users can view their own CVs" 
  ON public.cvs 
  FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid()::text = consultant_id::text);

CREATE POLICY "Users can create their own CVs" 
  ON public.cvs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR auth.uid()::text = consultant_id::text);

CREATE POLICY "Users can update their own CVs" 
  ON public.cvs 
  FOR UPDATE 
  USING (auth.uid() = user_id OR auth.uid()::text = consultant_id::text);

CREATE POLICY "Users can delete their own CVs" 
  ON public.cvs 
  FOR DELETE 
  USING (auth.uid() = user_id OR auth.uid()::text = consultant_id::text);
