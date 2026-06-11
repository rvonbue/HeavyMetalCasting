import SortableImage from "./DragDropSortableImage";
import { useDispatch } from 'react-redux';
import { toast } from "sonner";

import { deleteProductImage, updateProductImageSortOrder } from '../../api/productEditAPI';
import { FormLabel } from "../../components/Resuables";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { removeProductImage, reorderProductImages  } from "../../store/productsSlice";

export default function ProductImageGrid({ product }) {
  const { product_images } = product;
  const dispatch = useDispatch();

  async function handleReorderImages(reorderedImages) {
    try {
      const updatedImages = await updateProductImageSortOrder(reorderedImages);

      dispatch(
        reorderProductImages({
          productId: product.id,
          images: updatedImages,
        })
      );

      toast.success("Image order updated");
    } catch (error) {
      console.error(error);

      toast.error(error?.message || "Failed to update image order", {
        duration: Infinity,
      });
    }
  }
  async function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = product_images.findIndex(
      (image) => image.id === active.id
    );

    const newIndex = product_images.findIndex(
      (image) => image.id === over.id
    );

    const reorderedImages = arrayMove(
      product_images,
      oldIndex,
      newIndex
    ).map((image, index) => ({
      ...image,
      sort_order: index,
    }));

    handleReorderImages(reorderedImages);
  }
  async function handleDeleteImage(image) {
    await deleteProductImage(image);

    dispatch(
      removeProductImage({
        productId: image.product_id,
        imageId: image.id,
      })
    );

    toast.success("Image deleted");
  }
   
  return (
  <div className="h-full overflow-y-auto ">
    <label className={`mb-1 block font-bold text-left underline`}>{"Image Gallery"}</label>
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={product_images.map((image) => image.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3">
          {product_images.map((image, index) => (
            <SortableImage
              key={image.id}
              image={image}
              index={index}
              onDelete={handleDeleteImage}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  </div>
  );
};