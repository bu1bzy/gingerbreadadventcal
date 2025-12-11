-- Create storage bucket for door images
INSERT INTO storage.buckets (id, name, public)
VALUES ('door-images', 'door-images', true);

-- Allow anyone to view images (public bucket)
CREATE POLICY "Anyone can view door images"
ON storage.objects FOR SELECT
USING (bucket_id = 'door-images');

-- Allow anyone to upload images (since calendars don't require auth)
CREATE POLICY "Anyone can upload door images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'door-images');

-- Allow anyone to update their uploaded images
CREATE POLICY "Anyone can update door images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'door-images');

-- Allow anyone to delete images
CREATE POLICY "Anyone can delete door images"
ON storage.objects FOR DELETE
USING (bucket_id = 'door-images');