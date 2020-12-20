import React, { useState, useEffect } from 'react'
import clsx from 'clsx';
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List, ListItem } from '@material-ui/core'
import route from '../constants/route'

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

function Sidebar(props) {
  const { isSidebarCollapse, toggleSidebar } = props
  const history = useHistory()
  const classes = useStyles();

  const handleClickNavItem = (navItem) => {
    history.push(navItem.url)
  }

  const list = () => {
    <div
      // className={clsx(classes.list, {
      //   [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      // })}
      className={clsx(classes.list, {[classes.fullList]: false})}
      role="presentation"
      onClick={toggleSidebar()}
      onKeyDown={toggleSidebar()}
    >
      <List>
        {route.nav_items.map(navItem => (
          <ListItem key={navItem.name} onClick={() => handleClickNavItem(navItem)}>
            {navItem.name}
          </ListItem>
          // <ListItem button key={text}>
          //   <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
          //   <ListItemText primary={text} />
          // </ListItem>
        ))}
      </List>
      {/* <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List> */}
    </div>
  }

  return (
    <>
      <Drawer
        anchor="left"
        open={isSidebarCollapse}
        onClose={() => toggleSidebar(false)}
      >
        <List>
          {list()}
        </List>
      </Drawer>
    </>
  )
}

export default Sidebar;