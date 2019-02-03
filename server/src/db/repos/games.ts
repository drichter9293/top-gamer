import { IDatabase } from 'pg-promise';

export class GamesRepository {
  constructor(db: any) {
    this.db = db;
  }

  private db: IDatabase<any>;

  // Creates the table.
  create() {
    return this.db.none(`
      CREATE TABLE games (
        id SERIAL PRIMARY KEY,
        time_played TIMESTAMPTZ NOT NULL
      )
    `);
  }

  // Adds a new game, and returns the new object.
  add(timePlayed: Date) {
    return this.db.one(`
      INSERT INTO games (time_played)
      VALUES($1) 
      RETURNING *
    `, timePlayed);
  }

  // Returns all games.
  all() {
    return this.db.any('SELECT * FROM games');
  }
}