import { formatDateToPolishLong } from '@/lib/utilities/date';

type RoundCardTitleContentProps = {
  isEditMode: boolean;
  roundDate?: string;
  roundNumber?: number;
};

export function RoundCardTitleContent({
  isEditMode,
  roundDate,
  roundNumber,
}: RoundCardTitleContentProps) {
  if (!isEditMode) {
    return <span>Dodaj nową rundę</span>;
  }

  return (
    <span>
      Edytuj rundę (#{roundNumber}){' '}
      {roundDate && (
        <span className="text-muted-foreground italic">
          {formatDateToPolishLong(roundDate)}
        </span>
      )}
    </span>
  );
}
