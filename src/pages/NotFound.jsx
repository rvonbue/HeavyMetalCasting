import { Link } from "react-router-dom";
import HMC_cardSrc from "../assets/images/404.png";
import { Button_A } from "../components/Resuables";

export default function NotFound() {
  return (
    <div 
      className="flex flex-col items-center bg-gray-100 text-gray-800" 
      style={{height: "100%", paddingTop: "24px"  }}
    >

      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Sorry, the page you're looking for doesn't exist.</p>
            <img src={HMC_cardSrc} alt="HMC logo" style={{margin: "24px auto", maxHeight: "50%" }} />
      <Button_A button_name="Go back home" link_val="/"/>  
    </div>
  );
}