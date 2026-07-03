import { Fragment, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
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
import { ShopProductLayout } from "../CustomerPages/CustomerProductPage";
import {
  createShopBlockAPI,
  updateShopBlockAPI,
  deleteShopBlockAPI,
} from "../../api/adminAPI";
import { setShopBlocks } from "../../store/adminSlice";
import { setShopBlocks as setProductsShopBlocks } from "../../store/productsSlice";

const SIMPLE_TYPES = ["text", "textarea", "checkbox", "float", "number", "string"];

// Preview viewport modes. `widthClass` clamps the shop-page container to a
// Tailwind breakpoint width, and `viewport` forces the shop layout's breakpoint
// so Mobile actually stacks (Tailwind `lg:` follows the window, not the box).
const PREVIEW_MODES = [
  { value: "mobile", label: "Mobile", widthClass: "max-w-sm", viewport: "mobile" },
  { value: "desktop", label: "Desktop", widthClass: "max-w-[1280px]", viewport: "desktop" },
];

// Blocks added in the editor get a temporary id until "Confirm Changes" persists
// them and swaps in the real database row.
const isTempId = (id) => typeof id === "string" && id.startsWith("temp-");

// Monotonic counter for temp ids — avoids relying on crypto.randomUUID, which
// isn't available over plain HTTP on non-localhost hosts.
let tempIdCounter = 0;
const nextTempId = () => `temp-${Date.now()}-${tempIdCounter++}`;

// Stable string of the persistable fields so we can tell whether the working
// draft differs from the last-saved blocks (drives the Confirm button state).
function serializeBlocks(blocks) {
  return JSON.stringify(
    (blocks ?? [])
      .map((b) => ({
        id: b.id,
        grid_row: b.grid_row ?? null,
        grid_col: b.grid_col ?? null,
        block_type: b.block_type,
        field_id: b.field_id ?? null,
        component: b.component ?? null,
        content: b.content ?? null,
        label: b.label ?? null,
        font_size: b.font_size ?? null,
        show_label: b.show_label ?? true,
      }))
      .sort((a, b) => String(a.id).localeCompare(String(b.id)))
  );
}

const BLOCK_TYPE_OPTIONS = [
  { value: "product", label: "Product field" },
  { value: "widget", label: "Widget" },
  { value: "user", label: "Custom text" },
];

const WIDGET_OPTIONS = [
  { value: "metal_selector", label: "Metal Selector" },
  { value: "size_selector", label: "Size Selector" },
  { value: "quantity", label: "Quantity" },
  { value: "add_to_cart", label: "Add to Cart" },
  { value: "stock_status", label: "Stock Status (live)" },
];
// Includes legacy buy_controls so any pre-split blocks still label correctly.
const WIDGET_LABELS = {
  ...Object.fromEntries(WIDGET_OPTIONS.map((o) => [o.value, o.label])),
  buy_controls: "Quantity + Add to Cart",
};

const FONT_SIZE_OPTIONS = [
  { value: "", label: "Size: default" },
  { value: "xs", label: "XS" },
  { value: "sm", label: "S" },
  { value: "base", label: "M" },
  { value: "lg", label: "L" },
  { value: "xl", label: "XL" },
  { value: "2xl", label: "2XL" },
  { value: "3xl", label: "3XL" },
];

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

function SortableBlockCard({ block, onDelete, onEditContent, onEditLabel, onSetFontSize, onToggleLabel }) {
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

      {block.block_type === "widget" && (
        <input
          type="text"
          defaultValue={block.label ?? ""}
          onBlur={(e) => onEditLabel(block, e.target.value)}
          placeholder="Label…"
          className="w-full rounded border border-hmc-b/30 bg-white px-2 py-1 text-xs text-hmc-textprimary focus:border-hmc-c focus:outline-none focus:ring-1 focus:ring-hmc-c/30"
        />
      )}

      {/* Styling controls */}
      <div className="mt-1 flex items-center gap-2 border-t border-hmc-border-a pt-2">
        <select
          value={block.font_size ?? ""}
          onChange={(e) => onSetFontSize(block, e.target.value || null)}
          className="rounded border border-hmc-b/30 bg-white px-1 py-0.5 text-[11px] text-hmc-textprimary"
        >
          {FONT_SIZE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {block.block_type === "widget" && (
          <label className="flex items-center gap-1 text-[11px] text-hmc-textprimary">
            <input
              type="checkbox"
              checked={block.show_label !== false}
              onChange={(e) => onToggleLabel(block, e.target.checked)}
              className="h-3 w-3"
            />
            Label
          </label>
        )}
      </div>
    </div>
  );
}

// Static copy of a block card rendered inside the DragOverlay so the dragged
// block stays visible above the overflow-clipped editor/preview panels.
function OverlayBlockCard({ block }) {
  return (
    <div className="flex w-52 flex-none cursor-grabbing flex-col gap-2 rounded border border-hmc-c bg-hmc-panelbackground p-2 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-lg leading-none text-hmc-textprimary">⠿</span>
        <span className="text-[10px] font-bold uppercase tracking-wide text-hmc-textprimary/60">
          {block.block_type}
        </span>
      </div>
      <span className="text-sm text-hmc-textprimary">
        {block.block_type === "user" ? block.content || "(empty text)" : blockSummary(block)}
      </span>
    </div>
  );
}

function AppendGhost({ rowIndex }) {
  const { setNodeRef, isOver } = useDroppable({ id: `append-${rowIndex}` });
  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[70px] w-20 flex-none flex-col items-center justify-center gap-1 rounded border border-dashed text-xs font-semibold uppercase tracking-wide transition-colors ${
        isOver
          ? "border-sky-400 bg-sky-200 text-sky-700"
          : "border-hmc-border-a text-hmc-textprimary hover:border-sky-400 hover:bg-sky-100 hover:text-sky-700"
      }`}
    >
      <span className="text-xl leading-none">+</span>
      <span>Column</span>
    </div>
  );
}

// A full-width drop zone that inserts a new row at `index`, pushing later rows
// down. Rendered above every row and below the last one.
function RowInsertGhost({ index }) {
  const { setNodeRef, isOver } = useDroppable({ id: `insertrow-${index}` });
  return (
    <div
      ref={setNodeRef}
      className={`my-1 flex h-9 items-center justify-center gap-2 rounded border border-dashed text-xs font-semibold uppercase tracking-wide transition-colors ${
        isOver
          ? "border-sky-400 bg-sky-200 text-sky-700"
          : "border-hmc-border-a text-hmc-textprimary hover:border-sky-400 hover:bg-sky-100 hover:text-sky-700"
      }`}
    >
      <span className="text-base leading-none">+</span>
      <span>Insert row</span>
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
  const sampleProduct = useSelector((state) => state.products.products?.[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [activeId, setActiveId] = useState(null);
  const [draftBlocks, setDraftBlocks] = useState(blocks ?? []);
  const [saving, setSaving] = useState(false);

  // Reset the working draft whenever the saved blocks change (initial load and
  // after a successful confirm). Edits below only touch the local draft, so this
  // won't clobber unsaved work — the saved blocks only change when we persist.
  useEffect(() => {
    setDraftBlocks(blocks ?? []);
  }, [blocks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const layout = useMemo(() => buildLayout(draftBlocks ?? []), [draftBlocks]);
  const blockIds = useMemo(() => (draftBlocks ?? []).map((b) => b.id), [draftBlocks]);
  const activePreviewMode =
    PREVIEW_MODES.find((m) => m.value === previewMode) ?? PREVIEW_MODES[1];
  const hasChanges = useMemo(
    () => serializeBlocks(draftBlocks) !== serializeBlocks(blocks),
    [draftBlocks, blocks]
  );

  const productFieldOptions = useMemo(
    () =>
      (productEditFields ?? [])
        .filter((f) => f.column_name !== "live" && SIMPLE_TYPES.includes(f.input_type))
        .map((f) => ({ value: f.id, label: f.label || f.column_name })),
    [productEditFields]
  );

  // All editor mutations below only touch the local draft; nothing is persisted
  // until handleConfirm runs.
  function handleDragEnd(event) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || over.id === active.id) return;

    const newLayout = buildLayout(draftBlocks ?? []).map((row) => [...row]);

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
    if (typeof overId === "string" && overId.startsWith("insertrow-")) {
      // Insert a brand-new row at this index; the block lands at column 0 and
      // all later rows shift down. Active's old row (now empty) is filtered below.
      const i = parseInt(overId.slice("insertrow-".length), 10);
      newLayout.splice(i, 0, [activeBlock]);
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

    setDraftBlocks(updatedBlocks);
  }

  async function handleAddBlock(values) {
    const maxRow = (draftBlocks ?? []).reduce((m, b) => Math.max(m, b.grid_row ?? 0), 0);
    const block = {
      id: nextTempId(),
      block_type: values.block_type,
      grid_row: maxRow + 1,
      grid_col: 0,
      visible: true,
      font_size: null,
      show_label: true,
    };
    if (values.block_type === "product") {
      block.field_id = values.field_id;
      // Attach the field meta so the card summary and preview render before save.
      const field = (productEditFields ?? []).find((f) => f.id === values.field_id);
      if (field) {
        block.admin_product_fields = {
          column_name: field.column_name,
          input_type: field.input_type,
          label: field.label,
        };
      }
    }
    if (values.block_type === "widget") block.component = values.component;
    if (values.block_type === "user") block.content = values.content ?? "";

    setDraftBlocks((prev) => [...(prev ?? []), block]);
  }

  function handleDeleteBlock(block) {
    setDraftBlocks((prev) => (prev ?? []).filter((b) => b.id !== block.id));
  }

  function handleEditContent(block, value) {
    if (value === (block.content ?? "")) return;
    setDraftBlocks((prev) =>
      (prev ?? []).map((b) => (b.id === block.id ? { ...b, content: value } : b))
    );
  }

  function handleEditLabel(block, value) {
    if (value === (block.label ?? "")) return;
    setDraftBlocks((prev) =>
      (prev ?? []).map((b) => (b.id === block.id ? { ...b, label: value } : b))
    );
  }

  function handleSetFontSize(block, value) {
    setDraftBlocks((prev) =>
      (prev ?? []).map((b) => (b.id === block.id ? { ...b, font_size: value } : b))
    );
  }

  function handleToggleLabel(block, checked) {
    setDraftBlocks((prev) =>
      (prev ?? []).map((b) => (b.id === block.id ? { ...b, show_label: checked } : b))
    );
  }

  // Persist the whole draft: delete removed blocks, create new ones, update the
  // fields that changed on existing ones, then sync the saved state from results.
  async function handleConfirm() {
    setSaving(true);
    try {
      const savedById = new Map((blocks ?? []).map((b) => [b.id, b]));
      const draftIds = new Set(draftBlocks.map((b) => b.id));

      const toDelete = (blocks ?? []).filter((b) => !draftIds.has(b.id));
      await Promise.all(toDelete.map((b) => deleteShopBlockAPI(b.id)));

      const persisted = await Promise.all(
        draftBlocks.map(async (b) => {
          if (isTempId(b.id)) {
            const payload = {
              block_type: b.block_type,
              grid_row: b.grid_row,
              grid_col: b.grid_col,
              font_size: b.font_size ?? null,
              show_label: b.show_label ?? true,
            };
            if (b.block_type === "product") payload.field_id = b.field_id;
            if (b.block_type === "widget") {
              payload.component = b.component;
              payload.label = b.label ?? null;
            }
            if (b.block_type === "user") payload.content = b.content ?? "";
            return createShopBlockAPI(payload);
          }

          const saved = savedById.get(b.id);
          const updates = {};
          if (saved.grid_row !== b.grid_row) updates.grid_row = b.grid_row;
          if (saved.grid_col !== b.grid_col) updates.grid_col = b.grid_col;
          if ((saved.content ?? "") !== (b.content ?? "")) updates.content = b.content ?? "";
          if ((saved.label ?? "") !== (b.label ?? "")) updates.label = b.label ?? null;
          if ((saved.font_size ?? null) !== (b.font_size ?? null)) updates.font_size = b.font_size ?? null;
          if ((saved.show_label ?? true) !== (b.show_label ?? true)) updates.show_label = b.show_label ?? true;
          if (Object.keys(updates).length === 0) return saved;
          return updateShopBlockAPI({ id: b.id, updates });
        })
      );

      dispatch(setShopBlocks(persisted));
      dispatch(setProductsShopBlocks(persisted));
      toast.success("Changes saved");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to save changes");
    } finally {
      setSaving(false);
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
            <button
              onClick={handleConfirm}
              disabled={!hasChanges || saving}
              className="flex-none px-4 py-2 text-sm bg-hmc-button-b text-hmc-button-text-b font-bold hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? "Saving…" : "Confirm Changes"}
            </button>
          </div>
        }
      />

      {/* Editor */}
      <div className="mt-4 min-w-0">
        {!adminDataLoaded ? (
          <div className="p-4 text-sm text-hmc-textprimary">Loading…</div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={(event) => setActiveId(event.active.id)}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveId(null)}
          >
            <SortableContext items={blockIds} strategy={rectSortingStrategy}>
              <div className="flex flex-col">
                <RowInsertGhost index={0} />
                {layout.map((row, rIdx) => (
                  <Fragment key={rIdx}>
                    <div className="flex items-stretch gap-3">
                      {row.map((block) => (
                        <SortableBlockCard
                          key={block.id}
                          block={block}
                          onDelete={handleDeleteBlock}
                          onEditContent={handleEditContent}
                          onEditLabel={handleEditLabel}
                          onSetFontSize={handleSetFontSize}
                          onToggleLabel={handleToggleLabel}
                        />
                      ))}
                      <AppendGhost rowIndex={rIdx} />
                    </div>
                    <RowInsertGhost index={rIdx + 1} />
                  </Fragment>
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId
                ? (() => {
                    const block = (draftBlocks ?? []).find((b) => b.id === activeId);
                    return block ? <OverlayBlockCard block={block} /> : null;
                  })()
                : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* Live preview — the real shop page, with interactions disabled */}
      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wide text-hmc-textprimary/60">
            Preview
          </div>
          <div className="flex overflow-hidden rounded border border-hmc-border-a text-xs">
            {PREVIEW_MODES.map((mode) => (
              <button
                key={mode.value}
                type="button"
                onClick={() => setPreviewMode(mode.value)}
                className={`px-3 py-1 font-semibold ${
                  previewMode === mode.value
                    ? "bg-hmc-button-a text-hmc-button-text-a"
                    : "bg-transparent text-hmc-textprimary hover:bg-hmc-button-a/20"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[calc(100vh-120px)] overflow-auto rounded border border-hmc-border-a bg-hmc-bg-a">
          {sampleProduct ? (
            <PageContainer widthClass={activePreviewMode.widthClass}>
              <div className="pointer-events-none">
                <ShopProductLayout
                  product={sampleProduct}
                  blocks={draftBlocks}
                  viewport={activePreviewMode.viewport}
                />
              </div>
            </PageContainer>
          ) : (
            <p className="p-4 text-xs text-hmc-textprimary/60">
              Add a product to see a preview.
            </p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
