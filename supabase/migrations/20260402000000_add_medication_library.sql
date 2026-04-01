-- ── User Medications Library ──
CREATE TABLE user_medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  default_dose TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own medications library"
  ON user_medications FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_user_medications_user ON user_medications(user_id) WHERE is_active = true;

-- ── Episode Medications (replaces old medications table) ──
CREATE TABLE episode_medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE NOT NULL,
  user_medication_id UUID REFERENCES user_medications(id) NOT NULL,
  dose TEXT,
  taken_at TIMESTAMPTZ DEFAULT now(),
  relief_minutes SMALLINT CHECK (relief_minutes BETWEEN 0 AND 180),
  effectiveness TEXT CHECK (effectiveness IN ('none', 'partial', 'full'))
);

ALTER TABLE episode_medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own episode medications"
  ON episode_medications FOR ALL
  USING (EXISTS (
    SELECT 1 FROM episodes WHERE episodes.id = episode_medications.episode_id AND episodes.user_id = auth.uid()
  ));

-- ── Drop old medications table (never exposed in UI) ──
DROP TABLE IF EXISTS medications;
