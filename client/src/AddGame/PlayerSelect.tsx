import React from 'react';

import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Player } from '../types';

interface Props {
  players: Player[], 
  selectedPlayer: number,
  setSelectedPlayer(playerId: number): void
}

const PlayerSelect: React.FunctionComponent<Props> = ({ players, selectedPlayer, setSelectedPlayer }) => {

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlayer(+event.target.value);
  }

  return (
    <FormControl>
      <InputLabel htmlFor="age-simple">Player</InputLabel>
      <Select
        value={selectedPlayer}
        onChange={handleChange}
      >
        <MenuItem key={"-1"} value={-1}>
          <em>None</em>
        </MenuItem>
        { players.map(player => 
          <MenuItem key={player.id} value={player.id}>{player.name}</MenuItem>  
        )}
      </Select>
    </FormControl>
  )
}

export default PlayerSelect;