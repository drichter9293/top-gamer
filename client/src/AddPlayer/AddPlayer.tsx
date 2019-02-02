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

  const handleSubmit = () => {
    const newPlayer: Player = {
      name,
    };
    addPlayer(newPlayer);
  }
  return (
    <>
      <Button variant="contained" onClick={() => setDialogOpen(true)}>Add Player</Button>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle id="form-dialog-title">Add Player</DialogTitle>
        <DialogContent>
          <form>
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
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddPlayer;