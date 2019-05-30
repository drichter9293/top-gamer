CREATE TABLE app_public.match_result (
  PRIMARY KEY (match_id, user_id),
  match_id          INT REFERENCES app_public.match(id),
  user_id           INT REFERENCES app_public.user(id),
  placement         INT NOT NULL,
  post_game_rating  REAL NOT NULL  
)