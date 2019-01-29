import { IDatabase } from 'pg-promise';

export class ResultsRepository {
  constructor(db: any) {
    this.db = db;
  }

  private db: IDatabase<any>;

  // Creates the table.
  create() {
    return this.db.none(`
      CREATE TABLE results (
        game_id INT REFERENCES games(id),
        player_id INT REFERENCES players(id),
        PRIMARY KEY (game_id, player_id),
        placement INT NOT NULL,
        post_game_rating INT NOT NULL
      )
    `);
  }

  // Adds a new result, and returns the new object.
  add(gameID: number, playerID: number, placement: number, postGameRating: number) {
    return this.db.one(`
      INSERT INTO results (game_id, player_id, placement, post_game_rating)
      VALUES(${gameID}, ${playerID}, ${placement}, ${postGameRating}) 
      RETURNING *
    `);
  }

  // Returns all results.
  all() {
    return this.db.any('SELECT * FROM results');
  }
}