import { React, useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom'
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
    width: '33.3%',
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

const FILTER = [
  { key: 0, label: '好友', collection: 'person' },
  { key: 1, label: '群組', collection: 'group' },
  // { key: 2, label: '活動', collection: 'activity' }
]

const sign = [
  { type: '欠我', value: false },
  { type: '我欠', value: true }
]

function Home(props) {
  const { classes } = props;
  const [tabValue, setTabValue] = useState(0)
  const [filter, setFilter] = useState(FILTER[0])
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState('');
  const [amountSign, setAmountSign] = useState(false);
  const [amount, setAmount] = useState(0);
  const [comment, setComment] = useState('')
  const [friendList, setFriendList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);

  const handleTabChange = (e, value) => {
    setTabValue(value)
    setFilter(FILTER[value])
  }

  const handleIsLogin = () => {
    if (!currentUser.isLogin) {
      history.replace('/login');
    }
  }

  useEffect(() => {
    handleIsLogin();
  }, [history])

  const handleClose = () => {
    setOpenDialog(false)
  };

  const handleSubmit = async () => {
    const payload = {
      creditor: amountSign ? name : currentUser.username,
      debtor: amountSign ? currentUser.username : name,
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
        setName('');
        setAmount(0);
        setComment('');
        getUserInfo();
      }
    } catch (error) {
      setOpenDialog(false);
      setName('');
      setAmount(0);
      setComment('');
      alert(error)
    }
  };

  const getUserInfo = async () => {
    if (!currentUser.isLogin) {
      return
    }
    try {
      const result = await agent.User.getUserInfo(currentUser.username);
      if (!result.data.success) {
        alert(result.data.error);
      }
      else {
        setFriendList(result.data.data.friends);
        setGroupList(result.data.data.groups);
      }
    } catch (error) {
      alert(error);
    }
  }

  const handleFriendClick = (name) => {
    history.push(`/friend/${name}`);
  }

  useEffect(() => {
    getUserInfo();
  }, [])

  return (
    <>
      <Paper className={classes.paper} color="primary">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">待收</TableCell>
              <TableCell align="center">待付</TableCell>
              <TableCell align="center">總結</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">1000</TableCell>
              <TableCell align="center">700</TableCell>
              <TableCell align="center">300</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Tabs
          className={classes.tabs}
          value={tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
          aria-label="disabled tabs example"
        >
          {
            FILTER.map(item =>
              <Tab
                className={classes.tabs}
                value={item.key}
                key={item.key}
                label={item.label}
              />
            )
          }
        </Tabs>
        <Divider className={classes.divider} />
        <Box mx={2} mt={1} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
            startIcon={<AddIcon />}
          >
            新增
          </Button>
        </Box>
        <List>
          {filter.collection === 'person' ?
            friendList.map(friend =>
              <ListItem
                button
                onClick={() => handleFriendClick(friend.name)}
                key={friend.name}
                className={classes.listItem}
              >
                <Avatar>{friend.name[0]}</Avatar>
                &nbsp;
                <ListItemText >{friend.name}</ListItemText>
                <Box display="inline" mr={10}>
                  {
                    friend.balance >= 0 ?
                      <ListItemText className={classes.green}>
                        {`+${friend.balance}`}
                      </ListItemText> :
                      <ListItemText className={classes.red}>
                        {`${friend.balance}`}
                      </ListItemText>
                  }
                </Box>
              </ListItem>
            ) : groupList.map(group =>
              <ListItem
                button
                onClick={() => { }}
                key={group.name}
                className={classes.listItem}
              >
                <Avatar>{group.name[0]}</Avatar>
                &nbsp;
                <ListItemText >{group.name}</ListItemText>
                <Box display="inline" mr={10}>
                  {
                    group.balance >= 0 ?
                      <ListItemText className={classes.green}>
                        {`+${group.balance}`}
                      </ListItemText> :
                      <ListItemText className={classes.red}>
                        {`${group.balance}`}
                      </ListItemText>
                  }
                </Box>
              </ListItem>
            )

          }

        </List>

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
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              label="對象"
              fullWidth
              value={name}
              onChange={e => setName(e.target.value)}
            />
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
            <Button disabled={name === "" | amount === 0} onClick={handleSubmit} color="primary">
              確認
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);