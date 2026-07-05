import { Link } from "react-router-dom";
import { PriceComponent, ProductImage } from "../Resuables.jsx";

export default function ProductCard({ product }) {
    const thumbSrc = product?.product_images?.[0]?.thumbnail_url;

    // Price range across the product's variants (falling back to the base price).
    const variantPrices = (product.product_variants ?? [])
      .map((v) => Number(v.price ?? product.price))
      .filter((p) => !Number.isNaN(p));
    const prices = variantPrices.length ? variantPrices : [Number(product.price) || 0];
    const lowPrice = Math.min(...prices);
    const highPrice = Math.max(...prices);

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
          <div className="text-sm font-semibold" style={{ color: 'var(--color-hmc-pricing-label)' }}>
            {lowPrice === highPrice ? (
              <PriceComponent price={lowPrice} />
            ) : (
              <span>
                <PriceComponent price={lowPrice} /> - <PriceComponent price={highPrice} />
              </span>
            )}
          </div>
        </div>
      </div>
    );
}
