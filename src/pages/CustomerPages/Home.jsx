import { useState } from 'react'
import HMC_cardSrc from "../../assets/images/HMC_card.jpg";

function Home() {

  return (
    <>
      <div>
        <img src={HMC_cardSrc} alt="HMC logo" style={{margin: "24px auto" }} />
      </div>
    </>
  )
}

export default Home
