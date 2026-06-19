import { Link } from "react-router-dom";
import { CartIcon } from "../../styles/Icons.jsx";
import { Button_A, PriceComponent } from "../Resuables.jsx";

export default function ProductCard({ product }) {
    const thumbSrc =  product?.product_images?.[0]?.thumbnail_url;

    return (
      <div className="select-none grid grid-rows-[auto_1fr] gap-2">
        <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden border border-[var(--color-hmc-border-b)]">
          <img
            src={thumbSrc}
            alt={`Thumbnail`}
            className="w-full h-full object-contain"
          />
        </Link>
        <div className="text-hmc-text-a leading-loose">
            <div className="text-base font-semibold">{product.name}</div>
          <div className="text-sm text-hmc-b font-semibold"><PriceComponent price={product.price} /></div>
          <div className="flex mt-4">
            {/* <Button_A button_name="Add to Cart" button_styles_outer={{ marginRight: "0.5rem"  }} />  */}
            {/* <CartIcon/> */}
          </div>
        </div>
      </div>
    );
}
