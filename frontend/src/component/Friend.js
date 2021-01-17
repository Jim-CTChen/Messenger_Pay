import { React, useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import TimeAgo from 'javascript-time-ago'
import zh from 'javascript-time-ago/locale/zh-Hant'
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

import { AuthContext } from '../AuthContext'
import agent from '../agent'

TimeAgo.addDefaultLocale(zh);
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
  { type: '欠我', value: false },
  { type: '我欠', value: true }
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

function Friend(props) {
  const { classes } = props;
  const [eventList, setEventList] = useState([])
  const [timeFromNow, setTimeFromNow] = useState(false)
  const [sum, setSum] = useState(0)
  const [openFriendDialog, setOpenFriendDialog] = useState(false);
  const [amountSign, setAmountSign] = useState(false);
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);
  const { friend } = useParams();

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

  const handleBackClick = () => {
    history.goBack();
  }

  const getEventInfo = async () => {
    if (!currentUser.username) return
    try {
      const result = await agent.Event.getFriendEvent(currentUser.username, friend);
      if (!result.data.success) {
        alert(result.data.error);
      }
      else {
        console.log('result', result.data.data.events)
        setEventList(result.data.data.events)
      }
    } catch (error) {
      alert(error);
    }
  }

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
    console.log('total', total)
  }, [eventList])

  return (
    <>
      <Grid container spacing={3} className={classes.paper}>
        <Grid item xs>
          <Paper className={classes.blockPaper} color="primary">
            <Box mx={2} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box style={{ display: 'flex' }}>
                <Avatar>{friend[0]}</Avatar> &nbsp;
                <Typography>{friend}</Typography>
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
          <Paper className={classes.paper} color="primary">
            <Typography className={classes.typography}>
              歷史紀錄
          </Typography>

            <Divider className={classes.divider} />

            <Box mx={2} mt={1} align='right'>
              <IconButton onClick={() => setTimeFromNow(!timeFromNow)}>
                <AccessTimeIcon />
              </IconButton>
              <IconButton onClick={() => setOpenFriendDialog(true)}>
                <AddIcon />
              </IconButton>
              <IconButton onClick={handleBackClick}>
                <HomeIcon />
              </IconButton>

            </Box>

            <Table>
              <colgroup>
                <col width="25%" />
                <col width="25%" />
                <col width="25%" />
                <col width="25%" />
              </colgroup>
              <TableHead>
                <TableRow>
                  {/* <TableCell></TableCell> */}
                  <TableCell align="center">類型</TableCell>
                  <TableCell align="center">敘述</TableCell>
                  <TableCell align="center">金額</TableCell>
                  <TableCell align="center">時間</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eventList.map((event, id) => (
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
                    {/* <TableCell align="center">{dayjs(event.time).format('YYYY/MM/DD HH:mm')}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>

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
          <Button onClick={handleFriendClose} color="primary">
            取消
        </Button>
          <Button
            disabled={isNaN(amount) | amount === ''}
            onClick={handleFriendSubmit} color="primary"
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