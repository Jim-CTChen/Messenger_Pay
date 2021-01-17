import { React, useState, useEffect, useContext } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom'
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

// const sign = [
//   { type: '欠我', value: false },
//   { type: '我欠', value: true }
// ]

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
  const [sum, setSum] = useState(0)
  const history = useHistory();
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();

  const handleBackClick = () => {
    history.goBack();
  }

  const getGroupInfo = async () => {
    console.log('click')
    if (!currentUser.username) return
    try {
      const result = await agent.Group.getGroupEvent(currentUser.username, id);
      if (!result.data.success) {
        alert(result.data.error);
      }
      else {
        console.log('result', result.data.data.events)
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
      total += ele.amount
    })
    setSum(total)
    console.log('total', total)
  }, [eventList])

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
            onClick={handleBackClick}
          >
            上一頁
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
            {eventList.map((event, id) => (
              <TableRow key={id}>
                <TableCell>
                  <Box style={{ display: 'flex' }}>
                    <Avatar>{event.creditor[0]}</Avatar> &nbsp;
                    <Typography>{event.creditor}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box style={{ display: 'flex' }}>
                    <Avatar>{event.debtor[0]}</Avatar> &nbsp;
                    <Typography>{event.debtor}</Typography>
                  </Box>
                </TableCell>
                {/* <TableCell align="right">
                  <Chip
                    color={EVENT_TYPE[event.type].color}
                    label={EVENT_TYPE[event.type].label}
                    variant="outlined"
                  />
                </TableCell> */}
                <TableCell align="right">{event.description}</TableCell>
                <TableCell align="right" className={(event.amount < 0) ? classes.red : classes.green}>
                  {(event.amount < 0) ? event.amount : `+${event.amount}`}
                </TableCell>
                <TableCell align="right">{dayjs(event.time).format('YYYY/MM/DD HH:mm')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}

Group.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Group);