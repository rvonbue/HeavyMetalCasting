import { useState } from 'react'
import { NavLink } from "react-router";
import { Link } from 'react-router-dom';

function Header() {
  return (
    <>
    <header 
      className="bg-hmc-A font-cinzel"
      style={{ position: 'sticky', overflow: 'visible', top: 0, width: "100%", }}
    >
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center",maxWidth: "1280px", margin: "auto", padding: "1rem 1.5rem 1rem .7rem" }}>
        <div style={{ width: "25%" }} >
          <NavLink 
           to="/" end
           className="bg-hmc-A font-cinzel my-custom-color"
           style={{color: "var(--theme-text-color-A)" }}
          >
            HMC
          </NavLink> 
        </div>
          <div className="bg-hmc-A font-cinzel text-hmcA">test</div>
        <div  style={{width: "50%" }}>
          <NavLink to="/" end style={{color: "var(--theme-text-color-A)",padding: "0px 8px"}}>SHOP</NavLink>
          <NavLink to="/trending" end style={{color: "var(--theme-text-color-A)", padding: "0px 8px"}}>COLLECTIONS</NavLink>
          <NavLink to="/concerts" className="text-red-500" style={{ padding: "0px 8px"}}>MY STORY</NavLink>
        </div>
      <div 
          className="text-hmc-B" 
          style={{width: "25%",}}
        >
          <Link to="/login" style={{color: "var(--theme-text-color-A)" }} >SIGN IN</Link>
        </div>
      </div>
    </header>
    </>
  )
}

export default Header
