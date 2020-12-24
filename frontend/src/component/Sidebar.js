import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import Hidden from '@material-ui/core/Hidden'

import route from '../constants/route'

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

function Sidebar(props) {
  const { classes, ...other } = props;

  const history = useHistory();

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <Hidden smUp>
          <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
            使用者資訊
          </ListItem>
        </Hidden>
        <ListItem 
          className={clsx(classes.item, classes.itemCategory)} 
          button
          onClick={() => history.push('/home')}
        >
          <ListItemIcon className={classes.itemIcon}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            首頁
          </ListItemText>
        </ListItem>
        {route.nav_items.map(({ categoryName, items }) => (
          <React.Fragment key={categoryName}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {categoryName}
              </ListItemText>
            </ListItem>
            {
              items.map(({ name: childId, icon, active, url }) => (
                <ListItem
                  key={childId}
                  button
                  className={clsx(classes.item, active && classes.itemActiveItem)}
                  onClick={ () => history.push(url)}
                >
                  <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                  <ListItemText
                    classes={{
                      primary: classes.itemPrimary,
                    }}
                  >
                    {childId}
                  </ListItemText>
                </ListItem>
              ))
            }

            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Sidebar);