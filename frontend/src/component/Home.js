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

import { AuthContext } from '../AuthContext'

const styles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
  },
  divider: {
    backgroundColor: '#e4e4e4',
    height: '2px'
  },
  // list: {
  //   margin: '5px',
  // },
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
  { type: '我欠', value: true  }
]

function Home(props) {
  const { classes } = props;
  const [tabValue, setTabValue] = useState(0)
  const [filter, setFilter] = useState(FILTER[0])
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState('');
  const [amountSign, setAmountSign] = useState(false);
  const [amount, setAmount] = useState(0);
  const history = useHistory();
  const authContext = useContext(AuthContext);

  const handleTabChange = (e, value) => {
    setTabValue(value)
    setFilter(FILTER[value])
  }

  const handleIsLogin = () => {
    if (!authContext.currentUser.isLogin) {
      history.replace('/Login');
    }
  }

  useEffect(() => {
    handleIsLogin();
  }, [history])
  
  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleSignChange = (event) => {
    setAmountSign(event.target.value)
  }

  const handleAmountChange = (event) => {
    setAmount(event.target.value)
  }

  const handleClickOpen = () => {
    setOpenDialog(true)
  };

  const handleClose = () => {
    setOpenDialog(false)
  };

  const handleSubmit = () => { 
    const newSubmit = {
      name: name,
      amount: amountSign ? (-1)*amount : amount,
      avatarSrc: null
    }
    db[`${filter.collection}`].push(newSubmit)
    setName('')
    setAmountSign(false)
    setAmount(0)
    setOpenDialog(false)
  };

  return (
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
          onClick={handleClickOpen}
          startIcon={<AddIcon />}
        >
          新增
        </Button>
      </Box>
      <List className={classes.list}>
        {
          db[`${filter.collection}`].map(ele =>
            <ListItem
              button
              onClick={() => { }}
              key={ele.name}
              className={classes.listItem}
            >
              {ele.avatarSrc ?
                <Avatar alt={ele.name} src={ele.avatarSrc} /> :
                <Avatar>{ele.name[0]}</Avatar>
              }
              &nbsp;
              <ListItemText >{ele.name}</ListItemText>
              <Box display="inline" mr={10}>
                {
                  ele.amount >= 0 ?
                    <ListItemText className={classes.green}>
                      {`+${ele.amount}`}
                    </ListItemText> :
                    <ListItemText className={classes.red}>
                      {`${ele.amount}`}
                    </ListItemText>
                }
              </Box>
            </ListItem>
          )
        }
      </List>
      <IconButton
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
      </IconButton>
      <Dialog open={openDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">訂立債務契約!</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label="對象"
            onChange={handleNameChange}
            fullWidth
          />
        </DialogContent>
        <DialogContent>
          <TextField
            select
            margin="dense"
            id="amountSign"
            label="類別"
            value={amountSign}
            onChange={handleSignChange}
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
            onChange={handleAmountChange}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            margin="dense"
            id="note"
            label="備註"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button disabled={ name === "" | amount === 0 } onClick={handleSubmit} color="primary">
            確認
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
    
  );
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);