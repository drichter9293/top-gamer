CREATE TABLE app_public.match (
  id                SERIAL PRIMARY KEY,
  tournament_id     INTEGER NOT NULL REFERENCES app_public.tournament(id),
  match_time        TIMESTAMPTZ NOT NULL
)