import { useEffect, useState } from 'react';
import { useAppState } from '../../AppState'
import { NavLink } from "react-router";
import { sortBy } from "lodash-es";
import { PencilIcon, TrashIcon, TailwindSpinner, ArrowUpIcon, ArrowDownIcon } from "../../styles/Icons";
import { Button_A, PageContainer } from "../../components/Resuables";

function sortProducts(products, sortColumnInfo){
  return sortColumnInfo.reverse ? sortBy(products, [sortColumnInfo.dataName]).reverse() : sortBy(products, [sortColumnInfo.dataName]);
}

export default function ProductOverviewPage() {
   const { products, productProps, productsLoading, productCategories } = useAppState();
   const [sortColumnInfo, setSortColumnInfo] = useState({dataName: "live", reverse: false });
   const [sortedProducts, setSortedProducts] = useState(sortProducts(products, sortColumnInfo));

   useEffect(() => {
      setSortedProducts(sortProducts(products, sortColumnInfo));
   }, [sortColumnInfo.dataName, sortColumnInfo.reverse, products]);
   

  return (
    <PageContainer bg="alt1">
      <div className="mx-auto bg-white rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <Button_A button_name="+ Add Product" link_val="/admin/add_product" button_styles_outer={{ marginTop: "1.5rem"}}/>
        </div>
        { productsLoading ? <TailwindSpinner/> 
        :
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-hmc-button-text-b">
              {productProps.map(({ adminDisplayName, dataName }, index) => (
                <th
                  key={index + adminDisplayName}
                  className="pl-3 pr-6 pt-3 pb-3 border-b text-left align-top leading-none select-none relative"
                  onClick={() => setSortColumnInfo({ dataName, reverse: !sortColumnInfo.reverse })}
                >
                  {adminDisplayName}
                  {dataName === sortColumnInfo.dataName ? 
                    (sortColumnInfo.reverse === false ? <ArrowUpIcon classNames={"absolute top-3 right-0"}/> : <ArrowDownIcon classNames={"absolute top-3 right-0"}/>)
                    : null 
                  }
                </th>
              ))}
              <th className="p-3 border-b text-left align-top leading-tight">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                {productProps.map(({ dataName }, index) => (
                  <td
                    key={index + dataName}
                    className="p-3 border-b border-hmc-button-text-b text-left align-top"
                  >
                    {getCellValue({productCategories, dataName, product }) }
                  </td>
                ))}
                <td className="p-3 border-b border-hmc-b-500 text-left align-top">
                  <div className="flex justify-left">
                    <NavLink
                      to={`/admin/edit_product?product_id=${product.id}`}
                      end
                      style={{ padding: "0px 8px", color: "inherit" }}
                    >
                      <PencilIcon classes={"mr-4"} />
                    </NavLink>
                    <TrashIcon />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        }
      </div>
    </PageContainer>
  );
}

function getCellValue({ productCategories, dataName, product }){
  const value = product[dataName];
  // console.log(" productCategories, dataName, product, value", productCategories, dataName, product, value );
  switch (dataName) {
    case "productCat":
      return value.map((catId) => productCategories.find((cat) => cat.id ===  catId).label).join(", ");
    case "live":
      return value === true ? "Yes" : "No";
    default:
      return value;
  }
}