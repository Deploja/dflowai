
-- Create storage bucket for CVs if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the cvs bucket
CREATE POLICY "Allow authenticated users to upload CVs" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'cvs' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow users to view CV files" ON storage.objects
FOR SELECT USING (bucket_id = 'cvs');

CREATE POLICY "Allow users to update their own CV files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'cvs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to delete their own CV files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'cvs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
