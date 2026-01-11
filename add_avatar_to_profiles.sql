-- Add avatar_url column to profiles table for client profile pictures
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create storage bucket for client avatars if it doesn't exist
-- Run this in Supabase Dashboard > Storage or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;

-- Storage policies for avatars bucket (run in Supabase SQL Editor):
-- Allow authenticated users to upload avatars
-- CREATE POLICY "Users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
-- CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
-- CREATE POLICY "Users can update their avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
-- CREATE POLICY "Users can delete their avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
