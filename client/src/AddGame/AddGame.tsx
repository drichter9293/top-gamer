import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Player, GameResult } from '../types';
import PlayerSelect from './PlayerSelect';

interface Props {
  players: Player[],
  addGameResult(gameResult: GameResult): void
}

const AddPlayer: React.FunctionComponent<Props> = ({ players, addGameResult }) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [placements, setPlacements] = React.useState<GameResult['placements']>([[-1], [-1, 2], [-1]]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const gameResult: GameResult = {
      timePlayed: new Date(),
      placements,
    };
    addGameResult(gameResult);
    event.preventDefault();
  }

  const setSelectedPlayer = (placementsIndex: number, placementIndex: number, playerId: number) => {
    const newPlacements = [...placements];
    newPlacements[placementsIndex] = [...placements[placementsIndex]];
    newPlacements[placementsIndex][placementIndex] = playerId;
    setPlacements(newPlacements);
  }

  return (
    <>
      <Button variant="contained" onClick={() => setDialogOpen(true)}>Add Game</Button>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle id="form-dialog-title">Add Game</DialogTitle>
        <DialogContent>
          <form id="add-game" onSubmit={handleSubmit}>
            { placements.map((placement, placementsIndex) => 
              <div key={placementsIndex}>
                { placement.map((playerId, placementIndex) =>
                  <PlayerSelect
                    key={playerId}
                    players={players}
                    selectedPlayer={playerId}
                    setSelectedPlayer={setSelectedPlayer.bind(null, placementsIndex, placementIndex)}
                  />
                )}
              </div>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit" form="add-game">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddPlayer;