import { IMain, IDatabase, IOptions } from 'pg-promise';
import pgPromise from 'pg-promise';

import {
  IExtensions,
  GamesRepository,
  PlayersRepository,
  ResultsRepository,
} from './repos';

// pg-promise initialization options:
const initOptions: IOptions<IExtensions> = {
  // Extending the database protocol with our custom repositories;
  // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
  extend(obj: IExtensions) {
    obj.games = new GamesRepository(obj);
    obj.players = new PlayersRepository(obj);
    obj.results = new ResultsRepository(obj, pgp);
  },
};

const pgp: IMain = pgPromise(initOptions);

let db: IDatabase<IExtensions> & IExtensions;
if (process.env.NODE_ENV === 'production') {
  if (process.env.DATABASE_URL) {
    pgp.pg.defaults.ssl = true;
    db = pgp(process.env.DATABASE_URL);
  } else {
    throw Error('DATABASE_URL is undefined');
  }
} else {
  const config = {
    host: 'localhost',
    port: 5432,
  };
  db = pgp(config);
}

export default db;
