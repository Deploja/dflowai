
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
  'meta',
  'upgrading-other-agreements',
  'seeking-upgrade',
  'postponed',
  'not-track',
  'ok-if'
));
