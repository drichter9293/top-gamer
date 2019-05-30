CREATE TABLE app_public.user (
  id           SERIAL PRIMARY KEY,
  first_name   TEXT NOT NULL CHECK (char_length(first_name) < 30),
  last_name    TEXT CHECK (char_length(first_name) < 30),
  created_at   TIMESTAMPTZ NOT NULL default now()
)