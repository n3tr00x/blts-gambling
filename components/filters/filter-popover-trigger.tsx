import { Button } from '@/components/ui/button';

type FilterPopoverTriggerProps = {
  activeFiltersCount: number;
};

export function FilterPopoverTrigger({ activeFiltersCount }: FilterPopoverTriggerProps) {
  return (
    <Button variant="outline">
      Filtry {activeFiltersCount > 0 && `(${activeFiltersCount})`}
    </Button>
  );
}
