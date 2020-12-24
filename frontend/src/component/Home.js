import { React, useState, useEffect} from 'react';
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
import Typography from '@material-ui/core/Typography'
import db from '../constants/db'

const styles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
  },
  divider: {
    backgroundColor: '#e4e4e4',
    height: '2px'
  },
  list: {
    margin: '5px'
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
  }
});

const FILTER = [
  { key: 0, label: '好友', collection: 'person' },
  { key: 1, label: '群組', collection: 'group' },
  { key: 2, label: '活動', collection: 'activity' }
]

const person = (avatarSrc, name) => {
  return (
    <Box component="span" style={{display: 'flex'}} >
      { avatarSrc ? 
        <Avatar alt={name} src={avatarSrc} /> :
        <Avatar>{name[0]}</Avatar> 
      }
      <Typography >{name}</Typography>
    </Box>
  )
}

function Home(props) {
  const { classes } = props;
  const [ tabValue, setTabValue ] = useState(0)
  const [ filter, setFilter ] = useState(FILTER[0])

  const handleTabChange = (e, value) => {
    setTabValue(value)
    setFilter(FILTER[value])
  }

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
      <Divider className={classes.divider}/>
      <List className={classes.list}>
        {
          db[`${filter.collection}`].map(ele => 
            <ListItem
              button
              onClick={() => {}}
              key={ele.name}
              className={classes.listItem}
            >
              { ele.avatarSrc ? 
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
    </Paper>
  );
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);