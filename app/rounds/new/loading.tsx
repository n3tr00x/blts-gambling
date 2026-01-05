import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-12 w-full" />
      </CardHeader>
      <CardContent className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="col-span-1 h-96" />
          <Skeleton className="col-span-1 h-96" />
          <Skeleton className="col-span-2 h-80" />
        </div>
      </CardContent>
    </Card>
  );
}
