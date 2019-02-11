import { IDatabase } from 'pg-promise';
import { IResult } from 'pg-promise/typescript/pg-subset';

import { STARTING_ELO_RATING } from '../../constants';
import { PlayerRatings, Result } from '../../types';


export class PlayersRepository {
  constructor(db: any) {
    this.db = db;
  }

  private db: IDatabase<any>;

  // Creates the table.
  create() {
    return this.db.none(`
      CREATE TABLE players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(30) NOT NULL
      )
    `);
  }

  // Adds a new user, and returns the new object.
  add(name: string) {
    return this.db.one(`
      INSERT INTO players (name)
      VALUES($1) 
      RETURNING *
    `, name);
  }

  // Tries to find a player from name.
  findByName(name: string) {
    return this.db.oneOrNone('SELECT * FROM players WHERE name = $1', name);
  }

  // // Tries to delete a user by id, and returns the number of records deleted.
  remove(id: number) {
    return this.db.result('DELETE FROM players WHERE id = $1', +id, (r: IResult) => r.rowCount);
  }

  // Returns all players.
  all() {
    return this.db.any('SELECT * FROM players');
  }

  getPlayerRatings() {
    return this.db.task('all-players', async t => {
      const players = await this.all();
      const mostRecentResults: Result[] = await t.results.getMostRecentResults();
      const playerRatings = mostRecentResults.reduce((reduction, result) => {
        reduction[result.playerID] = result.postGameRating;
        return reduction;
      }, {} as PlayerRatings);

      players.forEach(player => {
        if (!playerRatings[player.id]) {
          playerRatings[player.id] = STARTING_ELO_RATING;
        }
      })
      return playerRatings;
    });
  }
}