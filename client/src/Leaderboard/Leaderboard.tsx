import React from 'react';

import { List, ListItem, Paper, Theme, Typography } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/styles';

import PlayerAvatar from '../PlayerAvatar';
import { Player } from '../types';

const styles = (theme: Theme) => ({
  '@global': {
    body: {
      ...theme.typography.body1,
    },
  },
  paper: {
    maxWidth: 400,
    margin: `${theme.spacing.unit}px auto`,
    paddingTop: theme.spacing.unit * 2,
  },
  listBody: {
    width: '100%',
    display: 'flex',
    alignItems: 'baseline',
  },
  placement: {
    marginRight: theme.spacing.unit * 2,
  },
  playerIcon: {
    marginRight: theme.spacing.unit,
  },
  playerName: {
    flexGrow: 1,
  },
});

interface Props extends WithStyles<typeof styles> {
  players: { [playerID: number]: Player };
}

const Leaderboard: React.FunctionComponent<Props> = ({ players, classes }) => {
  const sortedPlayers = Object.entries(players).sort(
    (a, b) => b[1].rating - a[1].rating
  );

  return (
    <Paper className={classes.paper}>
      <Typography variant="h3" align="center" gutterBottom>
        Leaderboard
      </Typography>
      <List>
        {sortedPlayers.map(([playerID, player], index) => (
          <ListItem key={playerID}>
            <div className={classes.listBody}>
              <Typography
                key="place"
                variant="h5"
                className={classes.placement}
              >
                {index + 1}
              </Typography>
              <div className={classes.playerIcon}>
                <PlayerAvatar player={player} />
              </div>
              <Typography
                key="name"
                variant="h5"
                className={classes.playerName}
              >
                {player.name}
              </Typography>
              <Typography key="rating" variant="h5">
                {player.rating.toFixed(1)}
              </Typography>
            </div>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default withStyles(styles)(Leaderboard);
