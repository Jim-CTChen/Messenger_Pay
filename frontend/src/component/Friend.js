import { React, useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import db from '../constants/db'
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

import { AuthContext } from '../AuthContext'
import agent from '../agent'

const styles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
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

const ACTIVITY_TYPE = {
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
  const [openDialog, setOpenDialog] = useState(false);
  const [amountSign, setAmountSign] = useState(false);
  const [amount, setAmount] = useState(0);
  const [comment, setComment] = useState('');
  const [activityList, setActivityList] = useState([])
  const [sum, setSum] = useState(0)
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);
  const { friend } = useParams();

  const handleClose = () => {
    setOpenDialog(false)
  };

  const handleSubmit = async () => {
    const payload = {
      creditor: amountSign ? friend : currentUser.username,
      debtor: amountSign ? currentUser.username : friend,
      amount: Number(amount),
      description: comment,
      type: 'PERSONAL'
    }
    try {
      const result = await agent.Activity.createActivity(payload);
      if (!result.data.success) {
        alert(result.data.error);
      }
      else {
        setOpenDialog(false);
        setAmount(0);
        setComment('');
        getFriendInfo();
      }
    } catch (error) {
      setOpenDialog(false);
      setAmount(0);
      setComment('');
      alert(error)
    }
  };

  const getFriendInfo = async () => {
    if (!currentUser.username) return
    try {
      const result = await agent.Activity.getFriendActivity(currentUser.username, friend);
      if (!result.data.success) {
        alert(result.data.error);
      }
      else {
        console.log('result', result.data.data)
        setActivityList(result.data.data)
      }
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    getFriendInfo();
  }, [])

  useEffect(() => {
    if (activityList.length === 0) return
    let total = 0
    activityList.forEach(ele => {
      total += ele.amount
    })
    setSum(total)
    console.log('total', total)
  }, [activityList])

  return (
    <>
      <Paper className={classes.paper} color="primary">
        <Typography className={classes.typography}>
          歷史紀錄
        </Typography>
        <Divider className={classes.divider} />
        <Box mx={2} mt={1} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography >
            {`合計：${(sum < 0) ? '' : '+'}${sum}`}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
            startIcon={<AddIcon />}
          >
            新增
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right">類型</TableCell>
              <TableCell align="right">敘述</TableCell>
              <TableCell align="right">金額</TableCell>
              <TableCell align="right">時間</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activityList.map((activity, id) => (
              <TableRow key={id}>
                <TableCell>
                  <Box style={{ display: 'flex' }}>
                    <Avatar>{friend[0]}</Avatar> &nbsp;
                    <Typography>{friend}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    color={ACTIVITY_TYPE[activity.type].color}
                    label={ACTIVITY_TYPE[activity.type].label}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">{activity.description}</TableCell>
                <TableCell align="right" className={(activity.amount < 0) ? classes.red : classes.green}>
                  {(activity.amount < 0) ? activity.amount : `+${activity.amount}`}
                </TableCell>
                <TableCell align="right">{dayjs(activity.time).format('YYYY/MM/DD HH:mm')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* <IconButton
          onClick={() => { }}
          style={{
            background: 'white',
            position: 'fixed',
            right: '45px',
            bottom: '45px',
            boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.7)'
          }}
        >
          <AddIcon />
        </IconButton> */}
        <Dialog
          open={openDialog}
          onClose={handleClose}
          maxWidth="md"
        >
          <DialogTitle id="form-dialog-title">訂立債務契約!</DialogTitle>
          <DialogContent>
            <Typography>
              {`對象: ${friend}`}
            </Typography>
          </DialogContent>
          <DialogContent>
            <TextField
              select
              margin="dense"
              id="amountSign"
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
              id="amount"
              type="number"
              label="金額"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </DialogContent>
          <DialogContent>
            <TextField
              margin="dense"
              id="note"
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
            <Button disabled={amount === 0} onClick={handleSubmit} color="primary">
              確認
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
}

Friend.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Friend);