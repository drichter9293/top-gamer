CREATE TABLE app_public.game (
  id        SERIAL PRIMARY KEY,
  title     TEXT CHECK (char_length(title) < 30)
)