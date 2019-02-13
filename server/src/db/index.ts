import {IMain, IDatabase, IOptions} from 'pg-promise';
import pgPromise from 'pg-promise';

import { IExtensions, GamesRepository, PlayersRepository, ResultsRepository } from './repos';

// pg-promise initialization options:
const initOptions: IOptions<IExtensions> = {
  // Extending the database protocol with our custom repositories;
  // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
  extend(obj: IExtensions) {
    obj.games = new GamesRepository(obj);
    obj.players = new PlayersRepository(obj);
    obj.results = new ResultsRepository(obj, pgp);
  }
};

const pgp: IMain = pgPromise(initOptions);

// Database connection parameters:
const config = {
  host: process.env.DATABASE_URL || 'localhost',
  port: 5432,
  ssl: process.env.NODE_ENV === 'production',
};

const db = <IDatabase<IExtensions> & IExtensions>pgp(config);

export default db;
