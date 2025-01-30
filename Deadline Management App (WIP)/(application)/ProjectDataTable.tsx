"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type SortingState,
  type VisibilityState
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import * as React from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { formatDistanceDay } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/react";

export type Project = RouterOutputs["project"]["getAll"][number];

interface ProjectDataTableProps {
  projects: Project[];
  isLoading?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  markCompleted?: (project: Project) => void;
}

function ArrowSortDirection({ column }: { column: Column<Project> }) {
  const sorted = column.getIsSorted();
  if (!sorted) {
    return <ArrowUpDown />;
  }
  return sorted === "asc" ? <ArrowUp /> : <ArrowDown />;
}

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    sortingFn: 'alphanumeric',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowSortDirection column={column} />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "type.name",
    sortingFn: 'alphanumeric',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Type
        <ArrowSortDirection column={column} />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.type.name}</div>,
  },
  {
    accessorKey: "status",
    sortingFn: 'alphanumeric',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowSortDirection column={column} />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "submitDate",
    sortingFn: 'datetime',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Submit Date
        <ArrowSortDirection column={column} />
      </Button>
    ),
    cell: ({ row }) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const date = row.getValue("submitDate") as Date;
      return <div>{date?.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "deadlineDate",
    sortingFn: 'datetime',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Deadline
        <ArrowSortDirection column={column} />
      </Button>
    ),
    cell: ({ row }) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const date = row.getValue("deadlineDate") as Date;
      const status = row.original.status;
      if(date === null) {
        return <div>-</div>;
      }

      // If project is completed, just show the date without diff styling
      if (status === "archived") {
        return (
          <div>
            <div className="text-sm text-muted-foreground">
              {format(date, 'PP')}
            </div>
          </div>
        );
      }

      const now = new Date();
      const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      let colorClass = "";
      if (diffInDays < 0) {
        colorClass = "text-red-500"; // Overdue
      } else if (diffInDays <= 2) {
        colorClass = "text-orange-500"; // 0-2 days
      } else if (diffInDays <= 7) {
        colorClass = "text-yellow-500"; // 2-7 days
      } else if (diffInDays <= 14) {
        colorClass = "text-blue-500"; // 7-14 days
      } else if (diffInDays <= 30) {
        colorClass = "text-green-500"; // 14-30 days
      } else {
        colorClass = "text-gray-500"; // 30+ days
      }

      return (
        <div>
          <div className={`text-sm ${colorClass} capitalize`}>
            {formatDistanceDay(date)}
          </div>
          <div className="text-xs text-muted-foreground">
            {format(date, 'PP')}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "completionDate",
    sortingFn: 'datetime',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Completion
        <ArrowSortDirection column={column} />
      </Button>
    ),
    cell: ({ row }) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const date = row.getValue("completionDate") as Date | null;
      return date ? <div>{date.toLocaleDateString()}</div> : <div>-</div>;
    },
  },
  {
    accessorKey: "employee.name",
    sortingFn: (a, b) => a.original.employee?.name.localeCompare(b.original.employee?.name ?? '') ?? 0,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Employee
        <ArrowSortDirection column={column} />
      </Button>
    ),
    cell: ({ row }) => {
      const employee = row.original.employee;
      return <div>{employee?.name ?? '-'}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const project = row.original;
      const { onEdit, onDelete, markCompleted } = (table.options.meta ?? {}) as {
        onEdit?: (project: Project) => void;
        onDelete?: (project: Project) => void;
        markCompleted?: (project: Project) => void;
      };

      if (!onEdit && !onDelete && !markCompleted) {
        return null;
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="trigger" size="trigger"><MoreHorizontal /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {markCompleted && (
              <>
                <DropdownMenuItem onClick={() => markCompleted(project)}>
                  Mark as completed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(project)}>
                Edit project
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={() => onDelete(project)}>
                Delete project
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function ProjectDataTable({
  projects,
  isLoading = false,
  onEdit,
  onDelete,
  markCompleted,
  defaultSorting = [{ id: "deadlineDate", desc: false }],
  defaultVisibility = {
    status: false,
    completionDate: false,
  }
}: ProjectDataTableProps & {
  defaultSorting?: SortingState;
  defaultVisibility?: VisibilityState;
}) {
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(defaultVisibility);

  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting: true,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    meta: {
      onEdit,
      onDelete,
      markCompleted,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}