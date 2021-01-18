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
  const [creditor, setCreditor] = useState('');
  const [debtor, setDebtor] = useState('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [addUser, setAddUser] = useState('');
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
        // console.log('result', result.data.data.events)
        setMemberList(result.data.data.users)
        setEventList(result.data.data.events)
      }
    } catch (error) {
      alert(error);
    }
  }

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
                <col width="20%" />
                <col width="20%" />
                <col width="20%" />
                <col width="20%" />
                <col width="20%" />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="center">債權人</TableCell>
                  <TableCell align="center">債務人</TableCell>
                  <TableCell align="center">敘述</TableCell>
                  <TableCell align="center">金額</TableCell>
                  <TableCell align="center">時間</TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>

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
            placeholder="請填入數字"
            value={amount}
            error={isNaN(amount)}
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

    </>
  );
}

Group.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Group);