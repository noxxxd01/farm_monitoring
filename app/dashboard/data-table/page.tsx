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
  ChevronsUp,
  ChevronsDown,
  Columns2,
  Ellipsis,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";

// -----------------------------
// Data Type
// -----------------------------
type DataItem = {
  id: number;
  temperature: number;
  humidity: number;
  mq2_value: number;
  created_at: string;
};

// -----------------------------
// Fetch Function
// -----------------------------
const fetchSensorData = async (): Promise<DataItem[]> => {
  const res = await fetch("/api/sensor/all");
  if (!res.ok) throw new Error("Failed to fetch sensor data");
  return res.json();
};

// -----------------------------
// DataTable Component
// -----------------------------
export function DataTable({
  columnVisibility,
}: {
  columnVisibility: VisibilityState;
}) {
  // Use TanStack Query for data fetching
  const {
    data = [],
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["sensorData"],
    queryFn: fetchSensorData,
    staleTime: Infinity, // Data stays fresh until manually refetched
  });

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
          className="shadow-none ml-2"
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
      accessorKey: "mq2_value",
      header: "MQ2 Value",
      cell: ({ row }) => <div className="pl-2">{row.original.mq2_value}</div>,
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
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
  ];

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
      <div className="flex justify-between items-center mb-2">
        <Button
          onClick={() => refetch()}
          disabled={isFetching}
          variant="outline"
        >
          {isFetching ? "Refreshing..." : "Refetch Data"}
        </Button>
      </div>

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

        <div className="flex items-center gap-1">
          {/* Rows per page */}
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

          {/* First Page */}
          <Button
            size="icon"
            variant="outline"
            className="shadow-none"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>

          {/* Previous Page */}
          <Button
            size="icon"
            variant="outline"
            className="shadow-none"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Page Numbers with ellipsis */}
          {(() => {
            const currentPage = table.getState().pagination.pageIndex;
            const totalPages = table.getPageCount();
            const pageButtons = [];

            // Show first page always
            pageButtons.push(
              <Button
                key={0}
                size="icon"
                className="shadow-none"
                variant={currentPage === 0 ? "default" : "outline"}
                onClick={() => table.setPageIndex(0)}
              >
                1
              </Button>
            );

            // Ellipsis if needed
            if (currentPage > 3)
              pageButtons.push(<span key="start-ellipsis">...</span>);

            // Pages around current page
            for (
              let i = Math.max(1, currentPage - 1);
              i <= Math.min(totalPages - 2, currentPage + 1);
              i++
            ) {
              pageButtons.push(
                <Button
                  key={i}
                  size="icon"
                  className="shadow-none"
                  variant={i === currentPage ? "default" : "outline"}
                  onClick={() => table.setPageIndex(i)}
                >
                  {i + 1}
                </Button>
              );
            }

            // Ellipsis if needed
            if (currentPage < totalPages - 4)
              pageButtons.push(<span key="end-ellipsis">...</span>);

            // Show last page always
            if (totalPages > 1) {
              pageButtons.push(
                <Button
                  key={totalPages - 1}
                  size="icon"
                  className="shadow-none"
                  variant={
                    currentPage === totalPages - 1 ? "default" : "outline"
                  }
                  onClick={() => table.setPageIndex(totalPages - 1)}
                >
                  {totalPages}
                </Button>
              );
            }

            return pageButtons;
          })()}

          {/* Next Page */}
          <Button
            size="icon"
            variant="outline"
            className="shadow-none"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Last Page */}
          <Button
            size="icon"
            variant="outline"
            className="shadow-none"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// Main Page Component
// -----------------------------
export default function Page() {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: true,
      temperature: true,
      humidity: true,
      mq2_value: true,
      created_at: true,
    });

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Sensor Data Table</h1>
          <CardDescription className="text-muted-foreground">
            Monitor temperature, humidity, and gas levels (MQ2)
          </CardDescription>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shadow-none">
                <Columns2 className="w-4 h-4" />
                Customize Columns
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuCheckboxItem
                checked={columnVisibility.temperature}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    temperature: checked,
                  }))
                }
              >
                Temperature
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={columnVisibility.humidity}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    humidity: checked,
                  }))
                }
              >
                Humidity
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={columnVisibility.mq2_value}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    mq2_value: checked,
                  }))
                }
              >
                MQ2 Value
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={columnVisibility.created_at}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    created_at: checked,
                  }))
                }
              >
                Created At
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DataTable columnVisibility={columnVisibility} />
    </div>
  );
}
