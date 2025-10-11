"use client";

import * as React from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Trash2,
  EllipsisVertical,
  ChevronsUp,
  ChevronsDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; // ShadCN checkbox

// -----------------------------
// Data Type
// -----------------------------
type DataItem = {
  id: number;
  temperature: number;
  humidity: number;
  air_quality: number;
  timestamp: string;
};

// -----------------------------
// Column Definitions
// -----------------------------
const columns: ColumnDef<DataItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all rows"
        className="shadow-none"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        className="shadow-none"
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select row ${row.original.id}`}
      />
    ),
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <div
        className="flex items-center gap-1 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>ID</span>
        {column.getIsSorted() === "asc" && <ChevronsUp className="w-4 h-4" />}
        {column.getIsSorted() === "desc" && (
          <ChevronsDown className="w-4 h-4" />
        )}
      </div>
    ),
    cell: ({ row }) => <div className="pl-2">{row.original.id}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "temperature",
    header: "Temp (°C)",
    cell: ({ row }) => <div className="pl-2">{row.original.temperature}</div>,
  },
  {
    accessorKey: "humidity",
    header: "Humidity (%)",
    cell: ({ row }) => <div className="pl-2">{row.original.humidity}</div>,
  },
  {
    accessorKey: "air_quality",
    header: "Air Quality",
    cell: ({ row }) => <div className="pl-2">{row.original.air_quality}</div>,
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const date = new Date(row.original.timestamp);
      return (
        <div className="pl-2">
          {date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end pr-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="shadow-none">
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => alert(`Delete row ${row.original.id}`)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

// -----------------------------
// DataTable Component
// -----------------------------
export function DataTable({
  columnVisibility,
}: {
  columnVisibility: VisibilityState;
}) {
  const [data, setData] = React.useState<DataItem[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/sensor/all");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      columnVisibility,
      columnFilters,
      sorting,
      pagination,
    },
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4 py-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-middle h-14">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-muted-foreground text-sm">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="rows-per-page" className="text-sm">
            Rows per page
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger id="rows-per-page" className="w-20 shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-1">
            <Button
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              variant="outline"
              className="shadow-none"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              variant="outline"
              className="shadow-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              variant="outline"
              className="shadow-none"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              variant="outline"
              className="shadow-none"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
