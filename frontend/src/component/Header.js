import { React, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HelpIcon from '@material-ui/icons/Help';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles';

import { AuthContext } from '../AuthContext'

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = (theme) => ({
  appBar: {
    zIndex: 0,
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
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const history = useHistory();

  const handleLogout = () => {
    setAnchorEl(null)
    setCurrentUser(null);
    history.replace('/login')
  }

  return (
    <>
      <Hidden smUp>
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
      </Hidden>
      <Hidden xsDown>
        <AppBar
          component="div"
          className={classes.appBar}
          color="primary"
          position="static"
          elevation={0}
        >
          <Toolbar>
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs>
                <Typography color="inherit" variant="h5" component="h1">
                  Messenger Pay
                </Typography>
              </Grid>
              <Grid item>
                <Button className={classes.button} variant="outlined" color="inherit" size="small">
                  Web setup
                </Button>
              </Grid>
              <Grid item>
                <Tooltip title="Help">
                  <IconButton color="inherit" onClick={e => setAnchorEl(e.currentTarget)}>
                    <HelpIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Alerts • No alerts">
                  <IconButton color="inherit">
                    <NotificationsIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <IconButton color="inherit" className={classes.iconButtonAvatar}>
                  <Avatar
                    src="/static/images/avatar/1.jpg"
                    alt={currentUser.name}
                    onClick={e => setAnchorEl(e.currentTarget)}
                  />
                </IconButton>
              </Grid>
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
          <MenuItem onClick={() => setAnchorEl(null)}>Account</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Hidden>
    </>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(Header);