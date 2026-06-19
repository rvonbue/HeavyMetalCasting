import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  PencilIcon,
  TrashIcon,
  TailwindSpinner,
} from "../../styles/Icons";

import { Button_A, PageContainer, AdminPageHeader } from "../../components/Resuables";
import { removeProduct } from "../../store/productsSlice";
import { deleteProductAPI } from "../../api/adminAPI";
import { toast } from "sonner";
import UploadXlsxModal from "../../components/modal/UploadXlsxModal";
import AddProductTemplateModal from "../../components/modal/AddProductModal";
import Modal from "../../components/modal/Modal";

export default function ProductOverviewPage() {
  const dispatch = useDispatch();

  const { products, productsLoading, productAttributes } = useSelector(
    (state) => state.products
  );

  const { productEditFields } = useSelector((state) => state.admin);

  const [sorting, setSorting] = useState([
    {
      id: "live",
      desc: false,
    },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function handleUpload(file) {
    console.log("Uploaded XLSX:", file);
  }

  const columns = useMemo(() => {
    const fieldColumns = productEditFields.map((field) => ({
      id: field.column_name,
      accessorFn: (product) =>
        getCellValue({
          field,
          product,
          productAttributes,
        }),
      header: field.label,
      cell: ({ getValue }) => getValue(),
      sortingFn: "alphanumeric",
    }));

    return [
      ...fieldColumns,
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const product = row.original;

          return (
            <div className="flex items-center gap-3">
              <NavLink
                to={`/admin/edit_product?product_id=${product.id}`}
                end
                className="text-hmc-textprimary transition hover:text-hmc-b"
              >
                <PencilIcon classes="mr-1" />
              </NavLink>

              <button
                type="button"
                onClick={() => setDeleteTarget(product)}
                className="text-hmc-textprimary transition hover:text-hmc-error"
              >
                <TrashIcon />
              </button>
            </div>
          );
        },
      },
    ];
  }, [productEditFields, productAttributes, dispatch]);

  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <PageContainer bg="alt1">
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
        maxWidth="max-w-sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="rounded border border-hmc-border-a px-4 py-2 text-sm font-bold text-hmc-textprimary transition hover:bg-hmc-button-a/20"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  await deleteProductAPI(deleteTarget.id);
                  dispatch(removeProduct(deleteTarget.id));
                  toast.success("Product deleted");
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to delete product");
                } finally {
                  setDeleteTarget(null);
                }
              }}
              className="rounded bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteTarget?.name}</span>? This action cannot be undone.
        </p>
      </Modal>

      <AddProductTemplateModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
      /> 
      <UploadXlsxModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />

      <div className="mx-auto rounded bg-white p-4 shadow">
        <AdminPageHeader
          title="Product Overview"
          action={
            <Button_A
              button_name="+ Add Product"
              button_type="onClick"
              onClick={() => setShowAddProductModal(true)}
            />
          }
        />

        {productsLoading ? (
          <TailwindSpinner />
        ) : (
          <div className="overflow-hidden rounded border border-hmc-border-a bg-white">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-hmc-button-a text-hmc-button-text-a">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const sorted = header.column.getIsSorted();

                      return (
                        <th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          className={`border-b border-hmc-border-a px-3 py-3 text-left align-top text-xs font-bold uppercase tracking-wide ${
                            canSort ? "cursor-pointer select-none" : ""
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}

                            {sorted === "asc" && <span>▲</span>}
                            {sorted === "desc" && <span>▼</span>}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-hmc-border-b transition hover:bg-hmc-button-a/20"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-3 py-3 text-left align-top text-hmc-textprimary"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

function getCellValue({ field, product, productAttributes }) {
  const { column_name, input_type, lookup_name } = field;

  const value = product[column_name];

  switch (input_type) {
    case "array_lookup": {
      const lookupValues = productAttributes?.[lookup_name] ?? [];

      return (value ?? [])
        .map((id) => {
          const match = lookupValues.find((option) => option.id === id);
          return match?.label ?? id;
        })
        .join(", ");
    }

    case "checkbox":
      return value ? "Yes" : "No";

    default:
      return value ?? "";
  }
}