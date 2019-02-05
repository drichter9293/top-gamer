export interface Player {
  id?: number,
  name: string
  rating?: number,
}

export interface Game {
  id?: number,
  timePlayed: Date
}

export interface GameResult {
  timePlayed: Date,
  placements: number[][]
}

export interface Result {
  gameID: number,
  playerID: number,
  placement: number,
  postGameRating: number
}