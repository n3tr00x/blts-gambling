import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TopLeaguePerPlayer } from '@/lib/supabase/database';

type TopLeaguePerPlayerCardProps = TopLeaguePerPlayer;

export function TopLeaguePerPlayerCard({
  player,
  league,
  country,
  pickCount,
  hitPicks,
}: TopLeaguePerPlayerCardProps) {
  const percentage = (hitPicks / pickCount) * 100;

  return (
    <Card key={player} className="justify-around gap-4">
      <CardHeader>
        <CardTitle className="font-semibold">{player}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3 space-y-1">
          <p className="text-foreground text-base font-medium">{league}</p>
          <p className="text-muted-foreground text-sm">{country}</p>
        </div>
        <Progress value={percentage} indicatorClassName="bg-blue-500" />
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between">
          <div>
            <p className="text-foreground font-secondary text-lg font-bold">
              {pickCount}
            </p>
            <p className="text-muted-foreground text-xs">picków</p>
          </div>
          <div className="text-right">
            <p className="text-foreground font-secondary text-lg font-semibold">
              {percentage.toFixed(2)}%
            </p>
            <p className="text-muted-foreground text-xs">trafionych</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
