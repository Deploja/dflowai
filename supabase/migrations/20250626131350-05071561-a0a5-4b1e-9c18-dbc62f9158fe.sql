
-- Add RLS policies to allow the mock user to access all profile-related tables

-- Activity Status policies
CREATE POLICY "Allow mock user activity status access" ON activity_status
FOR ALL USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

-- User Skills policies  
CREATE POLICY "Allow mock user skills access" ON user_skills
FOR ALL USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

-- User Presentations policies
CREATE POLICY "Allow mock user presentations access" ON user_presentations
FOR ALL USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

-- Projects policies
CREATE POLICY "Allow mock user projects access" ON projects
FOR ALL USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

-- CVs policies
CREATE POLICY "Allow mock user cvs access" ON cvs
FOR ALL USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

-- CV Parsing Results policies
CREATE POLICY "Allow mock user cv parsing access" ON cv_parsing_results
FOR ALL USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

-- CV Shares policies
CREATE POLICY "Allow mock user cv shares access" ON cv_shares
FOR ALL USING (created_by = '00000000-0000-0000-0000-000000000001'::uuid);

-- Profiles policies
CREATE POLICY "Allow mock user profile access" ON profiles
FOR ALL USING (id = '00000000-0000-0000-0000-000000000001'::uuid);

-- Consultants policies (if the mock user has a consultant profile)
CREATE POLICY "Allow mock user consultant access" ON consultants
FOR ALL USING (id = '00000000-0000-0000-0000-000000000001'::uuid OR responsible_user_id = '00000000-0000-0000-0000-000000000001'::uuid);

-- Create storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for avatars
CREATE POLICY "Allow mock user avatar access" ON storage.objects
FOR ALL USING (bucket_id = 'avatars');
