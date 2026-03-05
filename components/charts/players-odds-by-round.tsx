'use client';

import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { FlattenedOddsByRound } from '@/lib/supabase/database';

const generateConfig = (players: string[]) => {
  const colors = [
    'var(--color-chart-1)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
    'var(--color-chart-4)',
    'var(--color-chart-5)',
  ];

  return players.reduce((config, key, index) => {
    config[key] = { color: colors[index] };
    return config;
  }, {} as ChartConfig);
};

type PlayersEffectivenessProgressChartProps = {
  data: FlattenedOddsByRound[];
};

export function PlayersOddsByRoundChart({
  data,
}: PlayersEffectivenessProgressChartProps) {
  const players = Object.keys(data[0]).filter(key => key !== 'roundNumber');
  const config = generateConfig(players);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          Wykres wysokości kursu wybranych graczy na rundę
        </CardTitle>
        <CardDescription>Ostatnie 15 rozegranych rund</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={config} className="h-[350px] w-full">
          <LineChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="roundNumber"
              tickLine={false}
              axisLine={false}
              tickMargin={32}
              minTickGap={32}
              tickFormatter={value => `R${value}`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={0}
              domain={([, dataMax]: [number, number]) => [1, Math.ceil(dataMax)]}
            />
            <Legend height={32} align="center" wrapperStyle={{ position: 'static' }} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelFormatter={label => `Runda ${label}`} />}
            />
            {players.map(player => (
              <Line
                key={player}
                dataKey={player}
                type="monotone"
                stroke={`var(--color-${player})`}
                strokeWidth={3}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
