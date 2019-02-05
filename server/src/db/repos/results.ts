import { IDatabase, IMain, ColumnSet } from 'pg-promise';
import pgPromise = require('pg-promise');
import { Result } from 'range-parser';

export class ResultsRepository {
  constructor(db: any, pgp: IMain) {
    this.db = db;
    this.pgp = pgp;

    this.createColumnSets();
  }

  private db: IDatabase<any>;
  private pgp: IMain;
  private static cs: ResultsColumnSets;

  // example of setting up ColumnSet objects:
  private createColumnSets() {
    // create all ColumnSet objects only once:
    if (!ResultsRepository.cs) {
      const helpers = this.pgp.helpers;
      const cs: ResultsColumnSets = {};

      cs.insert = new helpers.ColumnSet([
        {
          name: 'game_id',
          prop: 'gameID'
        },
        {
          name: 'player_id',
          prop: 'playerID',
        },
        'placement',
        {
          name: 'post_game_rating',
          prop: 'postGameRating',
        }
      ], {
        table: 'results'
      });

      ResultsRepository.cs = cs;
    }
  }

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

  getMostRecentResults(playerIDs: number[]) {
    return this.db.any(`
      SELECT DISTINCT ON (player_id) player_id, game_id, post_game_rating
      FROM results
      ORDER BY player_id, game_id desc
    `);
  }

  async getPlayerRatings(playerIDs: number[]) {
    const mostRecentResults = await this.getMostRecentResults(playerIDs);
    return mostRecentResults.reduce((reduction, result) => {
      reduction[result.player_id] = result.post_game_rating;
      return reduction;
    }, {});
  }

  addResultsForGame(gameResults: any) {
    return this.pgp.helpers.insert(gameResults, ResultsRepository.cs.insert);
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

type ResultsColumnSets = {
  insert?: ColumnSet
}