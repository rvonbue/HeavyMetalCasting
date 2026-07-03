import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { PageContainer, AdminPageHeader, HmcSelect } from "../../components/Resuables";
import Modal from "../../components/modal/Modal";
import {
  createShopBlockAPI,
  updateShopBlockAPI,
  deleteShopBlockAPI,
  updateShopBlocksLayoutAPI,
} from "../../api/adminAPI";
import {
  setShopBlocks,
  addShopBlock,
  updateShopBlock,
  removeShopBlock,
} from "../../store/adminSlice";

const SIMPLE_TYPES = ["text", "textarea", "checkbox", "float", "number", "string"];

const BLOCK_TYPE_OPTIONS = [
  { value: "product", label: "Product field" },
  { value: "widget", label: "Widget" },
  { value: "user", label: "Custom text" },
];

const WIDGET_OPTIONS = [
  { value: "metal_selector", label: "Metal Selector" },
  { value: "size_selector", label: "Size Selector" },
  { value: "buy_controls", label: "Quantity + Add to Cart" },
  { value: "stock_status", label: "Stock Status (live)" },
];
const WIDGET_LABELS = Object.fromEntries(WIDGET_OPTIONS.map((o) => [o.value, o.label]));

// Groups blocks into a 2D array of rows (each a list of blocks ordered by col).
function buildLayout(blocks) {
  const byRow = new Map();
  for (const b of blocks) {
    const r = b.grid_row ?? 1;
    if (!byRow.has(r)) byRow.set(r, []);
    byRow.get(r).push(b);
  }
  return [...byRow.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, items]) => items.sort((x, y) => (x.grid_col ?? 0) - (y.grid_col ?? 0)));
}

function blockSummary(block) {
  if (block.block_type === "widget") return WIDGET_LABELS[block.component] || block.component;
  if (block.block_type === "user") return block.content || "(empty text)";
  return (
    block.admin_product_fields?.label ||
    block.admin_product_fields?.column_name ||
    "Product field"
  );
}

function SortableBlockCard({ block, onDelete, onEditContent }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex w-52 flex-none flex-col gap-2 rounded border border-hmc-border-a bg-hmc-panelbackground p-2"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="cursor-grab text-lg leading-none text-hmc-textprimary hover:text-hmc-c"
          aria-label="Drag to reposition"
          {...attributes}
          {...listeners}
        >
          ⠿
        </button>
        <span className="text-[10px] font-bold uppercase tracking-wide text-hmc-textprimary/60">
          {block.block_type}
        </span>
        <button
          type="button"
          onClick={() => onDelete(block)}
          className="ml-auto text-xs text-hmc-error hover:opacity-70"
          aria-label="Remove block"
        >
          ✕
        </button>
      </div>

      {block.block_type === "user" ? (
        <input
          type="text"
          defaultValue={block.content ?? ""}
          onBlur={(e) => onEditContent(block, e.target.value)}
          placeholder="Custom text…"
          className="w-full rounded border border-hmc-b/30 bg-white px-2 py-1 text-xs text-hmc-textprimary focus:border-hmc-c focus:outline-none focus:ring-1 focus:ring-hmc-c/30"
        />
      ) : (
        <span className="text-sm text-hmc-textprimary">{blockSummary(block)}</span>
      )}
    </div>
  );
}

function AppendGhost({ rowIndex }) {
  const { setNodeRef, isOver } = useDroppable({ id: `append-${rowIndex}` });
  return (
    <div
      ref={setNodeRef}
      className={`flex h-[70px] w-12 flex-none items-center justify-center rounded border border-dashed text-lg ${
        isOver
          ? "border-hmc-c bg-hmc-button-a/20 text-hmc-c"
          : "border-hmc-border-a text-hmc-textprimary/40"
      }`}
    >
      +
    </div>
  );
}

function NewRowGhost() {
  const { setNodeRef, isOver } = useDroppable({ id: "newrow" });
  return (
    <div
      ref={setNodeRef}
      className={`flex h-12 items-center justify-center rounded border border-dashed text-xs uppercase tracking-wide ${
        isOver
          ? "border-hmc-c bg-hmc-button-a/20 text-hmc-c"
          : "border-hmc-border-a text-hmc-textprimary/40"
      }`}
    >
      Drop here for a new row
    </div>
  );
}

function AddBlockModal({ isOpen, onClose, productFieldOptions, onCreate }) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { block_type: "product", field_id: "", component: "", content: "" },
  });

  const blockType = useWatch({ control, name: "block_type" });

  async function onSubmit(values) {
    try {
      await onCreate(values);
      reset();
      onClose();
    } catch {
      // onCreate toasted; keep the modal open.
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Block"
      maxWidth="max-w-md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border border-hmc-border-a text-hmc-textprimary hover:bg-hmc-button-a/20"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-block-form"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm bg-hmc-button-a text-hmc-button-text-a font-bold hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Adding…" : "Add Block"}
          </button>
        </>
      }
    >
      <form id="add-block-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-hmc-textprimary">
            Block type
          </label>
          <Controller
            name="block_type"
            control={control}
            render={({ field }) => (
              <HmcSelect
                options={BLOCK_TYPE_OPTIONS}
                value={BLOCK_TYPE_OPTIONS.find((o) => o.value === field.value) ?? null}
                onChange={(option) => field.onChange(option?.value ?? "")}
                isSearchable={false}
              />
            )}
          />
        </div>

        {blockType === "product" && (
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-hmc-textprimary">
              Product field
            </label>
            <Controller
              name="field_id"
              control={control}
              rules={{ validate: (v) => (blockType !== "product" || v ? true : "Cannot be blank") }}
              render={({ field }) => (
                <HmcSelect
                  options={productFieldOptions}
                  value={productFieldOptions.find((o) => o.value === field.value) ?? null}
                  onChange={(option) => field.onChange(option?.value ?? "")}
                />
              )}
            />
            {errors.field_id && (
              <p className="mt-1 text-xs font-medium text-red-600">{errors.field_id.message}</p>
            )}
          </div>
        )}

        {blockType === "widget" && (
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-hmc-textprimary">
              Widget
            </label>
            <Controller
              name="component"
              control={control}
              rules={{ validate: (v) => (blockType !== "widget" || v ? true : "Cannot be blank") }}
              render={({ field }) => (
                <HmcSelect
                  options={WIDGET_OPTIONS}
                  value={WIDGET_OPTIONS.find((o) => o.value === field.value) ?? null}
                  onChange={(option) => field.onChange(option?.value ?? "")}
                  isSearchable={false}
                />
              )}
            />
            {errors.component && (
              <p className="mt-1 text-xs font-medium text-red-600">{errors.component.message}</p>
            )}
          </div>
        )}

        {blockType === "user" && (
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-hmc-textprimary">
              Text
            </label>
            <Controller
              name="content"
              control={control}
              rules={{ validate: (v) => (blockType !== "user" || (v && v.trim()) ? true : "Cannot be blank") }}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  className="w-full rounded border border-hmc-b/30 bg-white px-3 py-2 text-sm text-hmc-textprimary focus:border-hmc-c focus:outline-none focus:ring-1 focus:ring-hmc-c/30"
                />
              )}
            />
            {errors.content && (
              <p className="mt-1 text-xs font-medium text-red-600">{errors.content.message}</p>
            )}
          </div>
        )}
      </form>
    </Modal>
  );
}

export default function ProductFieldsPage() {
  const dispatch = useDispatch();
  const blocks = useSelector((state) => state.admin.shopBlocks);
  const productEditFields = useSelector((state) => state.admin.productEditFields);
  const adminDataLoaded = useSelector((state) => state.admin.adminDataLoaded);
  const [showAddModal, setShowAddModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const layout = useMemo(() => buildLayout(blocks ?? []), [blocks]);
  const blockIds = useMemo(() => (blocks ?? []).map((b) => b.id), [blocks]);

  const productFieldOptions = useMemo(
    () =>
      (productEditFields ?? [])
        .filter((f) => f.column_name !== "live" && SIMPLE_TYPES.includes(f.input_type))
        .map((f) => ({ value: f.id, label: f.label || f.column_name })),
    [productEditFields]
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || over.id === active.id) return;

    const newLayout = buildLayout(blocks ?? []).map((row) => [...row]);

    // Remove the dragged block from its current position.
    let activeBlock = null;
    for (const row of newLayout) {
      const idx = row.findIndex((b) => b.id === active.id);
      if (idx !== -1) {
        activeBlock = row[idx];
        row.splice(idx, 1);
        break;
      }
    }
    if (!activeBlock) return;

    const overId = over.id;
    if (overId === "newrow") {
      newLayout.push([activeBlock]);
    } else if (typeof overId === "string" && overId.startsWith("append-")) {
      const i = parseInt(overId.slice("append-".length), 10);
      if (newLayout[i]) newLayout[i].push(activeBlock);
      else newLayout.push([activeBlock]);
    } else {
      let placed = false;
      for (const row of newLayout) {
        const idx = row.findIndex((b) => b.id === overId);
        if (idx !== -1) {
          row.splice(idx, 0, activeBlock);
          placed = true;
          break;
        }
      }
      if (!placed) newLayout.push([activeBlock]);
    }

    // Drop empty rows and reassign grid positions.
    const cleaned = newLayout.filter((row) => row.length > 0);
    const updatedBlocks = [];
    cleaned.forEach((row, rIdx) =>
      row.forEach((b, cIdx) =>
        updatedBlocks.push({ ...b, grid_row: rIdx + 1, grid_col: cIdx })
      )
    );

    const prev = blocks;
    dispatch(setShopBlocks(updatedBlocks));

    const changed = updatedBlocks
      .filter((b) => {
        const old = prev.find((o) => o.id === b.id);
        return !old || old.grid_row !== b.grid_row || old.grid_col !== b.grid_col;
      })
      .map((b) => ({ id: b.id, grid_row: b.grid_row, grid_col: b.grid_col }));

    updateShopBlocksLayoutAPI(changed).catch((err) => {
      console.error(err);
      toast.error("Failed to save layout");
      dispatch(setShopBlocks(prev));
    });
  }

  async function handleAddBlock(values) {
    const maxRow = (blocks ?? []).reduce((m, b) => Math.max(m, b.grid_row ?? 0), 0);
    const payload = { block_type: values.block_type, grid_row: maxRow + 1, grid_col: 0 };
    if (values.block_type === "product") payload.field_id = values.field_id;
    if (values.block_type === "widget") payload.component = values.component;
    if (values.block_type === "user") payload.content = values.content ?? "";

    try {
      const created = await createShopBlockAPI(payload);
      dispatch(addShopBlock(created));
      toast.success("Block added");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to add block");
      throw err;
    }
  }

  async function handleDeleteBlock(block) {
    const prev = blocks;
    dispatch(removeShopBlock(block.id));
    try {
      await deleteShopBlockAPI(block.id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete block");
      dispatch(setShopBlocks(prev));
    }
  }

  async function handleEditContent(block, value) {
    if (value === (block.content ?? "")) return;
    const prev = blocks;
    dispatch(updateShopBlock({ id: block.id, content: value }));
    try {
      const saved = await updateShopBlockAPI({ id: block.id, updates: { content: value } });
      dispatch(updateShopBlock(saved));
    } catch (err) {
      console.error(err);
      toast.error("Failed to save text");
      dispatch(setShopBlocks(prev));
    }
  }

  return (
    <PageContainer bg="admin">
      <AddBlockModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        productFieldOptions={productFieldOptions}
        onCreate={handleAddBlock}
      />

      <AdminPageHeader
        title="Shop Page Layout"
        action={
          <div className="flex items-center gap-4">
            <p className="max-w-md text-right text-xs text-hmc-textprimary/70">
              Arrange the product page. Drag blocks to reposition; drop on a “+” to add a
              column, or the bottom bar to start a new row.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-none px-4 py-2 text-sm bg-hmc-button-a text-hmc-button-text-a font-bold hover:opacity-90"
            >
              + Add Block
            </button>
          </div>
        }
      />

      <div className="mt-4">
        {!adminDataLoaded ? (
          <div className="p-4 text-sm text-hmc-textprimary">Loading…</div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={blockIds} strategy={rectSortingStrategy}>
              <div className="flex flex-col gap-3">
                {layout.map((row, rIdx) => (
                  <div key={rIdx} className="flex items-stretch gap-3">
                    {row.map((block) => (
                      <SortableBlockCard
                        key={block.id}
                        block={block}
                        onDelete={handleDeleteBlock}
                        onEditContent={handleEditContent}
                      />
                    ))}
                    <AppendGhost rowIndex={rIdx} />
                  </div>
                ))}
                <NewRowGhost />
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </PageContainer>
  );
}
