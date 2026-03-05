import {
  NameType,
  Payload,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

type BetPerLeagueTooltipProps = {
  label: string;
  value: ValueType;
  name: NameType;
  item: Payload<ValueType, NameType>;
  sumOfPicks: number;
};

export function BetPerLeagueTooltip({
  label,
  value,
  item,
  sumOfPicks,
}: BetPerLeagueTooltipProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-foreground text-sm font-medium">{item.payload.league_name}</p>
      <div className="flex justify-between">
        <div className="text-foreground flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
          {label}
        </div>
        <p>
          {value}{' '}
          <span className="text-muted-foreground font-normal">
            ({Math.round((Number(value) / sumOfPicks) * 100)}%)
          </span>
        </p>
      </div>

      <div className="text-foreground mt-1.5 flex basis-full items-center gap-8 border-t pt-1.5 text-xs font-medium">
        Ilość wszystkich typów
        <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
          <span className="text-muted-foreground font-normal">{sumOfPicks}</span>
        </div>
      </div>
    </div>
  );
}
