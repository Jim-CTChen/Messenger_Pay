import React, { useState, useEffect } from 'react'
import IconButton from '@material-ui/core/IconButton';
import DehazeIcon from '@material-ui/icons/Dehaze';

function Header(props) {
  const { toggleSidebar } = props
  return (
    <>
      <header>
        <IconButton onClick={toggleSidebar}>
          <DehazeIcon></DehazeIcon>
        </IconButton>
      </header>
    </>
  )
}

export default Header