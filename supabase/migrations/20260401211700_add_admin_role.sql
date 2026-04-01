-- Add admin flag to profiles
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Set Maxim Folko as admin
UPDATE profiles SET is_admin = true WHERE id = '7f3c9b06-3272-4605-82af-5c11edc2f491';

-- Admin can read all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Admin can read all episodes
CREATE POLICY "Admins can view all episodes"
  ON episodes FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
