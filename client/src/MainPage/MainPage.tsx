import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Theme, withStyles } from '@material-ui/core/styles'
import { WithStyles } from '@material-ui/styles';

import { NewPlayer, Player, Result, GameResult } from '../types';
import Leaderboard from '../Leaderboard';
import AddPlayer from '../AddPlayer';
import AddGame from '../AddGame';
import produce from 'immer';

const styles = (theme: Theme) => ({
  buttonRow: {
    margin: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'center',
  },
});

interface Props extends WithStyles<typeof styles> {}

const MainPage: React.FunctionComponent<Props> = ({ classes }) => {
  const [ players, setPlayers ] = useState<{[playerID: number] : Player}>({});

  const fetchPlayerData = async () => {
    const response = await fetch('/players/all');
    const json = await response.json();
    const playersData = json.data as Player[];
    const players : {[playerID: number] : Player} = playersData.reduce((accumulator, player: Player) => {
      accumulator[player.id] = player;
      return accumulator;
    }, {} as {[playerID: number] : Player});
    setPlayers(players);
  }

  useEffect(() => {
    fetchPlayerData();
  }, []);

  const addPlayer = (player: NewPlayer) => {
    axios.post('/players/add', {
      name: player.name,
    })
      .then(response => {
        if (response.data.success) {
          const newPlayer = response.data.data;
          const updatedPlayers = produce(players, draft => {
            draft[newPlayer['id']] = newPlayer;
          });
          setPlayers(updatedPlayers);
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  const addGameResult = (gameResult: GameResult) => {
    axios.post('/games/add', gameResult)
      .then(response => {
        const results = response.data.data;
        const updatedPlayers = produce(players, draft => {
          results.forEach((result: Result) => {
            draft[result.playerID].rating = result.postGameRating;
          });
        });
        setPlayers(updatedPlayers)
      })
      .catch(error => {
        console.log(error);
      })
  };

  return (
    <div className="App">
      <div className={classes.buttonRow}>
        <AddPlayer players={players} addPlayer={addPlayer}/>
        <AddGame players={players} addGameResult={addGameResult}/>
      </div>
      <Leaderboard players={players} />
    </div>
  );
}

export default withStyles(styles)(MainPage);
