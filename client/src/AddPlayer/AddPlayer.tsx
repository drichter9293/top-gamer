import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Player } from '../types';

interface Props {
  players: Player[],
  addPlayer(player: Player): void
}

const AddPlayer: React.FunctionComponent<Props> = ({ players, addPlayer }) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [name, setName] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const newPlayer: Player = {
      name,
    };
    addPlayer(newPlayer);
    setDialogOpen(false);
    event.preventDefault();
  }
  return (
    <div key="add-player">
      <Button variant="contained" onClick={() => setDialogOpen(true)}>Add Player</Button>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle id="form-dialog-title">Add Player</DialogTitle>
        <DialogContent>
          <form id="add-player" onSubmit={handleSubmit}>
            <TextField
              autoFocus
              id="name"
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button key="cancel" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button key="save" variant="contained" color="primary" type="submit" form="add-player">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddPlayer;