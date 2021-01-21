import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import TimeAgo from 'javascript-time-ago';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import HomeIcon from '@material-ui/icons/Home';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { AuthContext } from '../../AuthContext';
import User from '../usage/User';
import agent from '../../agent';
import constants from '../../constants/index';

const timeAgo = new TimeAgo();

const styles = (theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: '40px 16px',
  },
  typography: {
    width: '100%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(0, 0, 0, 0.54)',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  divider: {
    backgroundColor: '#e4e4e4',
    height: '2px'
  },
  red: {
    color: 'red'
  },
  green: {
    color: 'green'
  },
});

const EVENT_TYPE = constants.EVENT_TYPE;
const SORT_MODE = constants.SORT_MODE;

function Account(props) {
  const { classes } = props;
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();

  const [isWaiting, setIsWaiting] = useState(false);
  const [sortMode, setSortMode] = useState(SORT_MODE.TIME_NEW2OLD);
  const [eventList, setEventList] = useState([]);
  const [renderList, setRenderList] = useState([]);
  const [timeFromNow, setTimeFromNow] = useState(true);
  const [balance, setBalance] = useState(0);
  const [anchorEl2, setAnchorEl2] = useState(null);

  const getAllEvent = async () => {
    if (!currentUser || !currentUser.username) return
    setIsWaiting(true);
    try {
      const result = await agent.Event.getAllEvent(currentUser.username);
      if (result.data.success) {
        setEventList(result.data.data.events);
        setBalance(result.data.data.balance);
      }
      setIsWaiting(false);
    } catch (e) {
      setIsWaiting(false);
      alert(e);
    }
  }

  const handleSort = (sortMode) => {
    setAnchorEl2(null);
    setSortMode(sortMode);
  }

  useEffect(() => {
    getAllEvent();
  }, [])

  // handle sort mode
  useEffect(() => {
    if (!eventList) return;
    let sortedList = [...eventList];
    switch (sortMode) {
      case SORT_MODE.TIME_NEW2OLD:
        sortedList.sort(function (a, b) {
          return new Date(b.time) - new Date(a.time);
        })
        break;
      case SORT_MODE.TIME_OLD2NEW:
        sortedList.sort(function (a, b) {
          return new Date(a.time) - new Date(b.time);
        })
        break;
      case SORT_MODE.AMOUNT_H2L:
        sortedList.sort(function (a, b) {
          return b.amount - a.amount;
        })
        break;
      case SORT_MODE.AMOUNT_L2H:
        sortedList.sort(function (a, b) {
          return a.amount - b.amount;
        })
        break;
      default:
        sortedList.sort(function (a, b) {
          return new Date(b.time) - new Date(a.time);
        })
    }
    setRenderList(sortedList);
  }, [eventList, sortMode])

  return (
    <>
      <Grid container spacing={3} className={classes.paper}>
        <Grid item xs>
          <Paper className={classes.paper} color="primary">
            <Typography align="center" className={classes.typography}>個人資料</Typography>
            <Divider className={classes.divider} />
            <>
              <Box p={3}>
                <Box style={{ display: 'flex' }}>
                  <Typography>使用者：{currentUser.username}</Typography>
                </Box>
                <Box style={{ display: 'flex' }}>
                  <Typography>合計：</Typography>
                  <Typography className={(balance < 0) ? classes.red : classes.green}>
                    {(balance < 0) ? balance : `+${balance}`}
                  </Typography>
                </Box>
              </Box>
            </>
          </Paper>
        </Grid>
      </Grid>

      {/* history */}
      <Grid container spacing={3} className={classes.paper}>
        <Grid item xs>
          <Paper className={classes.paper} color="primary">
            <Typography align="center" className={classes.typography}>歷史紀錄</Typography>
            <Divider className={classes.divider} />
            <>
              <Box mx={2} mt={1} align='right'>
                <IconButton onClick={(e) => setAnchorEl2(e.currentTarget)}>
                  <SortByAlphaIcon />
                </IconButton>
                <IconButton onClick={() => setTimeFromNow(!timeFromNow)}>
                  <AccessTimeIcon />
                </IconButton>
                <IconButton onClick={() => history.push('/home')}>
                  <HomeIcon />
                </IconButton>
              </Box>

              <Table>
                <colgroup>
                  <col width="15%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="25%" />
                  <col width="20%" />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">對象</TableCell>
                    <TableCell align="center">類型</TableCell>
                    <TableCell align="center">敘述</TableCell>
                    <TableCell align="center">金額</TableCell>
                    <TableCell align="center">時間</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderList.map((event, id) => (
                    <TableRow key={id}>
                      <TableCell align="center">
                        <User user={event.friend} onClick={() => history.push(`/friend/${event.friend}`)} />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          color={EVENT_TYPE[event.type].color}
                          label={EVENT_TYPE[event.type].label}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">{event.description}</TableCell>
                      <TableCell align="center" className={(event.amount < 0) ? classes.red : classes.green}>
                        {(event.amount < 0) ? event.amount : `+${event.amount}`}
                      </TableCell>
                      <TableCell align="center">
                        {timeFromNow ?
                          timeAgo.format(new Date(event.time)) :
                          dayjs(event.time).format('YYYY/MM/DD HH:mm')
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          </Paper>
        </Grid>
      </Grid>
      <Menu
        id="sort-list-menu"
        anchorEl={anchorEl2}
        open={Boolean(anchorEl2)}
        onClose={() => setAnchorEl2(null)}
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
        <MenuItem onClick={() => handleSort(SORT_MODE.TIME_NEW2OLD)}>時間最新(預設)</MenuItem>
        <MenuItem onClick={() => handleSort(SORT_MODE.TIME_OLD2NEW)}>時間最早</MenuItem>
        <MenuItem onClick={() => handleSort(SORT_MODE.AMOUNT_L2H)}>金額由小到大</MenuItem>
        <MenuItem onClick={() => handleSort(SORT_MODE.AMOUNT_H2L)}>金額由大到小</MenuItem>
      </Menu>
      <Backdrop className={classes.backdrop} open={isWaiting}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

Account.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Account);