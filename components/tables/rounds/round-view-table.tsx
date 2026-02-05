'use client';

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { getColumns } from '@/components/tables/rounds/columns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlayedRound } from '@/lib/supabase/database';

type RoundViewTableProps = {
  rounds: PlayedRound[];
  isLoggedIn: boolean;
};

export function RoundViewTable({ rounds, isLoggedIn }: RoundViewTableProps) {
  const columns = getColumns(isLoggedIn);
  const table = useReactTable({
    data: rounds,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden">
      <Table className="border">
        <TableHeader className="letter font-secondary text-lg">
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} className="py-12">
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id} className="text-muted-foreground px-4 py-6">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nie znaleziono rund
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
