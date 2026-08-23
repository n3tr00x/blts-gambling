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
import { FlattenedPlayersEffectivenessProgress } from '@/lib/supabase/database';

const generateConfig = (players: string[]) => {
  const colors = [
    'var(--color-chart-1)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
    'var(--color-chart-4)',
    'var(--color-chart-5)',
    'var(--color-chart-6)',
  ];

  return players.reduce((config, player, index) => {
    config[player] = { color: colors[index % colors.length] };
    return config;
  }, {} as ChartConfig);
};

type PlayersEffectivenessProgressChartProps = {
  data: FlattenedPlayersEffectivenessProgress[];
};

export function PlayersEffectivenessProgressChart({
  data,
}: PlayersEffectivenessProgressChartProps) {
  const players = Object.keys(data[data.length - 1]).filter(
    key => key !== 'round_number' && key !== 'roundNumber',
  );
  const config = generateConfig(players);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Wykres skuteczności całego sezonu</CardTitle>
        <CardDescription>Ostatnie 30 rozegranych rund</CardDescription>
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
              // domain={yAxisDomain}
              domain={([dataMin, dataMax]) => [
                Math.max(0, Math.floor(dataMin - 5)),
                Math.min(100, Math.ceil(dataMax + 5)),
              ]}
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
                // stroke={`var(--color-${player})`}
                stroke={config[player].color}
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
