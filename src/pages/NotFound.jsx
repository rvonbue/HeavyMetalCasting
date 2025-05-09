import { Link } from "react-router-dom";
import HMC_cardSrc from "../assets/images/Hmc_color.jpg";

export default function NotFound() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-6" 
      style={{height: "100%", display: "flex", flexDirection: "column" }}
    >

      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Sorry, the page you're looking for doesn't exist.</p>
            <img src={HMC_cardSrc} alt="HMC logo" style={{margin: "24px auto", maxHeight: "50%" }} />
      <Link
        to="/"
        className="text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded transition"
      >
        Go back home
      </Link>
    </div>
  );
}