-- MigrainLog: Initial Schema
-- Tables: profiles, episodes, episode_locations, episode_triggers, episode_symptoms, medications

-- ── Profiles ──
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Episodes ──
CREATE TABLE episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  intensity SMALLINT CHECK (intensity BETWEEN 1 AND 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own episodes"
  ON episodes FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_episodes_user_started ON episodes(user_id, started_at DESC);

-- ── Episode Locations ──
CREATE TABLE episode_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE NOT NULL,
  location TEXT NOT NULL CHECK (location IN (
    'forehead','left_temple','right_temple','crown',
    'behind_eyes','back_of_head','neck','full_head'
  ))
);

ALTER TABLE episode_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own episode locations"
  ON episode_locations FOR ALL
  USING (EXISTS (
    SELECT 1 FROM episodes WHERE episodes.id = episode_locations.episode_id AND episodes.user_id = auth.uid()
  ));

-- ── Episode Triggers ──
CREATE TABLE episode_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE NOT NULL,
  trigger TEXT NOT NULL CHECK (trigger IN (
    'stress','sleep','food','weather','hormones','screen','alcohol','caffeine'
  ))
);

ALTER TABLE episode_triggers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own episode triggers"
  ON episode_triggers FOR ALL
  USING (EXISTS (
    SELECT 1 FROM episodes WHERE episodes.id = episode_triggers.episode_id AND episodes.user_id = auth.uid()
  ));

-- ── Episode Symptoms ──
CREATE TABLE episode_symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE NOT NULL,
  symptom TEXT NOT NULL CHECK (symptom IN (
    'aura','nausea','light_sensitivity','sound_sensitivity'
  ))
);

ALTER TABLE episode_symptoms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own episode symptoms"
  ON episode_symptoms FOR ALL
  USING (EXISTS (
    SELECT 1 FROM episodes WHERE episodes.id = episode_symptoms.episode_id AND episodes.user_id = auth.uid()
  ));

-- ── Medications ──
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  dose TEXT,
  taken_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own medications"
  ON medications FOR ALL
  USING (EXISTS (
    SELECT 1 FROM episodes WHERE episodes.id = medications.episode_id AND episodes.user_id = auth.uid()
  ));
