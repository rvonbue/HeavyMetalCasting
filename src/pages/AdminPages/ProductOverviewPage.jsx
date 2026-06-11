import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { NavLink } from "react-router-dom";
import { sortBy } from "lodash-es";
import { PencilIcon, TrashIcon, TailwindSpinner, ArrowUpIcon, ArrowDownIcon } from "../../styles/Icons";
import { Button_A, PageContainer } from "../../components/Resuables";
import UploadXlsxModal from "../../components/modal/UploadXlsxModal";
import { getProductPropDisplayLabel } from "../../helpers/dataHelper.js";

function sortProducts(products, sortColumnInfo){
  return sortColumnInfo.reverse ? sortBy(products, [sortColumnInfo.dataName]).reverse() : sortBy(products, [sortColumnInfo.dataName]);
}

export default function ProductOverviewPage() {
   const { products, productsLoading } = useSelector(state => state.products);
   const { productEditFields } = useSelector(state => state.admin);
   const dispatch = useDispatch(); 
   const [sortColumnInfo, setSortColumnInfo] = useState({dataName: "live", reverse: false });
   const [sortedProducts, setSortedProducts] = useState(sortProducts(products, sortColumnInfo));
   const [showUploadModal, setShowUploadModal] = useState(false);

   useEffect(() => {
      setSortedProducts(sortProducts(products, sortColumnInfo));
   }, [sortColumnInfo.dataName, sortColumnInfo.reverse, products]);
   
  function handleUpload(file) {
    console.log("Uploaded XLSX:", file);

    // Later you can parse it with SheetJS/xlsx here.
  }

  return (
    <PageContainer bg="alt1">
      <UploadXlsxModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
      <div className="mx-auto bg-white rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Product Management</h1>

          <div onClick={() => setShowUploadModal(true)}>Update via spreadsheet</div>
           {/* <Button_A button_name="Update via spreadsheet" link_val="" button_styles_outer={{ marginTop: "1.5rem"}}/> */}
          <Button_A button_name="+ Add Product" link_val="/admin/add_product" button_styles_outer={{ marginTop: "1.5rem"}}/>
        </div>
        { productsLoading ? <TailwindSpinner/> 
        :
        <table className="w-full table-auto border-collapse select-none">
          <thead>
            <tr className="bg-hmc-button-text-b">
              {productEditFields.map(({ label, column_name }, index) => (
                <th
                  key={index + label}
                  className="pl-3 pr-6 pt-3 pb-3 border-b text-left align-top leading-none select-none relative"
                  onClick={() => setSortColumnInfo({ name: column_name, reverse: !sortColumnInfo.reverse })}
                >
                  {label}
                  {name === sortColumnInfo.name ? 
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
            {sortedProducts.map((product) => {
              return (
                <ProductDisplayRow
                  key={product.id}
                  product={product}
                  productEditFields={productEditFields}
                />
              )})}
          </tbody>
        </table>
        }
      </div>
    </PageContainer>
  );
}

function ProductDisplayRow({ product, productEditFields }) {
  const {size_charts, metal_types, product_categories} =  useSelector(state =>  state.products.productAttributes);
  const { metalLabel, sizeLabel, productCategoryLabels } = getProductPropDisplayLabel({ metal_type: product.metal_type, size_chart: product.size_chart, size_charts, metal_types });

    return (
        <tr key={product.id + "tr"} className="hover:bg-gray-50 transition-colors">
              {productEditFields.map(({ id, column_name, input_type }, index) => (
                <td
                  key={id}
                  className="p-3 border-b border-hmc-button-text-b text-left align-top"
                >
                  {getCellValue({column_name, input_type, product, size_charts, metal_types, product_categories }) }
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
                  <div onClick={() => dispatch({ type: 'DELETE_PRODUCT', payload: product.id })}>
                    <TrashIcon />
                  </div>
                </div>
              </td>
            </tr>

    )
}

function getCellValue({ column_name, input_type, product, size_charts, metal_types, product_categories }){
  const value = product[column_name];
  const lookups= { size_chart: size_charts, metal_types, product_categories}; // note: hack product property is called size_chart but the lookup name is size_charts, so we need to map it here

  switch (input_type) {
    case "array_lookup":
      let columnLookups = lookups[column_name];
      return value.map((lookupId) => columnLookups.find((column) => column.id ===  lookupId).label).join(", ");
    case "checkbox":
      return value === true ? "Yes" : "No";
    default:
      return value;
  }
}