'use client';

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import { BetPerLeagueTooltip } from '@/components/charts/bets-per-league-tooltip';
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
import { TopPickedLeague } from '@/lib/supabase/database';

const chartConfig = {
  total: {
    label: 'Ilość',
    color: 'var(--color-chart-2)',
  },
  label: {
    color: 'var(--color-foreground)',
  },
} satisfies ChartConfig;

type BetsPerLeagueChartProps = {
  data: TopPickedLeague[];
};

export function BetsPerLeagueChart({ data }: BetsPerLeagueChartProps) {
  const sumOfPicks = data[0].totalPicks;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-secondary text-2xl">
          TOP 10: Ilość typów wg lig
        </CardTitle>
        <CardDescription>
          Najpopularniejsze ligi wybierane przez graczy. Ogólna ilość typów:{' '}
          <span className="font-bold">{sumOfPicks}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[350px] w-full pr-12">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            barSize={48}
            margin={{ right: 32 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="leagueName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="pickCount" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value, name, item) => (
                    <BetPerLeagueTooltip
                      label={chartConfig.total.label}
                      sumOfPicks={sumOfPicks}
                      value={value}
                      name={name}
                      item={item}
                    />
                  )}
                />
              }
              wrapperClassName="blue"
            />
            <Bar
              dataKey="pickCount"
              layout="vertical"
              fill="var(--color-chart-1)"
              radius={4}
            >
              <LabelList
                dataKey="leagueName"
                position="insideLeft"
                offset={12}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey="pickCount"
                position="right"
                offset={16}
                className="fill-foreground font-semibold"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
