import { useState } from 'react'
import Header from "./components/header/Header";

import { Outlet } from 'react-router-dom';
import './App.css'


function Root() {

  return (
    <>
      <Header/>
      <div style={{height: "calc(100vh - 56px)" }}>
        <Outlet />
      </div>
    </>
  )
}

export default Root
