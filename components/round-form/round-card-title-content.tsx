import { formatDateToPolishLong } from '@/utilities/date';

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
    return <>Dodaj nową rundę</>;
  }

  return (
    <>
      Edytuj rundę (#{roundNumber}){' '}
      {roundDate && (
        <span className="text-muted-foreground italic">
          {formatDateToPolishLong(roundDate)}
        </span>
      )}
    </>
  );
}
