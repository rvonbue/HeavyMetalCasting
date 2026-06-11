import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function OrdersTable({ orders }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [grouping, setGrouping] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Order ID",
      },
      {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ getValue }) =>
          new Date(getValue()).toLocaleDateString(),
      },
      {
        accessorKey: "customer_name",
        header: "Customer",
      },
      {
        accessorKey: "customer_email",
        header: "Email",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => (
          <span className="rounded border border-hmc-c px-2 py-1 text-xs font-bold uppercase">
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
      },
      {
        accessorKey: "order_items",
        header: "Items",
        cell: ({ getValue }) => getValue()?.length ?? 0,
      },
    ],
    []
  );

  const table = useReactTable({
    data: orders,
    columns,
    state: {
      sorting,
      globalFilter,
      grouping,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onGroupingChange: setGrouping,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
  });

  return (
    <div className="space-y-4 text-hmc-c bg-hmc-panelbackground">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search orders..."
          className="w-full max-w-sm border border-hmc-c px-3 py-2 text-sm text-hmc-textprimary placeholder:text-hmc-textprimary/50 focus:border-hmc-b focus:outline-none"
        />

        <select
          value={grouping[0] ?? ""}
          onChange={(e) => setGrouping(e.target.value ? [e.target.value] : [])}
          className="rounded border border-hmc-c bg-hmc-a px-3 py-2 text-sm text-hmc-c focus:border-hmc-b focus:outline-none"
        >
          <option value="">No Grouping</option>
          <option value="status">Group by Status</option>
          <option value="customer_email">Group by Email</option>
        </select>
      </div>

      <div className="overflow-hidden rounded border border-hmc-c shadow">
        <table className="w-full border-collapse text-sm">
          <thead className="border-b border-hmc-c bg-hmc-button-a text-hmc-textsecondary">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer px-4 py-3 text-left text-xs font-bold uppercase tracking-wide"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    {{
                      asc: " ▲",
                      desc: " ▼",
                    }[header.column.getIsSorted()] ?? ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-hmc-c/30 transition"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-hmc-textprimary text-left">
                    {cell.getIsGrouped() ? (
                      <button
                        type="button"
                        onClick={row.getToggleExpandedHandler()}
                        className="font-bold text-hmc-textprimary"
                      >
                        {row.getIsExpanded() ? "− " : "+ "}
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}{" "}
                        ({row.subRows.length})
                      </button>
                    ) : cell.getIsAggregated() ? (
                      flexRender(
                        cell.column.columnDef.aggregatedCell ??
                          cell.column.columnDef.cell,
                        cell.getContext()
                      )
                    ) : cell.getIsPlaceholder() ? null : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}