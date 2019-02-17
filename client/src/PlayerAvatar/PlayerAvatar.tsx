import React from 'react';

import { Avatar } from '@material-ui/core';
import { Player } from '../types';

import toMaterialStyle from 'material-color-hash';

interface Props {
  player: Player;
}

const PlayerAvatar: React.FunctionComponent<Props> = ({ player }) => {
  const style = toMaterialStyle(player.name, 500);

  return (
    <Avatar style={{ backgroundColor: style.backgroundColor }}>
      {player.name.substr(0, 1)}
    </Avatar>
  );
};

export default PlayerAvatar;
