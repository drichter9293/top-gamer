CREATE TABLE app_public.tournament_player (
  PRIMARY KEY (tournament_id, user_id),
  tournament_id    INT REFERENCES app_public.tournament(id),
  user_id          INT REFERENCES app_public.user(id)
)