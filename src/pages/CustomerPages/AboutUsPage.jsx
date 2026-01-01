import { useState } from 'react'
import { Button_A, PageContainer } from "../../components/Resuables";
import BreadCrumb from "../../components/BreadCrumb";

function AboutUsPage() {

  return (
     <PageContainer>
        <BreadCrumb />
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-hmc-c">ABOUT US</h1>
            </div>
          </div>
        </PageContainer>
  )
}

export default AboutUsPage
