import express from 'express';
import cors from 'cors';
import * as path from 'path';

import db from './db';

import { GameResult } from './types';

var app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/../public')));

const getResultsForGame: any = (playerRatings: any, placements: GameResult['placements'], gameID: number) => {
  const results: any[] = [];
  placements.forEach((placement, place) => {
    placement.forEach(team => {
      team.forEach(playerID => {
        results.push({
          gameID,
          playerID,
          placement: place,
          postGameRating: 1500,
        });
      });
    });
  });
  return results;
}

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
    const playerIDs: number[] = getPlayerIDs(req.body.placements);
    const playerRatings = await t.results.getPlayerRatings(playerIDs);
    const gameResults = getResultsForGame(playerRatings, req.body.placements, game.id);
    const query = t.results.addResultsForGame(gameResults);
    await db.any(query);
    return gameResults;
  });
});

GET('/players/create', () => db.players.create());
GET('/players/all', req => {
  return db.task('all-players', async t => {
    const players = await db.players.all();
    const playerIDs: number[] = players.map(player => player.id);
    const playerRatings = await t.results.getPlayerRatings(playerIDs);
    players.forEach(player => {
      player.rating = playerRatings[player.id];
    })
    return players;
  });
});
// add a new player, if it doesn't exist yet, and return the object:
POST('/players/add', req => {
  return db.task('add-player', t => {
    return t.players.findByName(req.body.name)
      .then(player => {
        return player || t.players.add(req.body.name);
      });
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

module.exports = app;
