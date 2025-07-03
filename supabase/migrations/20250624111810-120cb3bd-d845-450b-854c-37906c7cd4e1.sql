
-- Add new status options to the constraint
ALTER TABLE public.consultants 
DROP CONSTRAINT IF EXISTS consultants_status_check;

ALTER TABLE public.consultants 
ADD CONSTRAINT consultants_status_check 
CHECK (status IN (
  'prospect', 
  'focus', 
  'presented-prospect', 
  'phone-coordination', 
  'follow-up', 
  'high-interest',
  'upgrading-other-agreements',
  'seeking-upgrade',
  'postponed',
  'not-track',
  'ok-if'
));

-- Create a table for saved filter presets
CREATE TABLE public.filter_presets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  filters JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security for filter presets
ALTER TABLE public.filter_presets ENABLE ROW LEVEL SECURITY;

-- Create policy for filter presets
CREATE POLICY "Users can manage their own filter presets" 
  ON public.filter_presets 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Add last_activity_date column to consultants for better activity tracking
ALTER TABLE public.consultants 
ADD COLUMN last_activity_date DATE DEFAULT CURRENT_DATE;

-- Add responsible_user_id column to track who is responsible for each consultant
ALTER TABLE public.consultants 
ADD COLUMN responsible_user_id UUID REFERENCES auth.users;

-- Create index for better performance
CREATE INDEX idx_consultants_responsible ON public.consultants(responsible_user_id);
CREATE INDEX idx_consultants_last_activity ON public.consultants(last_activity_date);
