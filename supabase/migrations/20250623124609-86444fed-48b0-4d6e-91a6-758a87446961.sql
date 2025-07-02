
-- Add missing columns to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT,
ADD COLUMN title TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN location TEXT;
