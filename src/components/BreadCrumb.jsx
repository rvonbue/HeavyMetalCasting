import { useLocation } from 'react-router-dom';
import { NavLink } from "react-router";

export default function BreadCrumb() {
  const location = useLocation();
  // console.log(location.pathname); // e.g., "/dashboard"
  // console.log(location.search);   // e.g., "?query=example"
  // console.log(location.hash);     // e.g., "#section1"
  // console.log(location.state);    // any state passed via navigate()
  // console.log("afhajksdhfjklsadhlf", location.pathname);
  
  return (
      <div className="font-bold text-hmc-c text-left">
         {/* <NavLink 
            to={`/${ShopPathName}/${displayObject.label}/`} end 
            style={{ color: "inherit"}}
            className={({ isActive }) => { 
              return  ( (isActive ? activeBorder : inactiveBorder) + "text-1xl text-hmc-c ml-2 cursor-pointer" );
            }}
          >
            {displayObject.label}
          </NavLink> */}
         Home {location.pathname.replace(/^\/|\/$/g, "").split("/").reduce((red, val) => (red + " / " + val), "")} 
      </div>
  )
}