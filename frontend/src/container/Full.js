import React, { useState, useEffect } from 'react'
import Sidebar from '../component/Sidebar'
import Header from '../component/Header'

function Full(props) {
  const [isSidebarCollapse, setIsSidebarCollapse] = useState(false)

  const toggleSidebar = (isCollapse = null) => {
    if (isCollapse === null)
      setIsSidebarCollapse(!isSidebarCollapse)
    else setIsSidebarCollapse(isCollapse)
  }

  return (
    <>
      <Header toggleSidebar={toggleSidebar}></Header>
      <Sidebar 
        isSidebarCollapse={isSidebarCollapse}
        toggleSidebar={toggleSidebar}
      ></Sidebar>
    </>
  )

}

export default Full