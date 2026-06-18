import HMC_cardSrc from "../../assets/images/404.png";
import HMC_colorSrc from "../../assets/images/Hmc_color.jpg";


function Home() {

  return (
    <div className="flex h-full">
      <img src={HMC_colorSrc} alt="HMC logo" className="h-full w-1/2 object-contain" />
      <img src={HMC_cardSrc} alt="HMC logo" className="h-full w-1/2 object-contain" />
    </div>
  )
}

export default Home
