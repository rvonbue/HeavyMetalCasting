import { Link } from "react-router-dom";
import { CartIcon } from "../../styles/Icons.jsx";
import { Button_A, PriceComponent } from "../Resuables.jsx";

export default function ProductCard({ product }) {
    const thumbSrc =  product?.product_images?.[0]?.thumbnail_url;

    return (
      <div className="p-4 select-none">
        <Link to={`/product/${product.id}`}>
          <img
            src={thumbSrc}
            alt={`Thumbnail`}
            className="w-full h-full object-contain border-1 border-[var(--color-hmc-border-b)]"
          />
        </Link>
        <div className="text-hmc-text-a mt-2">
            <div className="text-base font-semibold">{product.name}</div>
          <div className="text-sm mt-1 text-hmc-b font-semibold"><PriceComponent price={product.price} /></div>
          <div className="flex mt-4">
            {/* <Button_A button_name="Add to Cart" button_styles_outer={{ marginRight: "0.5rem"  }} />  */}
            {/* <CartIcon/> */}
          </div>
        </div>
      </div>
    );
}
