import { React, useState, useEffect, useContext } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import TimeAgo from 'javascript-time-ago'
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { Icon, useEventCallback } from '@material-ui/core';
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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import MyPieChart from './usage/MyPieChart';
import User from './usage/User';
import { AuthContext } from '../AuthContext'
import agent from '../agent'

const timeAgo = new TimeAgo()

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

const TAB_VALUE = [
  { key: 0, label: '歷史紀錄' },
  { key: 1, label: '統計' }
]

function Group(props) {
  const { classes } = props;

  const [tabValue, setTabValue] = useState(0);
  const [memberList, setMemberList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [memberBalance, setMemberBalance] = useState([])
  const [memberBalanceForUser, setMemberBalanceForUser] = useState([])
  const [timeFromNow, setTimeFromNow] = useState(false);
  const [sum, setSum] = useState(0);
  const [groupMemberOpen, setGroupMemberOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPayBackDialog, setOpenPayBackDialog] = useState(false);
  const [creditor, setCreditor] = useState('');
  const [debtor, setDebtor] = useState('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [addUser, setAddUser] = useState('');
  const [openRemoveUserDialog, setOpenRemoveUserDialog] = useState(false);
  const [removeUser, setRemoveUser] = useState('');
  const [timeChartData, setTimeChartData] = useState([]);
  const [amountChartData, setAmountChartData] = useState([]);
  const [editAmount, setEditAmount] = useState('');
  const [editComment, setEditComment] = useState('');
  const [payBackAmount, setPayBackAmount] = useState(0);
  const [payBackComment, setPayBackComment] = useState('');
  const [currentCreditor, setCurrentCreditor] = useState('');
  const [currentDebtor, setCurrentDebtor] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentEventId, setCurrentEventId] = useState('');

  const history = useHistory();
  const { currentUser } = useContext(AuthContext);
  const { groupName, id } = useParams();

  const handleClick = () => {
    setGroupMemberOpen(!groupMemberOpen);
  };

  const handleClose = () => {
    setOpenDialog(false)
  };

  const handleGroupSubmit = async () => {
    const payload = {
      creditor: creditor,
      debtor: debtor,
      amount: Number(amount),
      description: comment,
      type: 'GROUP',
      groupId: id
    }
    try {
      const result = await agent.Event.createEvent(payload);
      if (!result.data.success) {
        alert(result.data.error);
      }
      else {
        setOpenDialog(false);
        setCreditor('');
        setDebtor('');
        setAmount('');
        setComment('');
        getGroupInfo();
      }
    } catch (error) {
      setOpenDialog(false);
      setCreditor('');
      setDebtor('');
      setAmount('');
      setComment('');
      alert(error)
    }
  };

  const handleAddUserClose = () => {
    setOpenAddUserDialog(false)
  };

  const handleAddUser = async () => {
    const users = addUser.split(' ')
    const payload = {
      groupId: id,
      usernames: users
    }
    try {
      const result = await agent.Group.addUser(payload);
      if (!result.data.success) {
        alert(result.data.error);
      }
      else {
        setOpenAddUserDialog(false);
        setAddUser('')
        getGroupInfo();
      }
    } catch (error) {
      setOpenAddUserDialog(false);
      setAddUser('')
      alert(error)
    }
  }

  const handleRemoveUserClose = () => {
    setOpenRemoveUserDialog(false)
  };

  const handleRemoveUser = async () => {
    const payload = {
      groupId: id,
      usernames: removeUser
    }
    try {
      const result = await agent.Group.removeUser(payload);
      if (!result.data.success) {
        alert(result.data.error);
      }
      else {
        setOpenRemoveUserDialog(false)
        setRemoveUser('')
        if (removeUser === currentUser.username) {
          history.replace('/home')
        }
        else {
          getGroupInfo();
        }
      }
    } catch (error) {
      alert(error)
    }
  }

  const getGroupInfo = async () => {
    if (!currentUser.username) return
    try {
      const result = await agent.Group.getGroupEvent(currentUser.username, id);
      if (!result.data.success) {
        alert(result.data.error);
        history.push('/home')
      }
      else {
        setMemberList(result.data.data.users)
        setEventList(result.data.data.events)
      }
    } catch (error) {
      alert(error);
    }
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

  const handleEditClose = () => {
    setOpenEditDialog(false)
  };

  const handleEditSubmit = async () => {
    const payload = {
      username: currentUser.username,
      eventId: currentEventId,
      amount: Number(editAmount),
      description: editComment,
      type: 'GROUP',
    }
    try {
      const result = await agent.Event.updateEvent(payload);
      if (!result.data.success) {
        alert(result.data.error);
      }
      else {
        setOpenEditDialog(false);
        setEditAmount('');
        setEditComment('');
        getGroupInfo();
      }
    } catch (error) {
      setOpenEditDialog(false);
      setEditAmount('');
      setEditComment('');
      alert(error)
    }
  };

  const handlePayBackClick = () => {
    setAnchorEl(null)
    setOpenPayBackDialog(true);
  }

  const handlePayBackClose = () => {
    setOpenPayBackDialog(false)
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
    try {
      const result = await agent.Event.createEvent(payload);
      if (!result.data.success) {
        alert(result.data.error);
      }
      else {
        setOpenPayBackDialog(false);
        setPayBackAmount(0);
        setPayBackComment('');
        getGroupInfo();
      }
    } catch (error) {
      setOpenPayBackDialog(false);
      setPayBackAmount(0);
      setPayBackComment('');
      alert(error)
    }
  };

  useEffect(() => {
    getGroupInfo();
  }, [])

  useEffect(() => {
    if (eventList.length === 0) return
    let total = 0
    let balanceList = [];
    let balanceListForUser = [];
    for (let i = 0; i < memberList.length; i += 1) {
      balanceList.push(0);
      balanceListForUser.push(0);
    }
    eventList.forEach(event => {
      let creditorIdx = memberList.findIndex(member => event.creditor === member);
      let debtorIdx = memberList.findIndex(member => event.debtor === member);
      balanceList[creditorIdx] += event.amount;
      balanceList[debtorIdx] -= event.amount;
      if (event.creditor === currentUser.username) {
        balanceListForUser[debtorIdx] += event.amount
        total += event.amount
      }
      else if (event.debtor === currentUser.username) {
        balanceListForUser[creditorIdx] -= event.amount
        total -= event.amount
      }
    })
    setSum(total)
    setMemberBalance(balanceList);
    setMemberBalanceForUser(balanceListForUser);
  }, [eventList])

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
    console.log('time', userTimeData)
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
            <ListItem button onClick={handleClick}>
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
                  <ListItem className={classes.listItem}>
                    <User user={user} />
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
                    <IconButton onClick={() => setTimeFromNow(!timeFromNow)}>
                      <AccessTimeIcon />
                    </IconButton>
                    <IconButton onClick={() => setOpenDialog(true)}>
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
                      {eventList.map((event, id) => (
                        <TableRow key={id}>
                          <TableCell align="center">
                            <User user={event.creditor} onClick={() => {
                              if (event.creditor == currentUser.username) history.push('/account');
                              else history.push(`/friend/${event.creditor}`);
                            }} />
                          </TableCell>
                          <TableCell align="center">
                            <User user={event.debtor} onClick={() => {
                              if (event.debtor == currentUser.username) history.push('/account');
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
        open={openDialog}
        onClose={handleClose}
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
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button
            disabled={
              creditor === '' ||
              debtor === '' ||
              isNaN(amount) ||
              amount === '' ||
              amount < 0 ||
              creditor === debtor
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
        onClose={handleAddUserClose}
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
          <Button onClick={handleAddUserClose} color="primary">
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
        onClose={handleRemoveUserClose}
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
          <Button onClick={handleRemoveUserClose} color="primary">
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
        onClose={handleEditClose}
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
          <Button onClick={handleEditClose} color="primary">
            取消
        </Button>
          <Button
            disabled={isNaN(editAmount) | editAmount === '' | editAmount < 0}
            onClick={handleEditSubmit} color="primary"
          >
            確認
        </Button>
        </DialogActions>
      </Dialog>

      {/* pay back event dialog */}
      <Dialog
        open={openPayBackDialog}
        onClose={handlePayBackClose}
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
          <Button onClick={handlePayBackClose} color="primary">
            取消
        </Button>
          <Button
            disabled={isNaN(payBackAmount) | payBackAmount === '' | payBackAmount < 0}
            onClick={handlePayBackSubmit} color="primary"
          >
            確認
        </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

Group.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Group);