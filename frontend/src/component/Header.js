import { React, useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HelpIcon from '@material-ui/icons/Help';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles';

import constants from '../constants/index'
import { AuthContext } from '../AuthContext';
const seedrandom = require('seedrandom');

const COLOR_ARRAY = constants.COLOR_ARRAY;

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = (theme) => ({
  title: {
    cursor: 'pointer'
  },
  appBar: {
    padding: 8,
    display: 'flex'
  },
  menuButton: {
    marginLeft: -theme.spacing(1),
  },
  iconButtonAvatar: {
    padding: 4,
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: lightColor,
  },
});
function Header(props) {
  const { classes, onDrawerToggle } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [color, setColor] = useState(COLOR_ARRAY[0]);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const history = useHistory();

  const getColor = (name) => {
    const rng = seedrandom(name);
    let rand = Math.round(rng() * COLOR_ARRAY.length);
    return COLOR_ARRAY[rand];
  }

  const handleLogout = () => {
    setAnchorEl(null)
    setCurrentUser(null);
    window.localStorage.removeItem('jwt');
    history.replace('/login')
  }

  useEffect(() => {
    setColor(getColor(currentUser.username));
  }, [currentUser.username])

  return (
    <>
      {/* <Hidden smUp>
        <AppBar color="primary" position="sticky" elevation={0} className={classes.appBar}>
          <Toolbar>
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={onDrawerToggle}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
              <Typography color="inherit" variant="h5" component="h1">
                Messenger Pay
              </Typography>
            </Grid>
          </Toolbar>
        </AppBar>
      </Hidden> */}
      {/* <Hidden xsDown> */}
      <AppBar
        component="div"
        className={classes.appBar}
        color="primary"
        position="sticky"
        elevation={2}
      >
        <Toolbar>
          <Grid
            container
            alignItems="center"
            spacing={1}
            style={{ justifyContent: 'space-between' }}
          >
            <Box pl={3}>
              <Typography
                color="inherit"
                variant="h4"
                className={classes.title}
                onClick={() => history.push('/home')}
              >
                Messenger Pay
              </Typography>
            </Box>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Box mr={2} ml={2}>
                <Button className={classes.button} variant="outlined" color="inherit" size="small">
                  About
                </Button>
              </Box>
              {/* <Tooltip title="Help">
                <IconButton color="inherit">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Alerts • No alerts">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip> */}
              <Avatar
                style={{ background: color, cursor: 'pointer' }}
                onClick={e => setAnchorEl(e.currentTarget)}
              >
                {currentUser.username ? currentUser.username[0] : ''}
              </Avatar> &nbsp;
              <Typography
                style={{ cursor: 'pointer' }}
                onClick={e => setAnchorEl(e.currentTarget)}
              >{currentUser.username}</Typography>
            </Box>
          </Grid>
        </Toolbar>
      </AppBar>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        keepMounted
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <MenuItem onClick={() => {
          setAnchorEl(null);
          history.push('/account');
        }}>
          Account
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      {/* </Hidden> */}
    </>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(Header);