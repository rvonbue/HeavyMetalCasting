import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "../Resuables";

export default function ThumbnailCarousel({
  imgs,
  selectedImageIndex,
  setSelectedImageIndex,
  productName,
}) {
  const scrollRef = useRef(null);

  const [canScroll, setCanScroll] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  function updateArrowState() {
    const el = scrollRef.current;
    if (!el) return;

    const hasOverflow = el.scrollWidth > el.clientWidth;
    const atStart = el.scrollLeft <= 0;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

    setCanScroll(hasOverflow);
    setShowLeftArrow(hasOverflow && !atStart);
    setShowRightArrow(hasOverflow && !atEnd);
  }

  function scrollThumbnails(direction) {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -180 : 180,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    updateArrowState();

    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateArrowState);
    window.addEventListener("resize", updateArrowState);

    return () => {
      el.removeEventListener("scroll", updateArrowState);
      window.removeEventListener("resize", updateArrowState);
    };
  }, [imgs]);

  return (
    <div className={`relative mt-4 w-full ${canScroll ? "px-10" : "px-0"}`}>
      {canScroll && showLeftArrow && (
        <button
          type="button"
          onClick={() => scrollThumbnails("left")}
          className="absolute left-0 top-1/2 z-20 -translate-y-1/2 -translate-x-4 cursor-pointer text-hmc-c transition-transform hover:scale-110 hover:text-hmc-b"
        >
          <ChevronLeft size={48} strokeWidth={3} />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth px-2 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {imgs.map((img, index) => (
          <button
            key={img.id || index}
            type="button"
            onClick={() => setSelectedImageIndex(index)}
            className={`h-20 w-20 flex-none cursor-pointer border p-0 transition-colors hover:border-hmc-b ${
              selectedImageIndex === index
                ? "border-hmc-b"
                : "border-gray-300"
            }`}
          >
            <ProductImage
              src={img.thumbnail_url || img.image_url}
              alt={`${productName || "Product"} thumbnail ${index + 1}`}
              bgVar="thumb"
              className="h-full w-full object-contain"
            />
          </button>
        ))}
      </div>

      {canScroll && showRightArrow && (
        <button
          type="button"
          onClick={() => scrollThumbnails("right")}
          className="absolute right-0 top-1/2 z-20 -translate-y-1/2 translate-x-4 cursor-pointer text-hmc-c transition-transform hover:scale-110 hover:text-hmc-b"
        >
          <ChevronRight size={56} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}