export interface Player {
  id?: number,
  name: string
}

export interface Game {
  id?: number,
  timePlayed: Date
}

export interface Result {
  gameID: number,
  playerID: number,
  placement: number,
  postGameRating: number
}