import { useState, useMemo } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { Button_A, PageContainer } from '../../components/Resuables'
import BreadCrumb from '../../components/BreadCrumb'
import ProductCard from '../../components/CustomerPageComponents/ProductCard.jsx'
import { ShopPathName } from '../../staticData/PathData.js'

function ShopPage() {
  const { category } = useParams();
  const selectedCategoriesByRoute = category ? category.split("_") : [];

  const shopProducts = useSelector(state => state.products.shopProducts);
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
      return shopProducts.filter(prd => prd.live === true)
    }

    return shopProducts.filter(
      prd =>
        prd.live === true &&
        prd.productCategories.some(catId => catId === selectedCategoryId)
    )
  }, [shopProducts, selectedCategoryId])

  return (
    <PageContainer>
      <BreadCrumb />

      <div
        className={
          'text-left text-3xl text-hmc-text-a font-bold mt-6 select-none' +
          (selectedCategoriesByRoute.length ? '' : ' invisible')
        }
      >
        {selectedCategoriesByRoute.join(" ") || 'invisible'}
      </div>

      <div className="flex mt-8">
        <SidePanel
          selectedCategoriesByRoute={selectedCategoriesByRoute}
          productCategories={productCategories}
        />

        <ProductsContainer
          sortedFilteredProducts={sortedFilteredProducts}
        />
      </div>
    </PageContainer>
  )
}


function SidePanel({ selectedCategoriesByRoute, productCategories }) {
  
  const [sidePanelState, setSidePanelState] = useState({
    categoriesOpen: true
  });
  
  return (
      <SidepanelList 
        headerName={"Categories"} 
        {...{ sidePanelState, setSidePanelState }}
        displayData={productCategories}
        selectedCategoriesByRoute={selectedCategoriesByRoute}
      />
  )
}

function getShopUrlForCategory(selectedCategoriesByRoute, category) {
  const categoryIndex = selectedCategoriesByRoute.indexOf(category);

    if(categoryIndex !== -1)  {
      // Category is already selected, remove it
      const newCategories = selectedCategoriesByRoute.filter(cat => cat !== category);
      return newCategories.length > 0 ? `/${ShopPathName}/${newCategories.join("_")}/` : `/${ShopPathName}/`;
    } else {
      // Category is not selected, add it
      const newCategories = [...selectedCategoriesByRoute, category];
      return `/${ShopPathName}/${newCategories.join("_")}/`;
    }      
}

export function SidepanelList({ headerName, sidePanelState, setSidePanelState,  displayData, selectedCategoriesByRoute}) {

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
                const toValue = getShopUrlForCategory(selectedCategoriesByRoute, displayObject.label);
                return (
                  <NavLink 
                    key={displayObject.id + displayObject.label }
                    to={toValue} 
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