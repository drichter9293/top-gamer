CREATE TABLE app_public.tournament (
  id        SERIAL PRIMARY KEY,
  game_id   INT REFERENCES app_public.game(id)
)