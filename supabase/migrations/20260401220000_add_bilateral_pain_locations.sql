-- Add bilateral (left/right) pain locations for clinical accuracy.
-- Migraine is unilateral in ~60% of cases — laterality is a diagnostic criterion (ICHD-3).

ALTER TABLE episode_locations
  DROP CONSTRAINT IF EXISTS episode_locations_location_check;

ALTER TABLE episode_locations
  ADD CONSTRAINT episode_locations_location_check
  CHECK (location IN (
    'left_forehead','right_forehead',
    'left_temple','right_temple',
    'left_behind_eye','right_behind_eye',
    'left_back_of_head','right_back_of_head',
    'left_neck','right_neck',
    'crown',
    'full_head',
    -- Keep old values so existing data doesn't break
    'forehead','behind_eyes','back_of_head','neck'
  ));
