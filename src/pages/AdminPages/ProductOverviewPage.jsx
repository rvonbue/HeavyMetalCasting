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

import { Button_A, PageContainer } from "../../components/Resuables";
import UploadXlsxModal from "../../components/modal/UploadXlsxModal";

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
                className="text-hmc-a transition hover:text-hmc-b"
              >
                <PencilIcon classes="mr-1" />
              </NavLink>

              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: "DELETE_PRODUCT",
                    payload: product.id,
                  })
                }
                className="text-hmc-a transition hover:text-hmc-error"
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
      <UploadXlsxModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />

      <div className="mx-auto rounded bg-white p-4 shadow">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-hmc-textprimary">
            Product Management
          </h1>

          <div className="flex items-center gap-4">
            {/* <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="text-sm font-bold text-hmc-a underline-offset-4 hover:underline"
            >
              Update via spreadsheet
            </button> */}

            <Button_A
              button_name="+ Add Product"
              link_val="/admin/add_product"
              button_styles_outer={{ marginTop: "1.5rem" }}
            />
          </div>
        </div>

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