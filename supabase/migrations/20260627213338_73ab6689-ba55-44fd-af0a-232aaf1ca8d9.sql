
-- Storage RLS for "uploads" bucket: admins write, public reads
CREATE POLICY "Public read uploads" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'uploads');

CREATE POLICY "Admins insert uploads" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update uploads" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete uploads" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));

-- Seed default settings rows
INSERT INTO public.site_settings (key, value) VALUES
  ('logo_url', '""'::jsonb),
  ('favicon_url', '""'::jsonb)
ON CONFLICT (key) DO NOTHING;
