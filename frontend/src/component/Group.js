import { React, useState, useEffect, useContext } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import TimeAgo from 'javascript-time-ago'
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
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

const sign = [
  { type: '下欠上', value: false },
  { type: '上欠下', value: true }
]

const EVENT_TYPE = {
  PERSONAL: {
    label: '個人',
    color: 'primary'
  },
  GROUP: {
    label: '群組',
    color: 'secondary'
  },
}

function Group(props) {
  const { classes } = props;
  const [memberList, setMemberList] = useState([])
  const [eventList, setEventList] = useState([])
  const [timeFromNow, setTimeFromNow] = useState(false)
  const [sum, setSum] = useState(0);
  const [groupMemberOpen, setGroupMemberOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPayBackDialog, setOpenPayBackDialog] = useState(false);
  const [creditor, setCreditor] = useState('');
  const [debtor, setDebtor] = useState('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [addUser, setAddUser] = useState('');
  const [editSign, setEditSign] = useState(false);
  const [editAmount, setEditAmount] = useState('');
  const [editComment, setEditComment] = useState('');
  const [payBackSign, setPayBackSign] = useState(false);
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

  const handleBackClick = () => {
    history.goBack();
  }

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

  const handleRemoveUser = async (user) => {
    const payload = {
      groupId: id,
      usernames: user
    }
    try {
      const result = await agent.Group.removeUser(payload);
      if (!result.data.success) {
        alert(result.data.error);
      }
      else {
        if (user === currentUser.username) {
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
    if (!currentUser.username) history.push('/home')
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
    setEditSign((Number(amount) >= 0) ? false : true)
    setEditAmount((Number(amount) >= 0) ? Number(amount) : (-1)*Number(amount))
    setEditComment(comment)
    setPayBackSign((Number(amount) >= 0) ? false : true)
    setPayBackAmount((Number(amount) >= 0) ? Number(amount) : (-1)*Number(amount))
    setPayBackComment((Number(amount) >= 0) ? `收錢：${comment}` : `還錢：${comment}`)
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
      creditor: payBackSign ? currentCreditor : currentDebtor,
      debtor: payBackSign ? currentDebtor : currentCreditor,
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
        setPayBackSign(false);
        setPayBackAmount(0);
        setPayBackComment('');
        getGroupInfo();
      }
    } catch (error) {
      setOpenPayBackDialog(false);
      setPayBackSign(false);
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
    eventList.forEach(ele => {
      if (ele.creditor === currentUser.username) total += ele.amount
      else if (ele.debtor === currentUser.username) total -= ele.amount
    })
    setSum(total)
  }, [eventList])

  return (
    <>
      <Grid container spacing={3} className={classes.paper}>
        <Grid item xs>
          <Paper className={classes.blockPaper} color="primary">
            <Box mx={2} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box style={{ display: 'flex' }}>
                <Avatar>{groupName[0]}</Avatar> &nbsp;
                <Typography>{groupName}</Typography>
              </Box>
              <Typography >
                {`合計：${(sum < 0) ? '' : '+'}${sum}`}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

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
                </Box>
                {memberList.map((user, id) => (
                  <ListItem className={classes.listItem}>
                    <ListItemAvatar>
                      <Avatar>{user[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end" aria-label="delete"
                        onClick={() => handleRemoveUser(user)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} className={classes.paper}>
        <Grid item xs>
          <Paper className={classes.paper} color="primary">
            <Typography className={classes.typography}>
              歷史紀錄
            </Typography>

            <Divider className={classes.divider} />

            <Box mx={2} mt={1} align='right'>
              <IconButton onClick={() => setTimeFromNow(!timeFromNow)}>
                <AccessTimeIcon />
              </IconButton>
              <IconButton onClick={() => setOpenDialog(true)}>
                <AddIcon />
              </IconButton>
              <IconButton onClick={handleBackClick}>
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
                      <Box style={{ display: 'flex' }}>
                        <Avatar>{event.creditor[0]}</Avatar> &nbsp;
                        <Typography>{event.creditor}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box style={{ display: 'flex' }}>
                        <Avatar>{event.debtor[0]}</Avatar> &nbsp;
                        <Typography>{event.debtor}</Typography>
                      </Box>
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
        <MenuItem onClick={handlePayBackClick}>收還錢</MenuItem>
      </Menu>

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

      <Dialog
        open={openEditDialog}
        onClose={handleEditClose}
        maxWidth="md"
      >
        <DialogTitle>編輯交易</DialogTitle>
        <DialogContent>
          <Typography>{payBackSign ? `${currentCreditor}欠${currentDebtor}` : `${currentDebtor}欠${currentCreditor}`}</Typography>
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

      <Dialog
        open={openPayBackDialog}
        onClose={handlePayBackClose}
        maxWidth="md"
      >
        <DialogTitle>{payBackSign ? `${currentCreditor}還給${currentDebtor}` : `${currentCreditor}向${currentDebtor}收取`}</DialogTitle>
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