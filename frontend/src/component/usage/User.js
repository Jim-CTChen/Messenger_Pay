import React, { useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import constants from '../../constants/index'
const seedrandom = require('seedrandom');

const COLOR_ARRAY = constants.COLOR_ARRAY;

function User(props) {
  const { user, onClick } = props;
  const [color, setColor] = useState(COLOR_ARRAY[0]);
  const [name, setName] = useState('')

  const getColor = (name) => {
    const rng = seedrandom(name);
    let rand = Math.round(rng() * COLOR_ARRAY.length);
    return COLOR_ARRAY[rand];
  }

  const style = {
    display: 'flex',
    cursor: onClick ? 'pointer' : ''
  }

  useEffect(() => {
    if (user) setName(user);
    else setName('No name')
    setColor(getColor(user));
  }, [user])

  return (
    <Box style={style} onClick={() => {
      if (onClick) onClick();
    }}>
      <Avatar style={{ background: color }}>{name[0]}</Avatar> &nbsp;&nbsp;
      <Typography>{user}</Typography>
    </Box>
  )
}

export default User