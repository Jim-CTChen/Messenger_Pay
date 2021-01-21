import { React, useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import TimeAgo from 'javascript-time-ago'
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import FilterListIcon from '@material-ui/icons/FilterList';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
// Dialog
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import MyPieChart from '../usage/MyPieChart';
import User from '../usage/User';
import { AuthContext } from '../../AuthContext';
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
  },
  blockPaper: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  divider: {
    backgroundColor: '#e4e4e4',
    height: '2px'
  },
  listItem: {
    margin: '3px',
    display: 'flex'
  },
  red: {
    color: 'red'
  },
  green: {
    color: 'green'
  },
});

const SORT_MODE = constants.SORT_MODE;
const FILTER_MODE = constants.FILTER_MODE;

const TAB_VALUE = [
  { key: 0, label: '歷史紀錄' },
  { key: 1, label: '統計' }
]

function Group(props) {
  const { classes } = props;
  const { currentUser } = useContext(AuthContext);
  const { groupName, id } = useParams();
  const history = useHistory();

  const [isWaiting, setIsWaiting] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [eventList, setEventList] = useState([]);
  const [sum, setSum] = useState(0);

  // memberList
  const [memberList, setMemberList] = useState([]);
  const [groupMemberOpen, setGroupMemberOpen] = useState(false);
  const [memberBalanceForUser, setMemberBalanceForUser] = useState([])

  // table
  const [sortMode, setSortMode] = useState(SORT_MODE.TIME_NEW2OLD);
  const [filterMode, setFilterMode] = useState(FILTER_MODE.ALL);
  const [filteredList, setFilteredList] = useState([]);
  const [renderList, setRenderList] = useState([]);
  const [timeFromNow, setTimeFromNow] = useState(true);

  // dialog
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [creditor, setCreditor] = useState('');
  const [debtor, setDebtor] = useState('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editAmount, setEditAmount] = useState('');
  const [editComment, setEditComment] = useState('');

  const [openPayBackDialog, setOpenPayBackDialog] = useState(false);
  const [payBackAmount, setPayBackAmount] = useState(0);
  const [payBackComment, setPayBackComment] = useState('');
  const [currentCreditor, setCurrentCreditor] = useState('');
  const [currentDebtor, setCurrentDebtor] = useState('');
  const [currentEventId, setCurrentEventId] = useState('');

  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [addUser, setAddUser] = useState('');

  const [openRemoveUserDialog, setOpenRemoveUserDialog] = useState(false);
  const [removeUser, setRemoveUser] = useState('');

  // chart
  const [timeChartData, setTimeChartData] = useState([]);
  const [amountChartData, setAmountChartData] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [anchorEl3, setAnchorEl3] = useState(null);
  const [snackbarProp, setSnackbarProp] = useState({
    open: false,
    message: '',
    status: 'null'
  });

  const getGroupInfo = async () => {
    if (!currentUser.username) return
    setIsWaiting(true);
    try {
      const result = await agent.Group.getGroupEvent(currentUser.username, id);
      if (!result.data.success) {
        alert(result.data.error);
        history.push('/home');
      }
      else {
        setMemberList(result.data.data.users)
        setEventList(result.data.data.events)
      }
      setIsWaiting(false);
    } catch (error) {
      setIsWaiting(false);
      alert(error);
    }
  }

  const handleAddUser = async () => {
    const users = addUser.split(' ')
    const payload = {
      groupId: id,
      usernames: users
    }
    setIsWaiting(true);
    try {
      const result = await agent.Group.addUser(payload);
      if (!result.data.success) {
        setSnackbarProp({
          open: true,
          message: result.data.error,
          status: 'error'
        })
      }
      else {
        setOpenAddUserDialog(false);
        setAddUser('');
        getGroupInfo();
        if (result.data.error) {
          setSnackbarProp({
            open: true,
            message: result.data.error,
            status: 'info'
          })
        }
        else {
          setSnackbarProp({
            open: true,
            message: '成員新增成功',
            status: 'success'
          })
        }
      }
      setIsWaiting(false);
    } catch (error) {
      setOpenAddUserDialog(false);
      setAddUser('');
      setIsWaiting(false);
      alert(error)
    }
  }

  const handleRemoveUser = async () => {
    const payload = {
      groupId: id,
      usernames: removeUser
    }
    setIsWaiting(true);
    try {
      const result = await agent.Group.removeUser(payload);
      if (!result.data.success) {
        setSnackbarProp({
          open: true,
          message: result.data.error,
          status: 'error'
        })
      }
      else {
        setOpenRemoveUserDialog(false)
        setRemoveUser('')
        if (removeUser === currentUser.username) {
          history.replace('/home')
        }
        else {
          getGroupInfo();
          setSnackbarProp({
            open: true,
            message: '成員移除成功',
            status: 'success'
          })
        }
      }
      setIsWaiting(false);
    } catch (error) {
      alert(error);
      setIsWaiting(false);
    }
  }

  const handleGroupSubmit = async () => {
    const payload = {
      creditor: creditor,
      debtor: debtor,
      amount: Number(amount),
      description: comment,
      type: 'GROUP',
      groupId: id
    }
    setIsWaiting(true);
    try {
      const result = await agent.Event.createEvent(payload);
      if (!result.data.success) {
        setSnackbarProp({
          open: true,
          message: result.data.error,
          status: 'error'
        })
      }
      else {
        setOpenNewDialog(false);
        setCreditor('');
        setDebtor('');
        setAmount('');
        setComment('');
        getGroupInfo();
        setSnackbarProp({
          open: true,
          message: '交易新增成功',
          status: 'success'
        })
      }
      setIsWaiting(false);
    } catch (error) {
      setIsWaiting(false);
      setOpenNewDialog(false);
      setCreditor('');
      setDebtor('');
      setAmount('');
      setComment('');
      alert(error)
    }
  };

  const handleEditSubmit = async () => {
    const payload = {
      username: currentUser.username,
      eventId: currentEventId,
      amount: Number(editAmount),
      description: editComment,
      type: 'GROUP',
    }
    setIsWaiting(true);
    try {
      const result = await agent.Event.updateEvent(payload);
      if (!result.data.success) {
        setSnackbarProp({
          open: true,
          message: result.data.error,
          status: 'error'
        })
      }
      else {
        setOpenEditDialog(false);
        setEditAmount('');
        setEditComment('');
        getGroupInfo();
        setSnackbarProp({
          open: true,
          message: '交易編輯成功',
          status: 'success'
        })
      }
      setIsWaiting(false);
    } catch (error) {
      setIsWaiting(false);
      setOpenEditDialog(false);
      setEditAmount('');
      setEditComment('');
      alert(error)
    }
  };

  const handlePayBackSubmit = async () => {
    const payload = {
      creditor: currentDebtor,
      debtor: currentCreditor,
      amount: Number(payBackAmount),
      description: payBackComment,
      type: 'GROUP',
      groupId: id
    }
    setIsWaiting(true);
    try {
      const result = await agent.Event.createEvent(payload);
      if (!result.data.success) {
        setSnackbarProp({
          open: true,
          message: result.data.error,
          status: 'error'
        })
      }
      else {
        setOpenPayBackDialog(false);
        setPayBackAmount(0);
        setPayBackComment('');
        getGroupInfo();
        setSnackbarProp({
          open: true,
          message: '交易新增成功',
          status: 'success'
        })
      }
      setIsWaiting(false);
    } catch (error) {
      setIsWaiting(false);
      setOpenPayBackDialog(false);
      setPayBackAmount(0);
      setPayBackComment('');
      alert(error)
    }
  };

  const handleSort = (sortMode) => {
    setAnchorEl2(null)
    setSortMode(sortMode);
  }

  const handleFilter = (filterMode) => {
    setAnchorEl3(null);
    setFilterMode(filterMode);
  }

  const handleEventMoreActionClick = (e, id, creditor, debtor, amount, comment) => {
    setAnchorEl(e.currentTarget)
    setCurrentEventId(id)
    setCurrentCreditor(creditor)
    setCurrentDebtor(debtor)
    setEditAmount(Number(amount))
    setEditComment(comment)
    setPayBackAmount(Number(amount))
    setPayBackComment(`${debtor}還錢：${comment}`)
  }

  const handleEditClick = () => {
    setAnchorEl(null)
    setOpenEditDialog(true);
  }

  const handlePayBackClick = () => {
    setAnchorEl(null)
    setOpenPayBackDialog(true);
  }

  // handle filter mode
  useEffect(() => {
    if (!eventList) return
    let newList = [];
    switch (filterMode) {
      case FILTER_MODE.ALL:
        newList = eventList;
        break;
      case FILTER_MODE.CREDITOR:
        newList = eventList.filter(event => event.creditor === currentUser.username);
        break;
      case FILTER_MODE.DEBTOR:
        newList = eventList.filter(event => event.debtor === currentUser.username);
        break;
      default:
        newList = eventList;
    }
    setFilteredList(newList);

  }, [eventList, filterMode])

  // handle sort mode
  useEffect(() => {
    let sortedList = [...filteredList];
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
          return b.amount - a.amount
        })
        break;
      case SORT_MODE.AMOUNT_L2H:
        sortedList.sort(function (a, b) {
          return a.amount - b.amount
        })
        break;
      default:
        sortedList.sort(function (a, b) {
          return new Date(b.time) - new Date(a.time);
        })
    }
    setRenderList(sortedList)
  }, [filteredList, sortMode])

  useEffect(() => {
    getGroupInfo();
  }, [])

  // calculate balance
  useEffect(() => {
    if (eventList.length === 0) return
    let total = 0
    let balanceListForUser = [];
    for (let i = 0; i < memberList.length; i += 1) {
      balanceListForUser.push(0);
    }
    eventList.forEach(event => {
      let creditorIdx = memberList.findIndex(member => event.creditor === member);
      let debtorIdx = memberList.findIndex(member => event.debtor === member);
      if (event.creditor === currentUser.username) {
        balanceListForUser[debtorIdx] += event.amount;
        total += event.amount;
      }
      else if (event.debtor === currentUser.username) {
        balanceListForUser[creditorIdx] -= event.amount;
        total -= event.amount;
      }
    })
    setSum(total)
    setMemberBalanceForUser(balanceListForUser);
  }, [eventList])

  // parse chart data
  useEffect(() => {
    if (!eventList) return;
    const newData = [...eventList, { time: new Date().toISOString() }]
    const userTimeData = {};
    const userAmountData = {};
    const userLastDate = {};
    const balance = {};
    memberList.forEach(member => {
      userTimeData[`${member}`] = 0;
      userAmountData[`${member}`] = 0;
      balance[`${member}`] = 0;
      userLastDate[`${member}`] = 0;
    })
    newData.forEach((ele, idx) => {
      if (ele.amount) {
        balance[`${ele.creditor}`] += ele.amount;
        balance[`${ele.debtor}`] -= ele.amount;
        // amount chart data
        if (balance[`${ele.debtor}`] < 0 && userAmountData[`${ele.debtor}`] < -balance[`${ele.debtor}`]) {
          userAmountData[`${ele.debtor}`] = -balance[`${ele.debtor}`];
        }

        // time chart data
        if (balance[`${ele.creditor}`] > 0) {
          if (userLastDate[`${ele.creditor}`] !== 0) {
            userTimeData[`${ele.creditor}`] += new Date(ele.time) - userLastDate[`${ele.creditor}`];
            userLastDate[`${ele.creditor}`] = 0;
          }
        }
        else if (balance[`${ele.creditor}`] < 0) {
          if (userLastDate[`${ele.creditor}`] === 0) {
            userLastDate[`${ele.creditor}`] = new Date(ele.time);
          }
        }
        if (balance[`${ele.debtor}`] > 0) {
          if (userLastDate[`${ele.debtor}`] !== 0) {
            userTimeData[`${ele.debtor}`] += new Date(ele.time) - userLastDate[`${ele.debtor}`];
            userLastDate[`${ele.debtor}`] = 0;
          }
        }
        else if (balance[`${ele.debtor}`] < 0) {
          if (userLastDate[`${ele.debtor}`] === 0) {
            userLastDate[`${ele.debtor}`] = new Date(ele.time);
          }
        }
      }
      else {
        memberList.forEach(member => {
          if (userLastDate[`${member}`] !== 0) {
            userTimeData[`${member}`] += new Date(ele.time) - userLastDate[`${member}`];
          }
        })
      }
    })

    // amount chart data
    const finalAmountData = [];

    for (const [key, value] of Object.entries(userAmountData)) {
      if (value !== 0) {
        finalAmountData.push({
          title: key,
          value: value,
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
      {/* group name & total */}
      <Grid container spacing={3} className={classes.paper}>
        <Grid item xs>
          <Paper className={classes.blockPaper} color="primary">
            <Box mx={2} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box style={{ display: 'flex' }}>
                <User user={groupName} />
              </Box>
              <Typography >
                {`合計：${(sum < 0) ? '' : '+'}${sum}`}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* group member list */}
      <Grid container spacing={3} className={classes.paper}>
        <Grid item xs>
          <Paper className={classes.blockPaper} color="primary">
            <ListItem button onClick={() => setGroupMemberOpen(!groupMemberOpen)}>
              <ListItemText primary="群組成員" />
              {groupMemberOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={groupMemberOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Box mx={2} mt={1} align='right'>
                  <IconButton onClick={() => setOpenAddUserDialog(true)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton onClick={() => setOpenRemoveUserDialog(true)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
                {memberList.map((user, idx) => (
                  <ListItem className={classes.listItem} key={idx}>
                    <User user={user} onClick={() => {
                      if (user === currentUser.username) history.push('/account');
                      else history.push(`/friend/${user}`);
                    }} />
                    <ListItemSecondaryAction>
                      {
                        (user === currentUser.username |
                          !eventList.length |
                          Number(memberBalanceForUser[idx]) === 0
                        ) ? <></> :
                          <ListItemText
                            primary={
                              memberBalanceForUser[idx] > 0 ?
                                `+${memberBalanceForUser[idx]}` :
                                `${memberBalanceForUser[idx]}`
                            }
                            className={
                              memberBalanceForUser[idx] > 0 ?
                                classes.green : classes.red
                            }
                          />
                        // <Button
                        //   variant="outlined"
                        //   size="medium"
                        //   startIcon={<AttachMoneyIcon />}
                        //   onClick={handleAddUser}
                        // >
                        //   {`${memberBalanceForUser[idx]}`}
                        // </Button>
                        // <IconButton
                        //   edge="end"
                        //   onClick={handleAddUser}
                        // >
                        //   <ListItemText primary={`${memberBalanceForUser[idx]}`} />
                        //   <AttachMoneyIcon />
                        // </IconButton> 
                      }
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Collapse>
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
                    <IconButton onClick={(e) => setAnchorEl3(e.currentTarget)}>
                      <FilterListIcon />
                    </IconButton>
                    <IconButton onClick={(e) => setAnchorEl2(e.currentTarget)}>
                      <SortByAlphaIcon />
                    </IconButton>
                    <IconButton onClick={() => setTimeFromNow(!timeFromNow)}>
                      <AccessTimeIcon />
                    </IconButton>
                    <IconButton onClick={() => setOpenNewDialog(true)}>
                      <AddIcon />
                    </IconButton>
                    <IconButton onClick={() => history.push('/home')}>
                      <HomeIcon />
                    </IconButton>
                  </Box>

                  <Table>
                    <colgroup>
                      <col width="15%" />
                      <col width="15%" />
                      <col width="25%" />
                      <col width="20%" />
                      <col width="20%" />
                      <col width="5%" />
                    </colgroup>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">債權人</TableCell>
                        <TableCell align="center">債務人</TableCell>
                        <TableCell align="center">敘述</TableCell>
                        <TableCell align="center">金額</TableCell>
                        <TableCell align="center">時間</TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {renderList.map((event, id) => (
                        <TableRow key={id}>
                          <TableCell align="center">
                            <User user={event.creditor} onClick={() => {
                              if (event.creditor === currentUser.username) history.push('/account');
                              else history.push(`/friend/${event.creditor}`);
                            }} />
                          </TableCell>
                          <TableCell align="center">
                            <User user={event.debtor} onClick={() => {
                              if (event.debtor === currentUser.username) history.push('/account');
                              else history.push(`/friend/${event.debtor}`);
                            }} />
                          </TableCell>
                          <TableCell align="center">{event.description}</TableCell>
                          <TableCell align="center" className={classes.green}>
                            {event.amount}
                          </TableCell>
                          <TableCell align="center">
                            {timeFromNow ?
                              timeAgo.format(new Date(event.time)) :
                              dayjs(event.time).format('YYYY/MM/DD HH:mm')
                            }
                          </TableCell>
                          <TableCell align="center">
                            {(currentUser.username === event.creditor |
                              currentUser.username === event.debtor) ?
                              <IconButton onClick={e =>
                                handleEventMoreActionClick(e, event.id, event.creditor, event.debtor, event.amount, event.description)}
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
        <MenuItem onClick={() => handleSort(SORT_MODE.TIME_NEW2OLD)}>時間最新(預設)</MenuItem>
        <MenuItem onClick={() => handleSort(SORT_MODE.TIME_OLD2NEW)}>時間最早</MenuItem>
        <MenuItem onClick={() => handleSort(SORT_MODE.AMOUNT_L2H)}>金額由小到大</MenuItem>
        <MenuItem onClick={() => handleSort(SORT_MODE.AMOUNT_H2L)}>金額由大到小</MenuItem>
      </Menu>

      {/* filter list menu */}
      <Menu
        id="filter-list-menu"
        anchorEl={anchorEl3}
        open={Boolean(anchorEl3)}
        onClose={() => setAnchorEl3(null)}
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
        <MenuItem onClick={() => handleFilter(FILTER_MODE.ALL)}>顯示全部(預設)</MenuItem>
        <MenuItem onClick={() => handleFilter(FILTER_MODE.CREDITOR)}>顯示待收交易</MenuItem>
        <MenuItem onClick={() => handleFilter(FILTER_MODE.DEBTOR)}>顯示待還交易</MenuItem>
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
        <MenuItem onClick={handlePayBackClick}>{currentDebtor === currentUser.username ? "還錢" : "收錢"}</MenuItem>
      </Menu>

      {/* new event dialog */}
      <Dialog
        open={openNewDialog}
        onClose={() => setOpenNewDialog(false)}
        maxWidth="md"
      >
        <DialogTitle>新增交易</DialogTitle>
        <DialogContent>
          <TextField
            required
            select
            margin="dense"
            label="債權人"
            fullWidth
            value={creditor}
            onChange={e => setCreditor(e.target.value)}
          >
            {memberList && memberList.map(member =>
              <MenuItem value={member} key={member}>
                {member}
              </MenuItem>
            )}
          </TextField>
        </DialogContent>
        <DialogContent>
          <TextField
            required
            select
            margin="dense"
            label="債務人"
            fullWidth
            error={debtor !== '' && creditor === debtor}
            helperText={debtor !== '' && creditor === debtor && '債務人不可與債權人相同'}
            value={debtor}
            onChange={e => setDebtor(e.target.value)}
          >
            {memberList && memberList.map(member =>
              <MenuItem value={member} key={member}>
                {member}
              </MenuItem>
            )}
          </TextField>
        </DialogContent>
        <DialogContent>
          <TextField
            required
            margin="dense"
            label="金額"
            placeholder="請填入非負數字"
            value={amount}
            error={isNaN(amount) || amount < 0}
            onChange={e => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            required
            margin="dense"
            label="備註"
            value={comment}
            fullWidth
            onChange={e => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewDialog(false)} color="primary">
            取消
          </Button>
          <Button
            disabled={
              creditor === '' ||
              debtor === '' ||
              isNaN(amount) ||
              amount === '' ||
              amount < 0 ||
              creditor === debtor ||
              !comment
            }
            onClick={handleGroupSubmit} color="primary"
          >
            確認
          </Button>
        </DialogActions>
      </Dialog>

      {/* add member to group */}
      <Dialog
        open={openAddUserDialog}
        onClose={() => setOpenAddUserDialog(false)}
        maxWidth="md"
      >
        <DialogTitle>新增成員</DialogTitle>
        <DialogContent>
          <TextField
            required
            label="新增成員"
            fullWidth
            placeholder="請以空白區隔"
            value={addUser}
            onChange={e => setAddUser(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddUserDialog(false)} color="primary">
            取消
          </Button>
          <Button
            disabled={addUser === ""}
            onClick={handleAddUser}
            color="primary"
          >
            確認
          </Button>
        </DialogActions>
      </Dialog>

      {/* remove member from group */}
      <Dialog
        open={openRemoveUserDialog}
        onClose={() => setOpenRemoveUserDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>移除成員</DialogTitle>
        <DialogContent>
          <TextField
            required
            select
            margin="dense"
            label="移除成員"
            fullWidth
            value={removeUser}
            onChange={e => setRemoveUser(e.target.value)}
          >
            {memberList && memberList.map(member =>
              <MenuItem value={member} key={member}>
                {member}
              </MenuItem>
            )}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenRemoveUserDialog(false)} color="primary">
            取消
          </Button>
          <Button
            disabled={removeUser === ""}
            onClick={handleRemoveUser}
            color="primary"
          >
            確認
          </Button>
        </DialogActions>
      </Dialog>

      {/* edit event dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
      >
        <DialogTitle>編輯交易</DialogTitle>
        <DialogContent>
          <Typography>{`${currentDebtor}欠${currentCreditor}`}</Typography>
          <TextField
            required
            margin="dense"
            label="金額"
            placeholder="請填入非負數字"
            value={editAmount}
            error={isNaN(editAmount) || editAmount < 0}
            onChange={e => setEditAmount(e.target.value)}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            required
            margin="dense"
            label="備註"
            value={editComment}
            fullWidth
            onChange={e => setEditComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            取消
        </Button>
          <Button
            disabled={
              isNaN(editAmount) ||
              editAmount === '' ||
              editAmount < 0 ||
              !editComment
            }
            onClick={handleEditSubmit} color="primary"
          >
            確認
        </Button>
        </DialogActions>
      </Dialog>

      {/* pay back event dialog */}
      <Dialog
        open={openPayBackDialog}
        onClose={() => setOpenPayBackDialog(false)}
        maxWidth="md"
      >
        <DialogTitle>{currentDebtor === currentUser.username ? `${currentDebtor}還給${currentCreditor}` : `${currentCreditor}向${currentDebtor}收取`}</DialogTitle>
        <DialogContent>
          <TextField
            required
            margin="dense"
            label="金額"
            placeholder="請填入非負數字"
            value={payBackAmount}
            error={isNaN(payBackAmount) || payBackAmount < 0}
            onChange={e => setPayBackAmount(e.target.value)}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            required
            margin="dense"
            label="備註"
            value={payBackComment}
            fullWidth
            onChange={e => setPayBackComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPayBackDialog(false)} color="primary">
            取消
        </Button>
          <Button
            disabled={
              isNaN(payBackAmount) ||
              payBackAmount === '' ||
              payBackAmount < 0 ||
              !payBackComment
            }
            onClick={handlePayBackSubmit} color="primary"
          >
            確認
        </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarProp.open}
        autoHideDuration={2000}
        onClose={() => setSnackbarProp({ ...snackbarProp, open: false })}>
        <Alert severity={snackbarProp.status}>
          {snackbarProp.message}
        </Alert>
      </Snackbar>
      <Backdrop className={classes.backdrop} open={isWaiting}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

Group.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Group);