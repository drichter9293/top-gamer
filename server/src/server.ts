import express from 'express';
import cors from 'cors';
import path from 'path';

import db from './db';

import { Result, GameResult } from './types';
import { getResultsForGame } from './algorithms/winner-take-all';

import { STARTING_ELO_RATING } from './constants';

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const staticFiles = express.static(path.join(__dirname, '../../client/build'))
// pass the static files (react app) to the express app. 
app.use(staticFiles)

const getPlayerIDs = (placements: GameResult['placements']): number[] => {
  const playerIDs: number[] = [];
  placements.forEach(placement => {
    placement.forEach(team => {
      playerIDs.concat(team);
    });
  }, []);
  return playerIDs;
}

GET('/games/create', () => db.games.create());
GET('/games/all', () => db.games.all());
POST('/games/add', req => {
  return db.task('add-game-result', async t => {
    const game = await t.games.add(req.body.timePlayed);
    const playerRatings = await t.players.getPlayerRatings();
    const gameResults = getResultsForGame(playerRatings, req.body.placements, game.id);
    const query = t.results.addResultsForGame(gameResults);
    await db.any(query);
    return gameResults;
  });
});

GET('/players/create', () => db.players.create());
GET('/players/all', req => {
  return db.task('all-players', async t => {
    try {
      const players = await db.players.all();
      const playerRatings = await t.players.getPlayerRatings();
      players.forEach(player => {
        player.rating = playerRatings[player.id];
      })
      return players;
    } catch(err) {
      console.log(err);
      return "Error getting all players";
    }
  });
});
// add a new player, if it doesn't exist yet, and return the object:
POST('/players/add', req => {
  return db.task('add-player', async t => {
    const player = await t.players.findByName(req.body.name);
    if (player) {
      return player;
    }
    const newPlayer = await t.players.add(req.body.name);
    newPlayer.rating = STARTING_ELO_RATING;
    return newPlayer;
  });
});

GET('/results/create', () => db.results.create());
GET('/results/all', () => db.results.all());

// Generic GET handler;
function GET (url: string, handler: (req: any) => any) {
  app.get(url, (req, res) => {
    handler(req)
      .then((data: any) => {
        res.json({
          success: true,
          data
        });
      })
      .catch((error: any) => {
        res.json({
          success: false,
          error: error.message || error
        });
      });
  });
}

// Generic POST handler;
function POST (url: string, handler: (req: any) => any) {
  app.post(url, (req, res) => {
    handler(req)
      .then((data: any) => {
        res.json({
          success: true,
          data
        });
      })
      .catch((error: any) => {
        res.json({
          success: false,
          error: error.message || error
        });
      });
  });
}

app.use('/*', staticFiles)

app.set('port', (process.env.PORT || 3001))
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`)
})