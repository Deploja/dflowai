
-- Add a role column to the consultants table
ALTER TABLE public.consultants 
ADD COLUMN role TEXT DEFAULT 'consultant';

-- Add a cv_id column to link consultants with their CVs
ALTER TABLE public.consultants 
ADD COLUMN cv_id UUID REFERENCES public.cvs(id);

-- Create an index for better performance
CREATE INDEX idx_consultants_cv_id ON public.consultants(cv_id);

-- Update the cvs table to allow consultants to be linked
-- Add a consultant_id column to cvs for better relationship tracking
ALTER TABLE public.cvs 
ADD COLUMN consultant_id UUID REFERENCES public.consultants(id);

-- Create an index for better performance
CREATE INDEX idx_cvs_consultant_id ON public.cvs(consultant_id);

-- Update RLS policies to allow admins to manage consultant CVs
-- Create a policy that allows users to view CVs linked to consultants
CREATE POLICY "Users can view consultant CVs" 
  ON public.cvs 
  FOR SELECT 
  USING (consultant_id IS NOT NULL);

-- Allow users to create CVs for consultants
CREATE POLICY "Users can create consultant CVs" 
  ON public.cvs 
  FOR INSERT 
  WITH CHECK (consultant_id IS NOT NULL);

-- Allow users to update CVs linked to consultants
CREATE POLICY "Users can update consultant CVs" 
  ON public.cvs 
  FOR UPDATE 
  USING (consultant_id IS NOT NULL);
