export interface Player {
  id?: number,
  name: string
  rating: number,
}

export interface Game {
  id?: number,
  timePlayed: Date
}

export type Team = number[];

type Placement = Team[];

export interface PlayerRatings { [playerID: number]: number }

export interface GameResult {
  timePlayed: Date,
  placements: Placement[]
}

export interface Result {
  gameID: number,
  playerID: number,
  placement: number,
  postGameRating: number
}