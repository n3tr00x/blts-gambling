import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ChartNoDataFallbackProps = {
  title: string;
  description?: string;
};

export function ChartNoDataFallback({
  title,
  description = 'Brak danych do wyświetlenia',
}: ChartNoDataFallbackProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
