import { Link } from "react-router-dom";
import { getProductImageLinks } from "../Resuables.jsx";
import { CartIcon } from "../../styles/Icons.jsx";
import { Button_A } from "../Resuables.jsx";

export default function ProductCard({ product }) {
    const { heroImgLink } = getProductImageLinks(product);

    return (
      <div className="p-4 select-none">
        <Link to={`/product/${product.id}`}>
          <img
            src={`${heroImgLink.pathFile}`}
            alt={`Thumbnail`}
            className="p-4 max-w-full max-h-full object-contain border-1 border-[var(--color-hmc-border-b)] min-h-[300px]"
          />
        </Link>
        <div className="text-hmc-text-a mt-2">
            <div className="text-base font-semibold">{product.name}</div>
          <div className="text-md mt-2 ">{product.price}</div>
          <div className="flex mt-4">
            <Button_A button_name="Add to Cart" button_styles_outer={{ marginRight: "0.5rem"  }} /> 
            {/* <CartIcon/> */}
          </div>
        </div>
      </div>
    );
}

