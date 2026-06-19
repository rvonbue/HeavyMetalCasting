import { Link } from "react-router-dom";
import { PriceComponent, ProductImage } from "../Resuables.jsx";

export default function ProductCard({ product }) {
    const thumbSrc = product?.product_images?.[0]?.thumbnail_url;

    return (
      <div className="select-none grid grid-rows-[auto_1fr] gap-2">
        <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden border border-[var(--color-hmc-border-b)]">
          <ProductImage
            src={thumbSrc}
            alt={product.name}
            bgVar="card"
            className="w-full h-full object-contain"
          />
        </Link>
        <div className="text-hmc-text-a leading-loose">
          <div className="text-base font-semibold">{product.name}</div>
          <div className="text-sm text-hmc-b font-semibold"><PriceComponent price={product.price} /></div>
        </div>
      </div>
    );
}
