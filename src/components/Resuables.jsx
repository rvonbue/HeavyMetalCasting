import { Link } from "react-router-dom";
import Select from 'react-select';
import { Controller } from "react-hook-form";

import {productImageLinks} from "../staticData/PathData.js";

export function Button_A({button_name, link_val, button_type, button_styles_outer, isActive, extraClassNames, onClick }) {
  return (
    <>      
      {button_type === "form" ? (
  <div
    className=" bg-hmc-button-a px-2 py-1 font-bold transition hover:bg-hmc-button-b hover:text-hmc-b"
    style={button_styles_outer}
  >
    <button
      type="submit"
      className="cursor-pointer"
      style={{ color: "inherit", backgroundColor: "inherit" }}
    >
      {button_name}
    </button>
  </div>
) : button_type === "onClick" ? (
  <button
    type="button"
    onClick={onClick}
    className={`
        ${extraClassNames}
        px-2 py-2
        text-sm font-bold
        transition
        cursor-pointer

        ${
          isActive
            ? `
              bg-hmc-button-a
              text-hmc-textsecondary
            `
            : `
              bg-hmc-button-b
              text-hmc-textprimary
              hover:border-hmc-textsecondary
              hover:bg-hmc-button-b
              hover:text-hmc-textsecondary
            `
        }
      `}
    style={button_styles_outer}
  >
    {button_name}
  </button>
) : (
  <div className="flex font-bold hover:text-hmc-b">
    <Link
      to={link_val}
      className={`
        ${extraClassNames}
        px-2 py-2
        text-sm font-bold
        transition
        cursor-pointer

        ${
          isActive
            ? `
              bg-hmc-button-a
              text-hmc-textsecondary
            `
            : `
              bg-hmc-button-b
              text-hmc-textprimary
              hover:border-hmc-textsecondary
              hover:bg-hmc-button-b
              hover:text-hmc-textsecondary
            `
        }
      `}
    >
      {button_name}
    </Link>
  </div>
)}
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
        className={`absolute left-[-20px] top-0 h-10 w-8 z-[-1] -t-md transform -skew-x-[20deg] ${
          selected ? 'bg-hmc-button-b' : 'bg-hmc-button-a'
        }`}
      />
      {/* Right Skew */}
      <div
        className={`absolute right-[-20px] top-0 h-10 w-8 z-[-1] -t-md transform skew-x-[20deg] ${
          selected ? 'bg-hmc-button-b' : 'bg-hmc-button-a'
        }`}
      />
      {/* Main Tab */}
      <div
        className={`h-10 px-4 flex items-center -t-md z-[1] relative ${
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
    <div
      className={`
        max-w-[1280px]
        mx-auto
        ${bg === "alt1" ? "bg-white" : "bg-hmc-bg-a"}
        
        shadow
        py-[12px] 
        px-[24px]
        h-full
        flex
        flex-col
        overflow-auto
      `}
    >
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



const hmcSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "38px",
    borderColor: state.isFocused
      ? "var(--color-hmc-c)"
      : "rgba(107, 91, 75, 0.35)",
    boxShadow: state.isFocused
      ? "0 0 0 1px rgba(176, 141, 87, 0.35)"
      : "none",
    "&:hover": {
      borderColor: "var(--color-hmc-c)",
    },
  }),

  option: (base, state) => ({
    ...base,
    fontSize: "13px",
    backgroundColor: state.isSelected
      ? "var(--color-hmc-panelbackground)"
      : state.isFocused
        ? "var(--color-hmc-panelbackground)"
        : "white",
    color: state.isSelected ? "var(--color-hmc-textprimary)" : "var(--color-hmc-textprimary)",
  }),

  multiValue: (base) => ({
    ...base,
    backgroundColor: "rgba(176, 141, 87, 0.15)",
  }),

  multiValueLabel: (base) => ({
    ...base,
    color: "var(--color-hmc-textprimary)",
    fontSize: "11px",
  }),

  multiValueRemove: (base) => ({
    ...base,
    color: "var(--color-hmc-c)",
    ":hover": {
      backgroundColor: "var(--color-hmc-c)",
      color: "white",
    },
  }),
};

export function HmcSelect({
  options = [],
  value,
  onChange,
  isMulti = false,
  placeholder = "Select...",
  className = "",
}) {
  return (
    <Select
      isMulti={isMulti}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      menuPortalTarget={document.getElementById("hmc-theme-root")}
      styles={{
        ...hmcSelectStyles,
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999,
        }),
        menu: (base) => ({
          ...base,
          zIndex: 9999,
        }),
      }}
      className={`text-sm ${className}`}
      classNamePrefix="hmc-select"
    />
  );
}

export function ImgPlaceholder({}) {

  return (

    <div className="flex h-full w-full items-center justify-center border border-hmc-border-a bg-hmc-panelbackground">
  <span className="text-sm text-hmc-textprimary">
    No Image Available
  </span>
</div>
  )
}

export function PriceComponent({price}) {
  if(price === 0 ) return <span>Price Unavailable</span>
  else return <span>${Number(price).toFixed(2)}</span>
}

export function TwoColumnLayout({ left, right }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

export function OptionButton({button_name, button_styles_outer, isActive, isDisabled, extraClassNames, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${extraClassNames}
        px-2 py-2
        text-sm font-bold
        transition
        ${isDisabled ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
        ${
          isActive
            ? 'bg-hmc-button-a text-hmc-textsecondary'
            : 'bg-hmc-button-b text-hmc-textprimary hover:border-hmc-textsecondary hover:bg-hmc-button-b hover:text-hmc-textsecondary'
        }
      `}
      style={button_styles_outer}
    >
      {button_name}
    </button>
  )
}