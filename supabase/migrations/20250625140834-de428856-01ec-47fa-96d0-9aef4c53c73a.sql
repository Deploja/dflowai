
-- First, let's make sure the cvs bucket exists and is public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'cvs';

-- If the bucket doesn't exist, create it
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Users can upload their own CVs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own CVs" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own CVs" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own CVs" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload CVs" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to view CV files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own CV files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own CV files" ON storage.objects;

-- Create new, simplified policies for the cvs bucket
CREATE POLICY "Anyone can view CV files" ON storage.objects
FOR SELECT USING (bucket_id = 'cvs');

CREATE POLICY "Authenticated users can upload CVs" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'cvs' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own CV files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'cvs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own CV files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'cvs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
