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

import Grid from '@material-ui/core/Grid';

import { AuthContext } from '../AuthContext'
import agent from '../agent'

const styles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
  },
  blockPaper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  blockSec1: {
    margin: theme.spacing(1),
  },
  blockSec2: {
    margin: theme.spacing(2, 1),
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
      const result = await agent.Event.createEvent(payload);
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

  const handleGroupClick = (id) => {
    console.log('click group')
    history.push(`/group/${id}`);
    // history.push({ pathname: `/group/${name}`, data: { id: id } });
  }

  useEffect(() => {
    getUserInfo();
  }, [])

  return (
    <>
      <Grid container spacing={3} className={classes.paper}>
        <Grid item xs>
          <Paper className={classes.blockPaper}>
            <div className={classes.blockSec1}>
              <Typography variant="subtitle1">
                待回收
              </Typography>
            </div>
            <Divider className={classes.divider} variant="middle" />
            <div className={classes.blockSec2}>
              <Typography variant="h5">
                1000
              </Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classes.blockPaper}>
            <div className={classes.blockSec1}>
              <Typography variant="subtitle1">
                待支出
              </Typography>
            </div>
            <Divider className={classes.divider} variant="middle" />
            <div className={classes.blockSec2}>
              <Typography variant="h5">
                700
              </Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classes.blockPaper}>
            <div className={classes.blockSec1}>
              <Typography variant="subtitle1">
                總結
              </Typography>
            </div>
            <Divider className={classes.divider} variant="middle" />
            <div className={classes.blockSec2}>
              <Typography variant="h5">
                300
              </Typography>
            </div>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} className={classes.paper}>
        <Grid item xs>
          <Paper className={classes.paper} color="primary">
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
                    onClick={() => handleFriendClick(friend.username)}
                    key={friend.username}
                    className={classes.listItem}
                  >
                    <Avatar>{friend.username[0]}</Avatar>
                    &nbsp;
                    <ListItemText >{friend.username}</ListItemText>
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
                    onClick={() => handleGroupClick(group.id)}
                    key={group.id}
                    className={classes.listItem}
                  >
                    <Avatar>{group.groupName[0]}</Avatar>
                    &nbsp;
                    <ListItemText >{group.groupName}</ListItemText>
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
        </Grid>
      </Grid>
    </>
  );
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);