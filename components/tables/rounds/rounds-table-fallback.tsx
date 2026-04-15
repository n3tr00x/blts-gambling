import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const COLUMNS_COUNT = 6;
const ROWS_COUNT = 15;

export function RoundsTableFallback() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-end gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden">
          <Table className="border">
            <TableHeader>
              <TableRow className="py-12">
                {Array.from({ length: COLUMNS_COUNT }).map((_, idx) => (
                  <TableHead key={`header-${idx}`} className="px-4 py-6">
                    <Skeleton className="h-5 w-32" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: ROWS_COUNT }).map((_, rowIdx) => (
                <TableRow key={`skeleton-row-${rowIdx}`}>
                  {Array.from({ length: COLUMNS_COUNT }).map((_, cellIdx) => (
                    <TableCell key={`skeleton-cell-${rowIdx}-${cellIdx}`} className="p-4">
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
