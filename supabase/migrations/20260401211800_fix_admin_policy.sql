-- Drop the recursive policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all episodes" ON episodes;

-- Use a security definer function to avoid recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM profiles WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Admin can read all profiles (uses function, no recursion)
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (public.is_admin());

-- Admin can read all episodes
CREATE POLICY "Admins can view all episodes"
  ON episodes FOR SELECT
  USING (public.is_admin());

-- Admin can read all episode sub-tables
CREATE POLICY "Admins can view all episode locations"
  ON episode_locations FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can view all episode triggers"
  ON episode_triggers FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can view all episode symptoms"
  ON episode_symptoms FOR SELECT
  USING (public.is_admin());
