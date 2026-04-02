-- Add locale preference to profiles for i18n support
ALTER TABLE profiles ADD COLUMN locale text NOT NULL DEFAULT 'en';
