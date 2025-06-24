/*
  # Create storage buckets for media files

  1. Storage Buckets
    - `photo-memories` - for storing family photos
    - `audio-memories` - for storing audio recordings
    - `profile-avatars` - for storing user profile pictures

  2. Security
    - Enable RLS on storage buckets
    - Add policies for authenticated users to upload and access their files
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('photo-memories', 'photo-memories', true),
  ('audio-memories', 'audio-memories', true),
  ('profile-avatars', 'profile-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Photo memories bucket policies
CREATE POLICY "Users can upload photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'photo-memories');

CREATE POLICY "Users can view photos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'photo-memories');

CREATE POLICY "Users can update their photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'photo-memories' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'photo-memories' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Audio memories bucket policies
CREATE POLICY "Users can upload audio"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'audio-memories');

CREATE POLICY "Users can view audio"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'audio-memories');

CREATE POLICY "Users can update their audio"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'audio-memories' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their audio"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'audio-memories' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Profile avatars bucket policies
CREATE POLICY "Users can upload avatars"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profile-avatars');

CREATE POLICY "Users can view avatars"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'profile-avatars');

CREATE POLICY "Users can update their avatars"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their avatars"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);