ALTER TABLE public.profiles
  ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female'));
