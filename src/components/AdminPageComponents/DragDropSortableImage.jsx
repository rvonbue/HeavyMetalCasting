import { Trash2 } from "lucide-react";
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
import { CSS } from "@dnd-kit/utilities";


export default function SortableImage({ image, index, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative w-full aspect-square cursor-grab rounded bg-gray-100 overflow-hidden flex items-center justify-center"
    >
      <img
        src={image.thumbnail_url || image.image_url}
        alt={`Thumbnail ${index}`}
        className="max-h-full max-w-full object-contain"
      />

      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(image);
        }}
        className="absolute right-2 top-2 hidden rounded bg-red-600 p-2 text-white shadow group-hover:block"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}