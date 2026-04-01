-- Add sinus (maxillary/cheek) and jaw (mandibular) pain zones.
-- Maps to trigeminal nerve V2/V3 dermatomes — relevant for sinus headache,
-- facial migraine, and TMJ-related tension headache.

ALTER TABLE episode_locations
  DROP CONSTRAINT IF EXISTS episode_locations_location_check;

ALTER TABLE episode_locations
  ADD CONSTRAINT episode_locations_location_check
  CHECK (location IN (
    'left_forehead','right_forehead',
    'left_temple','right_temple',
    'left_behind_eye','right_behind_eye',
    'left_sinus','right_sinus',
    'left_jaw','right_jaw',
    'left_back_of_head','right_back_of_head',
    'left_neck','right_neck',
    'crown',
    'full_head',
    -- Legacy values for backward compatibility
    'forehead','behind_eyes','back_of_head','neck'
  ));
