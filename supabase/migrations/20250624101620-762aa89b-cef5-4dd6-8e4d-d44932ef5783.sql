
-- Add a status column to the consultants table to track which pipeline stage they're in
ALTER TABLE public.consultants 
ADD COLUMN status TEXT DEFAULT 'prospect';

-- Create an index for better performance when filtering by status
CREATE INDEX idx_consultants_status ON public.consultants(status);

-- Add a constraint to ensure only valid statuses are used
ALTER TABLE public.consultants 
ADD CONSTRAINT consultants_status_check 
CHECK (status IN ('prospect', 'focus', 'presented-prospect', 'phone-coordination', 'follow-up', 'meta'));
