import { Team, GameResult, PlayerRatings, Result } from '../types';
import { computeQ } from '../utils/elo';

const K = 48;

const getEloForTeam = (team: Team, playerRatings: PlayerRatings): number => {
  const averageElo =
    team.reduce((eloSum, playerID) => {
      return eloSum + playerRatings[playerID];
    }, 0) / team.length;
  return averageElo;
};

const getResultsForTeam = (
  score: number,
  expectedValue: number,
  team: Team,
  playerRatings: PlayerRatings,
  gameID: number,
  placement: number
): Result[] => {
  const teamEloSum = team.reduce(
    (eloSum, playerID) => eloSum + playerRatings[playerID],
    0
  );
  const teamDelta = K * (score - expectedValue);
  const results: Result[] = [];
  team.forEach(playerID => {
    const playerElo = playerRatings[playerID];
    const postGameRating = playerElo + (teamDelta * playerElo) / teamEloSum;
    results.push({
      gameID,
      playerID,
      placement,
      postGameRating,
    });
  });
  return results;
};

export const getResultsForGame = (
  playerRatings: PlayerRatings,
  placements: GameResult['placements'],
  gameID: number
): Result[] => {
  let results: Result[] = [];
  const winningTeamElo = getEloForTeam(placements[0][0], playerRatings);
  const winningTeamQ = computeQ(winningTeamElo);
  const losingTeamElos = placements[1].reduce((accumulator, team) => {
    const teamElo = getEloForTeam(team, playerRatings);
    accumulator.push(teamElo);
    return accumulator;
  }, []);
  const losingTeamQs = losingTeamElos.map(elo => computeQ(elo));
  const qSum = winningTeamQ + losingTeamQs.reduce((sum, q) => sum + q, 0);

  const winningTeamExpectedValue = winningTeamQ / qSum;
  results = results.concat(
    getResultsForTeam(
      1,
      winningTeamExpectedValue,
      placements[0][0],
      playerRatings,
      gameID,
      0
    )
  );
  placements[1].forEach((team, teamIndex) => {
    const teamQ = losingTeamQs[teamIndex];
    const expectedValue = teamQ / qSum;
    results = results.concat(
      getResultsForTeam(0, expectedValue, team, playerRatings, gameID, 1)
    );
  });
  return results;
};
