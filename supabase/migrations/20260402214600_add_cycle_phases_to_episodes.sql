ALTER TABLE episodes
  ADD COLUMN menstrual_phase TEXT,
  ADD COLUMN ovulation_phase TEXT;

ALTER TABLE episodes
  ADD CONSTRAINT episodes_menstrual_phase_check
    CHECK (menstrual_phase IN ('before', 'during', 'after', 'not_applicable')),
  ADD CONSTRAINT episodes_ovulation_phase_check
    CHECK (ovulation_phase IN ('before', 'during', 'after', 'not_applicable'));
