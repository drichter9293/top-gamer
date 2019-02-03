import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

import { Player, Game, Result, GameResult } from '../types';
import AddPlayer from '../AddPlayer';
import AddGame from '../AddGame';

const App: React.FunctionComponent = () => {
  const [ players, setPlayers ] = useState<Player[]>([]);
  const [ games, setGames ] = useState<Game[]>([]);
  const [ results, setResults ] = useState<Result[]>([]);

  const fetchPlayerData = async () => {
    const response = await fetch('/players/all');
    const json = await response.json();
    const players : Player[] = json.data;
    setPlayers(players);
  }

  useEffect(() => {
    fetchPlayerData();
  }, []);

  const fetchGameData = async () => {
    const response = await fetch('/games/all');
    const json = await response.json();
    const games : Game[] = json.data;
    setGames(games);
  }

  useEffect(() => {
    fetchGameData();
  }, []);

  const fetchResultData = async () => {
    const response = await fetch('/games/all');
    const json = await response.json();
    const results : Result[] = json.data;
    setResults(results);
  }

  useEffect(() => {
    fetchResultData();
  }, []);

  const addPlayer = (player: Player) => {
    axios.post('http://localhost:3001/players/add', {
      name: player.name,
    })
      .then(response => {
        setPlayers([
          ...players,
          response.data.data
        ]);
      })
      .catch(error => {
        console.log(error);
      })
  }

  const addGameResult = (gameResult: GameResult) => {
    axios.post('http://localhost:3001/games/add', gameResult)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })
  };

  return (
    <div className="App">
      <AddPlayer players={players} addPlayer={addPlayer}/>
      <AddGame players={players} addGameResult={addGameResult}/>
      <h1>Users</h1>
      {players.map(player =>
        <div key={player.id}>{player.name}</div>
      )}
    </div>
  );
}

export default App;
