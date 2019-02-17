import React from 'react';

import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Player } from '../types';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
}));

interface Props {
  players: { [playerID: number]: Player };
  selectedPlayer: number;
  setSelectedPlayer(playerId: number): void;
}

const PlayerSelect: React.FunctionComponent<Props> = ({
  players,
  selectedPlayer,
  setSelectedPlayer,
}) => {
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlayer(+event.target.value);
  };

  const key = 'player' + selectedPlayer;

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor={key}>Player</InputLabel>
      <Select
        value={selectedPlayer}
        onChange={handleChange}
        inputProps={{
          name: 'player',
          id: key,
        }}
      >
        <MenuItem key={'-1'} value="-1">
          <em>None</em>
        </MenuItem>
        {Object.entries(players).map(([playerID, player]) => (
          <MenuItem key={playerID} value={playerID}>
            {player.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PlayerSelect;
