import { useState, useMemo } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { Button_A, PageContainer } from '../../components/Resuables'
import BreadCrumb from '../../components/BreadCrumb'
import ProductCard from '../../components/CustomerPageComponents/ProductCard.jsx'
import { ShopPathName } from '../../staticData/PathData.js'

function ShopPage() {
  const { category } = useParams()

  const products = useSelector(
    state => state.products.products
  )

  const productCategories = useSelector(
    state => state.products.productAttributes.productCategories
  )

  const selectedCategory = category

  const selectedCategoryId = useMemo(() => {
    if (!selectedCategory) return undefined
    return productCategories.find(
      c => c.label.toLowerCase() === selectedCategory.toLowerCase()
    )?.id
  }, [selectedCategory, productCategories])

  const sortedFilteredProducts = useMemo(() => {
    if (!selectedCategoryId) {
      return products.filter(prd => prd.live === true)
    }

    return products.filter(
      prd =>
        prd.live === true &&
        prd.productCategories.some(catId => catId === selectedCategoryId)
    )
  }, [products, selectedCategoryId])

  return (
    <PageContainer>
      <BreadCrumb />

      <div
        className={
          'text-left text-3xl text-hmc-text-a font-bold mt-6 select-none' +
          (selectedCategory ? '' : ' invisible')
        }
      >
        {selectedCategory || 'invisible'}
      </div>

      <div className="flex mt-8">
        <SidePanel
          selectedCategory={selectedCategory}
          productCategories={productCategories}
        />

        <ProductsContainer
          sortedFilteredProducts={sortedFilteredProducts}
        />
      </div>
    </PageContainer>
  )
}


function SidePanel({ selectedCategory, productCategories }) {
  
  const [sidePanelState, setSidePanelState] = useState({
    categoriesOpen: true
  });
  
  return (
      <SidepanelList 
        headerName={"Categories"} 
        {...{ sidePanelState, setSidePanelState }}
        displayData={productCategories}
        selectedCategory={selectedCategory}
      />
  )
}

export function SidepanelList({ headerName, sidePanelState, setSidePanelState,  displayData}) {
    const [selectedOptions, setSelectedOptions] = useState([]);

    return (
      <div className="text-left w-[30%]">
          <h1 className="text-1xl font-bold text-hmc-c uppercase flex justify-between items-center 
                        cursor-pointer select-none border-b-2 border-[var(--color-hmc-border-a)] mb-4"
            onClick={() => setSidePanelState((old) => ({...old, categoriesOpen: !old.categoriesOpen }))}
          >
            <div>{headerName}</div>
            <div className="text-3xl">{sidePanelState.categoriesOpen ? "-" : "+" }</div>
          </h1>
          {sidePanelState.categoriesOpen &&
            <div className={"flex flex-col"}>
              {displayData.map((displayObject) => {
                return (
                  <NavLink 
                    key={displayObject.id + displayObject.label }
                    to={`/${ShopPathName}/${displayObject.label}/`} 
                    end 
                    className={({ isActive }) => { 
                      return  ( (isActive ? "text-hmc-link-active" :  "text-hmc-link") + " text-1xl ml-2 cursor-pointer font-semibold select-none" );
                    }}
                  >
                    {displayObject.label}
                  </NavLink>
                )
              })}
            </div>
          }
      </div>
    );
}

function ProductsContainer({ sortedFilteredProducts }) {
    return (
      <div className="text-left ml-12 w-[70%] grid grid-cols-3 gap-4">
          {sortedFilteredProducts.map((product) => {
            return <ProductCard key={product.id} product={product} />
          })}
      </div>
    );
}

export default ShopPage