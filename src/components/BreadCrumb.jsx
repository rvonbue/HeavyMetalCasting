import { useLocation } from 'react-router-dom';
import { NavLink } from "react-router";

export default function BreadCrumb() {
  const location = useLocation();
  // console.log(location.pathname); // e.g., "/dashboard"
  // console.log(location.search);   // e.g., "?query=example"
  // console.log(location.hash);     // e.g., "#section1"
  // console.log(location.state);    // any state passed via navigate()
  // console.log("afhajksdhfjklsadhlf", location.pathname);
  const paths = location.pathname.replace(/^\/|\/$/g, "").split("/");
  const urls = paths.map((p, index) => paths.reduce((red, val, index2) => { return index > index2 - 1  ? (red + "/" + val) : red}, ""));

  return (
      <div className="font-bold text-hmc-c text-left text-sm">
        <NavLink 
          to="/"
          style={{ color: "inherit"}}
          className={"uppercase"}
        >
            Home
        </NavLink>
        {paths.map((val, index) => 
          <NavLink 
            to={urls[index]}
            style={{ color: "inherit"}}
            className={"uppercase ml-1"}
          >
             / {val}
          </NavLink>
        )} 


      </div>
  )
}