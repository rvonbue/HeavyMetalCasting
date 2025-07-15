import { useState } from 'react';
import { Button_A, PageContainer } from "../../components/Resuables";
import BreadCrumb from "../../components/BreadCrumb";
import { useAppState  } from '../../AppState'; // useAppDispatch
import { NavLink, useParams  } from "react-router";
// import { activeBorder, inactiveBorder } from "../../styles/App.jsx";
import { ShopPathName } from "../../staticData/PathData.js";
import ProductCard from "../../components/CustomerPageComponents/ProductCard.jsx";


function ShopPage() {
  let { category } = useParams();
  let selectedCategory = category;
  
  return (
    <PageContainer>
      <BreadCrumb />
      <SidePanel selectedCategory={selectedCategory}/>
    </PageContainer>
  )
}

function SidePanel({ selectedCategory }) {
  const { products, productProps, productsLoading, productCategories } = useAppState();
  const [sidePanelState, setSidePanelState] = useState({
    categoriesOpen: false
  });

  const selectedCategoryId = selectedCategory ? productCategories.find((prdC) => prdC.label.toLowerCase() === selectedCategory.toLowerCase()).id : undefined;
  const sortedFilteredProducts = selectedCategory ? products.filter((prd) => prd.productCat.some((catId) => catId === selectedCategoryId)) : products;
  
  return (
    <div className="flex">
      <SidepanelList 
        headerName={"Categories"} 
        {...{ sidePanelState, setSidePanelState }}
        displayData={productCategories}
        selectedCategory={selectedCategory}
      />

      <ProductsContainer 
        sortedFilteredProducts={sortedFilteredProducts}
      />
    </div>
  )
}

export function SidepanelList({ headerName, sidePanelState, setSidePanelState,  displayData}) {
    const [selectedOptions, setSelectedOptions] = useState([]);

    return (
      <div className="text-left mt-18 w-[30%]">
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
    console.log("sortedFilteredProducts", sortedFilteredProducts);
    
    return (
      <div className="text-left mt-16 ml-12 w-[70%] grid grid-cols-3 gap-4">
          {sortedFilteredProducts.map((product) => {
            return <ProductCard key={product.id} product={product} />
          })}
      </div>
    );
}

export default ShopPage