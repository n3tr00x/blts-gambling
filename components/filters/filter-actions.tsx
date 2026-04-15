import { Button } from '../ui/button';

type FilterActionsProps = {
  onApplyFilters: () => void;
  onClearAllFilters: () => void;
  hasActiveFilters: boolean;
};

export function FilterActions({
  onApplyFilters,
  onClearAllFilters,
  hasActiveFilters,
}: FilterActionsProps) {
  return (
    <div className="flex gap-2 pt-2">
      <Button onClick={onApplyFilters} size="sm" className="flex-1">
        Zastosuj
      </Button>
      {hasActiveFilters && (
        <Button
          onClick={onClearAllFilters}
          size="sm"
          variant="outline"
          className="flex-1"
        >
          Wyczyść
        </Button>
      )}
    </div>
  );
}
