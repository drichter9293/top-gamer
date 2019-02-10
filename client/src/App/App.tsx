import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles';

import './App.css';

import { NewPlayer, Player, Result, GameResult } from '../types';
import AddPlayer from '../AddPlayer';
import AddGame from '../AddGame';
import produce from 'immer';

const App: React.FunctionComponent = () => {
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

  const updatePlayerRating = (playerID: number, newRating: number) => {
    const updatedPlayers = produce(players, draft => {
      draft[playerID]['rating'] = newRating;
    });
    console.log(updatedPlayers);
    setPlayers(updatedPlayers)
  };

  const addPlayer = (player: NewPlayer) => {
    axios.post('http://localhost:3001/players/add', {
      name: player.name,
    })
      .then(response => {
        const newPlayer = response.data.data;
        const updatedPlayers = produce(players, draft => {
          draft[newPlayer['id']] = newPlayer;
        });
        setPlayers(updatedPlayers);
      })
      .catch(error => {
        console.log(error);
      })
  }

  const addGameResult = (gameResult: GameResult) => {
    axios.post('http://localhost:3001/games/add', gameResult)
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

  const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
  });

  const sortedPlayers = Object.entries(players).sort((a, b) => b[1].rating - a[1].rating);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <AddPlayer players={players} addPlayer={addPlayer}/>
        <AddGame players={players} addGameResult={addGameResult}/>
        <h1>Users</h1>
        {sortedPlayers.map(([playerID, player]) =>
          <div key={playerID}>{player.name} : {player.rating} </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
