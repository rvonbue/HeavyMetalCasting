import { useState, useMemo } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { Button_A, PageContainer, OptionButton } from '../../components/Resuables'
import ProductCard from '../../components/CustomerPageComponents/ProductCard.jsx'
import { ShopPathName } from '../../staticData/PathData.js'

function ShopPage() {
  const { category } = useParams();
  const selectedCategoriesByRoute = category ? category.split("_") : [];

  const shopProducts = useSelector(state => state.products.shopProducts);
  const product_categories = useSelector(
    state => state.products.productAttributes.product_categories
  )

  const selectedCategory = category

  const selectedCategoryId = useMemo(() => {
    if (!selectedCategory) return undefined
    return product_categories.find(
      c => c.label.toLowerCase() === selectedCategory.toLowerCase()
    )?.id
  }, [selectedCategory, product_categories])

  const sortedFilteredProducts = useMemo(() => {
    if (!selectedCategoryId) {
      return shopProducts.filter(prd => prd.live === true)
    }

    return shopProducts.filter(
      prd =>
        prd.live === true &&
        prd.product_categories.some(catId => catId === selectedCategoryId)
    )
  }, [shopProducts, selectedCategoryId])

  const [columns, setColumns] = useState(2);

  return (
    <PageContainer>


      <div className="flex
       gap-8">
        <div className="hidden sm:block w-40 shrink-0">
          <SidePanel
            selectedCategoriesByRoute={selectedCategoriesByRoute}
            product_categories={product_categories}
          />
        </div>

        <ProductsContainer
          sortedFilteredProducts={sortedFilteredProducts}
          columns={columns}
          setColumns={setColumns}
        />
      </div>
    </PageContainer>
  )
}


function SidePanel({ selectedCategoriesByRoute, product_categories }) {

  const [sidePanelState, setSidePanelState] = useState({
    categoriesOpen: true
  });

  return (
      <SidepanelList
        headerName={"Categories"}
        {...{ sidePanelState, setSidePanelState }}
        displayData={product_categories}
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

export function SidepanelList({ headerName, sidePanelState, setSidePanelState, displayData, selectedCategoriesByRoute }) {
  return (
    <div className="text-left">
      <h1
        className="text-1xl font-bold text-hmc-c uppercase flex justify-between items-center
                   cursor-pointer select-none border-b-2 border-[var(--color-hmc-border-a)] mb-4"
        onClick={() => setSidePanelState((old) => ({ ...old, categoriesOpen: !old.categoriesOpen }))}
      >
        <div>{headerName}</div>
        <div className="text-3xl">{sidePanelState.categoriesOpen ? "-" : "+"}</div>
      </h1>
      {sidePanelState.categoriesOpen && (
        <div className="flex flex-col">
          <NavLink
            to={`/${ShopPathName}`}
            end
            className={({ isActive }) =>
              (isActive ? "text-hmc-link-active" : "text-hmc-link") +
              " text-1xl ml-2 cursor-pointer font-semibold select-none"
            }
          >
            All
          </NavLink>
          {displayData.map((displayObject) => {
            const toValue = `/${ShopPathName}/${displayObject.label}`;
            return (
              <NavLink
                key={displayObject.id + displayObject.label}
                to={toValue}
                end
                className={({ isActive }) =>
                  (isActive ? "text-hmc-link-active" : "text-hmc-link") +
                  " text-1xl ml-2 cursor-pointer font-semibold select-none"
                }
              >
                {displayObject.label}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}
function ProductsContainer({ sortedFilteredProducts, columns, setColumns }) {
  return (
    <div className="text-left sm:ml-8 flex-1 min-w-0">
      <div className="hidden sm:flex justify-end gap-3 mb-4 items-center">
        {[2, 4].map(n => (
          <button key={n} onClick={() => setColumns(n)} className="flex gap-1.5 items-center p-1">
            {Array.from({ length: n }).map((_, i) => (
              <span
                key={i}
                className={`block w-3 h-3 rounded-full border border-[#b08d57] transition-colors ${columns === n ? 'bg-[#b08d57]' : 'bg-transparent'}`}
              />
            ))}
          </button>
        ))}
      </div>
      <div className={columns === 4 ? 'grid grid-cols-1 sm:grid-cols-4 gap-4' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
        {sortedFilteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ShopPage
