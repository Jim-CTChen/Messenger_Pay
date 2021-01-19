import { React, useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import TimeAgo from 'javascript-time-ago'
import zh from 'javascript-time-ago/locale/zh-Hant'
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { Icon } from '@material-ui/core';
// Dialog
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Grid from '@material-ui/core/Grid';

import MyPieChart from './usage/MyPieChart';
import User from './usage/User';
import { AuthContext } from '../AuthContext'
import agent from '../agent';
import constants from '../constants/index'

TimeAgo.addDefaultLocale(zh);
const timeAgo = new TimeAgo();

const styles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
  },
  blockPaper: {
    padding: theme.spacing(2),
    textAlign: 'center',
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
  listItem: {
    margin: '3px',
    display: 'flex'
  },
  box: {
    margin: '3px'
  },
  red: {
    color: 'red'
  },
  green: {
    color: 'green'
  },
});

const sign = [
  { type: '欠我', value: false },
  { type: '我欠', value: true }
]

const EVENT_TYPE = constants.EVENT_TYPE;
const DISPLAY_MODE = constants.DISPLAY_MODE;

const TAB_VALUE = [
  { key: 0, label: '歷史紀錄' },
  { key: 1, label: '統計' }
]

function Friend(props) {
  const { classes } = props;

  const [tabValue, setTabValue] = useState(0);
  const [displayMode, setDisplayMode] = useState(DISPLAY_MODE[0]);
  const [eventList, setEventList] = useState([])
  const [sortedList, setSortedList] = useState([])

  const [timeFromNow, setTimeFromNow] = useState(false)
  const [sum, setSum] = useState(0);
  const [openFriendDialog, setOpenFriendDialog] = useState(false);
  const [openFriendEditDialog, setOpenFriendEditDialog] = useState(false);
  const [openFriendPayBackDialog, setOpenFriendPayBackDialog] = useState(false);
  const [amountSign, setAmountSign] = useState(false);
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [timeChartData, setTimeChartData] = useState([]);
  const [amountChartData, setAmountChartData] = useState([]);

  const [editSign, setEditSign] = useState(false);
  const [editAmount, setEditAmount] = useState('');
  const [editComment, setEditComment] = useState('');
  const [payBackSign, setPayBackSign] = useState(false);
  const [payBackAmount, setPayBackAmount] = useState(0);
  const [payBackComment, setPayBackComment] = useState('')

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [currentEventId, setCurrentEventId] = useState('');
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);
  const { friend } = useParams();

  const handleSort = (sortMode) => {
    setAnchorEl2(null)
    if (sortMode === DISPLAY_MODE[0]) {
      setDisplayMode(DISPLAY_MODE[0])
    }
    else if (sortMode === DISPLAY_MODE[1]) {
      setDisplayMode(DISPLAY_MODE[1])
      const sortList = eventList.concat()
      sortList.sort(function (a, b) {
        return a.amount - b.amount
      })
      setSortedList(sortList)
    }
    else if (sortMode === DISPLAY_MODE[2]) {
      setDisplayMode(DISPLAY_MODE[2])
      const sortList = eventList.concat()
      sortList.sort(function (a, b) {
        return b.amount - a.amount
      })
      setSortedList(sortList)
    }
    else if (sortMode === DISPLAY_MODE[3]) {
      setDisplayMode(DISPLAY_MODE[3])
      const sortList = eventList.concat()
      sortList.sort(function (a, b) {
        return new Date(b.time) - new Date(a.time);
      })
      setSortedList(sortList)
    }
  }

  const handleFriendClose = () => {
    setOpenFriendDialog(false)
  };

  const handleFriendSubmit = async () => {
    const payload = {
      creditor: amountSign ? friend : currentUser.username,
      debtor: amountSign ? currentUser.username : friend,
      amount: Number(amount),
      description: comment,
      type: 'PERSONAL'
    }
    try {
      const result = await agent.Event.createEvent(payload);
      if (!result.data.success) {
        alert(result.data.error);
      }
      else {
        setOpenFriendDialog(false);
        setAmount('');
        setComment('');
        getEventInfo();
      }
    } catch (error) {
      setOpenFriendDialog(false);
      setAmount('');
      setComment('');
      alert(error)
    }
  };

  const getEventInfo = async () => {
    if (!currentUser.username) return
    try {
      const result = await agent.Event.getFriendEvent(currentUser.username, friend);
      if (!result.data.success) {
        alert(result.data.error);
      }
      else {
        setEventList(result.data.data.events)
      }
    } catch (error) {
      alert(error);
    }
  }

  const handleEventMoreActionClick = (e, id, amount, comment) => {
    setAnchorEl(e.currentTarget)
    setCurrentEventId(id)
    setEditSign((Number(amount) >= 0) ? false : true)
    setEditAmount((Number(amount) >= 0) ? Number(amount) : (-1) * Number(amount))
    setEditComment(comment)
    setPayBackSign((Number(amount) >= 0) ? false : true)
    setPayBackAmount((Number(amount) >= 0) ? Number(amount) : (-1) * Number(amount))
    setPayBackComment((Number(amount) >= 0) ? `收錢：${comment}` : `還錢：${comment}`)
  }

  const handleEditClick = () => {
    setAnchorEl(null)
    setOpenFriendEditDialog(true);
  }

  const handleFriendEditClose = () => {
    setOpenFriendEditDialog(false)
  };

  const handleFriendEditSubmit = async () => {
    const payload = {
      username: currentUser.username,
      eventId: currentEventId,
      amount: Number(editAmount),
      description: editComment,
      type: 'PERSONAL',
    }
    try {
      const result = await agent.Event.updateEvent(payload);
      if (!result.data.success) {
        alert(result.data.error);
      }
      else {
        setOpenFriendEditDialog(false);
        setEditAmount('');
        setEditComment('');
        getEventInfo();
      }
    } catch (error) {
      setOpenFriendEditDialog(false);
      setEditAmount('');
      setEditComment('');
      alert(error)
    }
  };

  const handlePayBackClick = () => {
    setAnchorEl(null)
    setOpenFriendPayBackDialog(true);
  }

  const handleFriendPayBackClose = () => {
    setOpenFriendPayBackDialog(false)
  };

  const handleFriendPayBackSubmit = async () => {
    const payload = {
      creditor: payBackSign ? currentUser.username : friend,
      debtor: payBackSign ? friend : currentUser.username,
      amount: Number(payBackAmount),
      description: payBackComment,
      type: 'PERSONAL'
    }
    try {
      const result = await agent.Event.createEvent(payload);
      if (!result.data.success) {
        alert(result.data.error);
      }
      else {
        setOpenFriendPayBackDialog(false);
        setPayBackSign(false);
        setPayBackAmount(0);
        setPayBackComment('');
        getEventInfo();
      }
    } catch (error) {
      setOpenFriendPayBackDialog(false);
      setPayBackSign(false);
      setPayBackAmount(0);
      setPayBackComment('');
      alert(error)
    }
  };

  useEffect(() => {
    getEventInfo();
  }, [])

  useEffect(() => {
    if (eventList.length === 0) return
    let total = 0
    eventList.forEach(ele => {
      total += ele.amount
    })
    setSum(total)
  }, [eventList])

  useEffect(() => { // parse chart data
    if (!eventList) return;
    const username = currentUser.username;
    const newData = [...eventList, { time: new Date().toISOString() }];
    const userTimeData = {};
    const userAmountData = {};
    userTimeData[`${username}`] = 0;
    userAmountData[`${username}`] = 0;
    userTimeData[`${friend}`] = 0;
    userAmountData[`${friend}`] = 0;
    let balance = 0;
    newData.forEach((ele, idx) => {
      if (ele.amount) {
        balance += ele.amount;
        // amount chart data
        if (balance > 0) {
          if (userAmountData[`${friend}`] < balance) {
            userAmountData[`${friend}`] = balance;
          }
        }
        else if (balance < 0) {
          if (userAmountData[`${username}`] < -balance) {
            userAmountData[`${username}`] = -balance;
          }
        }

        // time chart data
        let interval = new Date(newData[idx + 1].time) - new Date(ele.time);
        if (balance > 0) {
          if (userTimeData[`${friend}`]) {
            userTimeData[`${friend}`] += interval;
          }
          else userTimeData[`${friend}`] = interval;
        }
        else if (balance < 0) {
          if (userTimeData[`${username}`]) {
            userTimeData[`${username}`] += interval;
          }
          else userTimeData[`${username}`] = interval;
        }
      }
    })
    // amount chart data
    const finalAmountData = [];

    for (const [key, value] of Object.entries(userAmountData)) {
      if (value !== 0) {
        finalAmountData.push({
          title: key,
          value: Math.round(value),
          unit: '元'
        });
      }
    }
    setAmountChartData(finalAmountData);

    // time chart data
    const finalTimeData = [];
    const dayOffset = 24 * 60 * 60 * 1000;
    const hourOffset = 60 * 60 * 1000;
    const minOffset = 60 * 1000;
    const secOffset = 1000;
    if (Object.values(userTimeData).some(value => value >= dayOffset / 2)) {
      for (const [key, value] of Object.entries(userTimeData)) {
        let roundedValue = Math.round(value / dayOffset, -1);
        if (roundedValue !== 0) {
          finalTimeData.push({
            title: key,
            value: roundedValue,
            unit: '天'
          });
        }
      }
    }
    else if (Object.values(userTimeData).some(value => value >= hourOffset / 2)) {
      for (const [key, value] of Object.entries(userTimeData)) {
        let roundedValue = Math.round(value / hourOffset, -1);
        if (roundedValue !== 0) {
          finalTimeData.push({
            title: key,
            value: roundedValue,
            unit: '小時'
          });
        }
      }
    }
    else if (Object.values(userTimeData).some(value => value >= minOffset / 2)) {
      for (const [key, value] of Object.entries(userTimeData)) {
        let roundedValue = Math.round(value / minOffset, -1);
        if (roundedValue !== 0) {
          finalTimeData.push({
            title: key,
            value: roundedValue,
            unit: '分鐘'
          });
        }
      }
    }
    else {
      for (const [key, value] of Object.entries(userTimeData)) {
        let roundedValue = Math.round(value / secOffset, -1);
        if (roundedValue !== 0) {
          finalTimeData.push({
            title: key,
            value: roundedValue,
            unit: '秒鐘'
          });
        }
      }
    }
    setTimeChartData(finalTimeData);
  }, [eventList])

  return (
    <>
      {/* friend name & total */}
      <Grid container spacing={3} className={classes.paper}>
        <Grid item xs>
          <Paper className={classes.blockPaper} color="primary">
            <Box mx={2} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <User user={friend} />
              <Box style={{ display: 'flex' }}>
                <Typography>
                  {`合計：${(sum < 0) ? '' : '+'}${sum}`}
                </Typography>&nbsp;&nbsp;
                {/* {sum !== 0 &&
                  <Button
                    size="small"
                    variant="outlined"
                    color={sum < 0 ? "secondary" : "primary"}
                    onClick={() => {
                      setComment(sum < 0 ? '還清' : '結清')
                      setAmountSign(sum >= 0);
                      setAmount(Math.abs(sum));
                      setOpenFriendDialog(true);
                    }}
                  >
                    {sum < 0 ? '還清' : '結清'}
                  </Button>
                } */}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* history & chart */}
      <Grid container spacing={3} className={classes.paper}>
        <Grid item xs>
          <Paper className={classes.paper} color="primary">
            <Tabs
              value={tabValue}
              indicatorColor="primary"
              textColor="primary"
              onChange={(e, value) => { setTabValue(value) }}
            >
              {
                TAB_VALUE.map(tab =>
                  <Tab
                    value={tab.key}
                    key={tab.key}
                    label={tab.label}
                  />)
              }
            </Tabs>
            <Divider className={classes.divider} />
            {
              tabValue === 0 ?
                <>
                  <Box mx={2} mt={1} align='right'>
                    <IconButton onClick={(e) => setAnchorEl2(e.currentTarget)}>
                      <SortByAlphaIcon />
                    </IconButton>
                    <IconButton onClick={() => setTimeFromNow(!timeFromNow)}>
                      <AccessTimeIcon />
                    </IconButton>
                    <IconButton onClick={() => setOpenFriendDialog(true)}>
                      <AddIcon />
                    </IconButton>
                    <IconButton onClick={() => history.push('/home')}>
                      <HomeIcon />
                    </IconButton>
                  </Box>

                  <Table>
                    <colgroup>
                      <col width="15%" />
                      <col width="30%" />
                      <col width="25%" />
                      <col width="25%" />
                      <col width="5%" />
                    </colgroup>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">類型</TableCell>
                        <TableCell align="center">敘述</TableCell>
                        <TableCell align="center">金額</TableCell>
                        <TableCell align="center">時間</TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      { displayMode === 'default' ? 
                        eventList.map((event, id) => (
                          <TableRow key={id}>
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
                            <TableCell align="center">
                              {
                                event.type === 'PERSONAL' ?
                                <IconButton onClick={e =>
                                  handleEventMoreActionClick(e, event.id, event.amount, event.description)}
                                >
                                  <MoreVertIcon />
                                </IconButton> : <></>
                              }
                            </TableCell>
                          </TableRow>
                        )) :
                        sortedList.map((event, id) => (
                          <TableRow key={id}>
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
                            <TableCell align="center">
                              {
                                event.type === 'PERSONAL' ?
                                <IconButton onClick={e =>
                                  handleEventMoreActionClick(e, event.id, event.amount, event.description)}
                                >
                                  <MoreVertIcon />
                                </IconButton> : <></>
                              }
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </> :
                <>
                  <Grid container>
                    <Grid item xs={6}>
                      <Box pt={3}>
                        <Typography variant="h5" align="center">欠債時間長度</Typography>
                        <MyPieChart data={timeChartData} />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box pt={3}>
                        <Typography variant="h5" align="center">最高欠債金額</Typography>
                        <MyPieChart data={amountChartData} />
                      </Box>
                    </Grid>
                  </Grid>
                </>
            }


          </Paper>
        </Grid>
      </Grid>

      {/* sort list menu */}
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
        <MenuItem onClick={() => handleSort(DISPLAY_MODE[0])}>時間最早(預設)</MenuItem>
        <MenuItem onClick={() => handleSort(DISPLAY_MODE[3])}>時間最新</MenuItem>
        <MenuItem onClick={() => handleSort(DISPLAY_MODE[1])}>金額由小到大</MenuItem>
        <MenuItem onClick={() => handleSort(DISPLAY_MODE[2])}>金額由大到小</MenuItem>
      </Menu>

      {/* history list menu */}
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
        <MenuItem onClick={handleEditClick}>編輯</MenuItem>
        <MenuItem onClick={handlePayBackClick}>{payBackSign ? "還錢" : "收錢"}</MenuItem>
      </Menu>

      {/* new event dialog */}
      <Dialog
        open={openFriendDialog}
        onClose={handleFriendClose}
        maxWidth="md"
      >
        <DialogTitle>新增交易</DialogTitle>
        <DialogContent>
          <TextField
            required
            disabled
            margin="dense"
            label="對象"
            fullWidth
            value={friend}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label="類別"
            value={amountSign}
            onChange={e => setAmountSign(e.target.value)}
          >
            {sign.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            margin="dense"
            label="金額"
            placeholder="請填入非負數字"
            value={amount}
            error={isNaN(amount) | amount < 0}
            onChange={e => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            margin="dense"
            label="備註"
            value={comment}
            fullWidth
            onChange={e => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFriendClose} color="primary">
            取消
          </Button>
          <Button
            disabled={isNaN(amount) | amount === '' | amount < 0}
            onClick={handleFriendSubmit} color="primary"
          >
            確認
          </Button>
        </DialogActions>
      </Dialog>

      {/* edit event dialog */}
      <Dialog
        open={openFriendEditDialog}
        onClose={handleFriendEditClose}
        maxWidth="md"
      >
        <DialogTitle>編輯交易</DialogTitle>
        <DialogContent>
          <Typography>{payBackSign ? `我欠${friend}` : `${friend}欠我`}</Typography>
          <TextField
            required
            margin="dense"
            label="金額"
            placeholder="請填入非負數字"
            value={editAmount}
            error={isNaN(editAmount) | editAmount < 0}
            onChange={e => setEditAmount(e.target.value)}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            margin="dense"
            label="備註"
            value={editComment}
            fullWidth
            onChange={e => setEditComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFriendEditClose} color="primary">
            取消
          </Button>
          <Button
            disabled={isNaN(editAmount) | editAmount === '' | editAmount < 0}
            onClick={handleFriendEditSubmit} color="primary"
          >
            確認
          </Button>
        </DialogActions>
      </Dialog>

      {/* pay back event dialog */}
      <Dialog
        open={openFriendPayBackDialog}
        onClose={handleFriendPayBackClose}
        maxWidth="md"
      >
        <DialogTitle>{payBackSign ? `還給${friend}` : `向${friend}收取`}</DialogTitle>
        <DialogContent>
          <TextField
            required
            margin="dense"
            label="金額"
            placeholder="請填入非負數字"
            value={payBackAmount}
            error={isNaN(payBackAmount) | payBackAmount < 0}
            onChange={e => setPayBackAmount(e.target.value)}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            margin="dense"
            label="備註"
            value={payBackComment}
            fullWidth
            onChange={e => setPayBackComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFriendPayBackClose} color="primary">
            取消
        </Button>
          <Button
            disabled={isNaN(payBackAmount) | payBackAmount === '' | payBackAmount < 0}
            onClick={handleFriendPayBackSubmit} color="primary"
          >
            確認
        </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

Friend.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Friend);