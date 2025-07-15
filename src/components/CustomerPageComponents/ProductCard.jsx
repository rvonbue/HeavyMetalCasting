import {  productImageLinks, imgPlaceholder } from "../../staticData/PathData.js";

export default function ProductCard({ product }) {
    let imgSrc = product.images.length > 0 ? `${productImageLinks}${product.images[0]}` : `${imgPlaceholder}`;

    return (
      <div className="p-4 select-none">
        <img
          src={imgSrc}
          alt={`Thumbnail`}
          className="p-4 max-w-full max-h-full object-contain border-1 border-[var(--color-hmc-border-b)] min-h-[300px]"
        />
        <div className="text-hmc-text-a mt-2">
           <div className="text-base font-semibold">{product.name}</div>
           <div className="text-sm">{product.price}</div>
        </div>
      </div>
    );
}

