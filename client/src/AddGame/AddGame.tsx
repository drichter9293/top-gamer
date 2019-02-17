import React from 'react';

import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Theme,
} from '@material-ui/core';
import { useTheme, withStyles, WithStyles } from '@material-ui/styles';
import { PersonAdd, VideogameAsset } from '@material-ui/icons';

import produce from 'immer';

import { Player, GameResult } from '../types';
import PlayerSelect from './PlayerSelect';

const styles = (theme: Theme) => ({
  addGameIcon: {
    marginRight: theme.spacing.unit,
  },
});

interface Props extends WithStyles<typeof styles> {
  players: { [playerID: number]: Player };
  addGameResult(gameResult: GameResult): void;
}

const AddGame: React.FunctionComponent<Props> = ({
  players,
  addGameResult,
  classes,
}) => {
  const theme: Theme = useTheme();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [placements, setPlacements] = React.useState<GameResult['placements']>([
    [[-1]],
    [[-1]],
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const gameResult: GameResult = {
      timePlayed: new Date(),
      placements,
    };
    addGameResult(gameResult);
    setDialogOpen(false);
    event.preventDefault();
  };

  const setSelectedPlayer = (
    placementIndex: number,
    teamIndex: number,
    teamPositionIndex: number,
    playerID: number
  ) => {
    const newPlacements = produce(placements, draftPlacements => {
      draftPlacements[placementIndex][teamIndex][teamPositionIndex] = playerID;
    });
    setPlacements(newPlacements);
  };

  const addTeam = (placementIndex: number) => {
    const newPlacements = produce(placements, draftPlacements => {
      draftPlacements[placementIndex].push([-1]);
    });
    setPlacements(newPlacements);
  };

  return (
    <div key="add-game">
      <Button
        variant="contained"
        color="primary"
        onClick={() => setDialogOpen(true)}
      >
        <VideogameAsset className={classes.addGameIcon} />
        Add Game
      </Button>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle id="form-dialog-title">Add Game</DialogTitle>
        <DialogContent>
          <form id="add-game" onSubmit={handleSubmit}>
            {placements.map((placement, placementIndex) => (
              <div
                key={placementIndex}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <span style={{ paddingRight: theme.spacing.unit }}>
                  {placementIndex + 1}
                </span>
                {placement.map((team, teamIndex) => (
                  <div key={teamIndex}>
                    {team.map((playerID, teamPositionIndex) => (
                      <PlayerSelect
                        key={playerID}
                        players={players}
                        selectedPlayer={playerID}
                        setSelectedPlayer={setSelectedPlayer.bind(
                          null,
                          placementIndex,
                          teamIndex,
                          teamPositionIndex
                        )}
                      />
                    ))}
                  </div>
                ))}
                <IconButton
                  aria-label="Add Player"
                  color="primary"
                  onClick={addTeam.bind(null, placementIndex)}
                >
                  <PersonAdd />
                </IconButton>
              </div>
            ))}
          </form>
        </DialogContent>
        <DialogActions>
          <Button key="cancel" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            key="save"
            variant="contained"
            color="primary"
            type="submit"
            form="add-game"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withStyles(styles)(AddGame);
