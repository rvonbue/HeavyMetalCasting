import { Link } from "react-router-dom";
import Select from 'react-select';
import { Controller } from "react-hook-form";

import {productImageLinks} from "../staticData/PathData.js";

export function Button_A({button_name, link_val, button_type, button_styles_outer, isActive, extraClassNames, onClick }) {
  return (
    <>      
      {button_type === "form" ? (
  <div
    className=" bg-hmc-button-a font-bold transition hover:bg-hmc-button-b hover:text-hmc-b"
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
export const PageContainer = ({ children, bg, fullScreen, widthClass }) => {
  const width = widthClass ?? (fullScreen ? "max-w-none w-full" : "max-w-[1280px]");
  return (
    <div
      className={`
        ${width}
        mx-auto
        ${bg === "alt1" ? "bg-white" : bg === "admin" ? "bg-hmc-bodybackground" : "bg-hmc-bg-a"}

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
    backgroundColor: "var(--color-hmc-panelbackground)",
    borderColor: state.isFocused
      ? "var(--color-hmc-c)"
      : "var(--color-hmc-border-b)",
    boxShadow: "none",
    "&:hover": {
      borderColor: "var(--color-hmc-c)",
    },
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: "var(--color-hmc-panelbackground)",
    border: "1px solid var(--color-hmc-border-b)",
    zIndex: 9999,
  }),

  option: (base, state) => ({
    ...base,
    fontSize: "13px",
    cursor: "pointer",
    backgroundColor: state.isSelected || state.isFocused
      ? "var(--color-hmc-button-b)"
      : "var(--color-hmc-panelbackground)",
    color: "var(--color-hmc-textprimary)",
    ":active": {
      backgroundColor: "var(--color-hmc-button-b)",
    },
  }),

  singleValue: (base) => ({
    ...base,
    color: "var(--color-hmc-textprimary)",
  }),

  placeholder: (base) => ({
    ...base,
    color: "var(--color-hmc-textprimary)",
    opacity: 0.7,
  }),

  input: (base) => ({
    ...base,
    color: "var(--color-hmc-textprimary)",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: "var(--color-hmc-textprimary)",
  }),

  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: "var(--color-hmc-border-b)",
  }),

  multiValue: (base) => ({
    ...base,
    backgroundColor: "var(--color-hmc-button-b)",
  }),

  multiValueLabel: (base) => ({
    ...base,
    color: "var(--color-hmc-textprimary)",
    fontSize: "11px",
  }),

  multiValueRemove: (base) => ({
    ...base,
    color: "var(--color-hmc-textprimary)",
    ":hover": {
      backgroundColor: "var(--color-hmc-c)",
      color: "var(--color-hmc-panelbackground)",
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
  controlBg,
  ...rest
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
        control: (base, state) => ({
          ...hmcSelectStyles.control(base, state),
          ...(controlBg ? { backgroundColor: controlBg } : {}),
        }),
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999,
        }),
      }}
      className={`text-sm ${className}`}
      classNamePrefix="hmc-select"
      {...rest}
    />
  );
}

export function ImgPlaceholder({}) {
  return (
    <div className="flex h-full w-full items-center justify-center border border-hmc-border-a bg-hmc-panelbackground">
      <span className="text-sm text-hmc-textprimary">No Image Available</span>
    </div>
  )
}

export function ProductImage({ src, alt = '', className = '', bgVar = 'hero' }) {
  const bgClass = bgVar === 'thumb' ? 'bg-hmc-img-bg-thumb' : bgVar === 'card' ? 'bg-hmc-img-bg-card' : 'bg-hmc-img-bg-hero';
  if (!src) {
    return (
      <div className={`${bgClass} ${className} flex items-center justify-center`}>
        <span className="text-xs tracking-widest uppercase opacity-50 text-hmc-textprimary text-center px-2">
          Image Coming Soon
        </span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={`${bgClass} ${className}`} />;
}

export function AdminPageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6 border-b border-hmc-border-b pb-4">
      <div>
        <h1 className="text-2xl font-bold text-hmc-textprimary">{title}</h1>
        {subtitle && <p className="text-xs text-hmc-textprimary opacity-60 mt-1 select-none">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
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
        text-sm font-bold
        transition
        ${isDisabled ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
        ${
          isActive
            ? 'bg-hmc-button-a text-hmc-textsecondary'
            : 'bg-hmc-button-b text-hmc-textprimary hover:bg-hmc-button-b hover:text-hmc-textsecondary'
        }
      `}
      style={button_styles_outer}
    >
      {button_name}
    </button>
  )
}