import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTheme } from '@material-ui/styles';

import produce from 'immer';

import { Player, GameResult } from '../types';
import PlayerSelect from './PlayerSelect';
import { Theme } from '@material-ui/core';

interface Props {
  players: {[playerID: number] : Player },
  addGameResult(gameResult: GameResult): void
}

const AddGame: React.FunctionComponent<Props> = ({ players, addGameResult }) => {
  const theme: Theme = useTheme();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [placements, setPlacements] = React.useState<GameResult['placements']>([
    [[-1]],
    [[-1], [2]],
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const gameResult: GameResult = {
      timePlayed: new Date(),
      placements,
    };
    addGameResult(gameResult);
    setDialogOpen(false);
    event.preventDefault();
  }

  const setSelectedPlayer = (placementIndex: number, teamIndex: number, teamPositionIndex: number, playerID: number) => {
    const newPlacements = produce(placements, (draftPlacements) => {
      draftPlacements[placementIndex][teamIndex][teamPositionIndex] = playerID;
    });
    setPlacements(newPlacements);
  }

  return (
    <div key="add-game">
      <Button variant="contained" onClick={() => setDialogOpen(true)}>Add Game</Button>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle id="form-dialog-title">Add Game</DialogTitle>
        <DialogContent>
          <form id="add-game" onSubmit={handleSubmit}>
            { placements.map((placement, placementIndex) => 
              <div key={placementIndex} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ paddingRight: theme.spacing.unit }}>{placementIndex + 1}</span>
                { placement.map((team, teamIndex) =>
                  <div key={teamIndex}>
                    { team.map((playerID, teamPositionIndex) => 
                      <PlayerSelect
                        key={playerID}
                        players={players}
                        selectedPlayer={playerID}
                        setSelectedPlayer={setSelectedPlayer.bind(null, placementIndex, teamIndex, teamPositionIndex)}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button key="cancel" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button key="save" variant="contained" color="primary" type="submit" form="add-game">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddGame;