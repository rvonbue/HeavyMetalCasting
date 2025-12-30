import { Link } from "react-router-dom";
import Select from 'react-select';

import {productImageLinks} from "../staticData/PathData.js";

export function Button_A({button_name, link_val, button_type, button_styles_outer }) {
  return (
    <>      
      {button_type === "form" ? 
        <div className="text-hmc-a hover:text-hmc-b bg-hmc-button-a hover:bg-hmc-button-b hover:text-avocado-600 px-5 py-2 rounded transition font-bold cursor-pointer"
          style={button_styles_outer}
        >
          <button 
            type="submit"
            className="cursor-pointer"
            style={ { color: "inherit", backgroundColor: "inherit",}}
          >
            {button_name}
          </button> 
        </div>
        : button_type === "onClick" ?
          <div className="text-hmc-a hover:text-hmc-b font-bold">
            {button_name}
          </div> 
        :
          <div className="text-hmc-a hover:text-hmc-b font-bold">
            <Link
              to={link_val}
              className="bg-hmc-button-a hover:bg-hmc-button-b hover:text-avocado-600 px-5 py-2 rounded transition font-bold"
              style={{ color: "inherit" , ...button_styles_outer}}
            >
              {button_name}
            </Link>
          </div>
      }
    </>

  )
}

export function FolderTab({ label, labelStatus, selected, onClick }) {
  return (
    <div
      className={`relative inline-block cursor-pointer mr-12 top-2 z-[${
        selected ? 30 : 20
      }]`}
      onClick={onClick}
    >
      {/* Left Skew */}
      <div
        className={`absolute left-[-20px] top-0 h-10 w-8 z-[-1] rounded-t-md transform -skew-x-[20deg] ${
          selected ? 'bg-hmc-button-b' : 'bg-hmc-button-a'
        }`}
      />
      {/* Right Skew */}
      <div
        className={`absolute right-[-20px] top-0 h-10 w-8 z-[-1] rounded-t-md transform skew-x-[20deg] ${
          selected ? 'bg-hmc-button-b' : 'bg-hmc-button-a'
        }`}
      />
      {/* Main Tab */}
      <div
        className={`h-10 px-4 flex items-center rounded-t-md z-[1] relative ${
          selected
            ? 'bg-hmc-button-b text-hmc-button-text-b font-semibold'
            : 'bg-hmc-button-a text-hmc-button-text-a'
        }`}
      >
        {label}{labelStatus ? <div className="!font-black ml-2 text-hmc-button-text-a">{labelStatus}</div> : null}
      </div>
    </div>
  );
}

export const PageContainer = ({ children, bg }) => {
  return (
    <div className={`max-w-[1280px] mx-auto ${bg === "alt1" ? "bg-white" : "bg-hmc-bg-a"} rounded shadow p-6`}> 
      {children}
    </div>
  );
};

export const FormLabel = ({ labelName, classNames, children }) => {
  return (
    <label className={`mb-1 whitespace-nowrap font-bold ${classNames ? classNames : ""}`}>{labelName}</label>
  );
};

export function MultiSelectDropdown({ ptions }) {
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleChange = (selected) => {
      setSelectedOptions(selected);
    };

    return (
        <Select
            isMulti
            name="colors"
            options={options}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleChange}
            value={selectedOptions}
        />
    );
}

export function getProductById(products, productId) {
  return products.find((product) => product.id === parseInt(productId));
};

export function getProductImageLinks(product) {
  const images = product && Array.isArray(product.images) ? product.images : [];
  const heroImgLink = images.length > 0 ? images[0] : null;
  const imgs = images.length > 1 ? images.slice(1) : [];

  return heroImgLink ?  { 
    heroImgLink: { ...heroImgLink, pathFile: `${productImageLinks}${heroImgLink.filename}` }, 
    imgs: imgs.map(img => ({...img, pathFile: `${productImageLinks}${img.filename}`}))

  } : { heroImgLink: { filename: 'placeholder.png' }, imgs: [] };
} 


export function addItemtoCart(product) {
  // Implementation for adding item to cart
  console.log(`Adding product ${product.name} to cart.`);
}