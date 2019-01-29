import { GamesRepository } from './games';
import { PlayersRepository } from './players';
import { ResultsRepository } from './results';

interface IExtensions {
  games: GamesRepository,
  players: PlayersRepository,
  results: ResultsRepository
}

export {
  IExtensions,
  GamesRepository,
  PlayersRepository,
  ResultsRepository
}