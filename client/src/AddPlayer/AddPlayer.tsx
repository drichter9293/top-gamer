import React from 'react';

import { Button, TextField, Dialog, DialogTitle, DialogActions, DialogContent, Theme } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/styles';
import { PersonAdd } from '@material-ui/icons';

import { Player, NewPlayer } from '../types';

const styles = (theme: Theme) => ({
  addPlayerButton: {
    marginRight: theme.spacing.unit * 2,
  },
  addPlayerIcon: {
    marginRight: theme.spacing.unit,
  }
});

interface Props extends WithStyles<typeof styles> {
  players: {[playerID: number] : Player},
  addPlayer(player: NewPlayer): void
}

const AddPlayer: React.FunctionComponent<Props> = ({ players, addPlayer, classes }) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [name, setName] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const newPlayer: NewPlayer = {
      name,
    };
    addPlayer(newPlayer);
    setDialogOpen(false);
    event.preventDefault();
  }
  return (
    <div key="add-player">
      <Button variant="outlined" color="primary" className={classes.addPlayerButton} onClick={() => setDialogOpen(true)}>
        <PersonAdd className={classes.addPlayerIcon}/>
        Add Player
      </Button>
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

export default withStyles(styles)(AddPlayer);