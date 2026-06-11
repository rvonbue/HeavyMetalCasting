import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ThumbnailCarousel({
  imgs,
  selectedImageIndex,
  setSelectedImageIndex,
  productName,
}) {
  const scrollRef = useRef(null);

  function scrollThumbnails(direction) {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -180 : 180,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative mt-4 w-full px-10">
        <button
        type="button"
        onClick={() => scrollThumbnails("left")}
        className="
          absolute
          left-0
          top-1/2
          z-20
          -translate-y-1/2
          px-2
          text-hmc-c
          hover:scale-110
          transition-transform
          hover:text-hmc-b transition-colors
        "
      >
        <ChevronLeft size={48} strokeWidth={3} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth px-2 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {imgs.map((img, index) => (
          <button
            key={img.id || index}
            type="button"
            
            onClick={() => setSelectedImageIndex(index)}
            className={`h-20 w-20 flex-none cursor-pointer rounded border-[0.5px] p-1 hover:text-hmc-b transition-colors${
              selectedImageIndex === index
                ? "border-hmc-b"
                : "border-gray-300"
            }`}
          >

            
            <img
              src={img.thumbnail_url || img.image_url}
              alt={`${productName || "Product"} thumbnail ${index + 1}`}
              className="h-full w-full object-contain"
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollThumbnails("right")}
        className="
          absolute
          right-0
          top-1/2
          z-20
          -translate-y-1/2
          px-2
          text-hmc-c
          hover:scale-110
          transition-transform
          cursor-pointer
          hover:text-hmc-b transition-colors
        "
      >
         <ChevronRight
    size={56}
    strokeWidth={2.5}
    className="
      transition-transform
      duration-300
      group-hover:translate-x-1
    "
  />
      </button>
    </div>
  );
}