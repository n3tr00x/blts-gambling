'use client';

import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { TopPickedLeague } from '@/lib/supabase/database';

const chartConfig = {
  pickCount: {
    label: 'Ilość danego typu',
    color: 'var(--color-chart-bar-primary)',
  },
  remainingPicks: {
    label: 'Pozostałe typy',
    color: 'var(--color-chart-bar-secondary)',
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

  const transformedData = data.map(item => ({
    ...item,
    remainingPicks: item.totalPicks - item.pickCount,
  }));

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
        <ChartContainer config={chartConfig} className="min-h-[550px] w-full">
          <BarChart
            accessibilityLayer
            data={transformedData}
            layout="vertical"
            margin={{ right: 64 }}
            maxBarSize={Infinity}
          >
            <YAxis
              dataKey="leagueName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={144}
              tick={{ fontSize: 12, textAnchor: 'end' }}
            />
            <XAxis dataKey="pickCount" type="number" hide allowDataOverflow />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="min-w-[164px]"
                  labelClassName="mb-2 text-sm"
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="pickCount"
              layout="vertical"
              stackId="a"
              fill="var(--color-pickCount)"
              radius={[4, 0, 0, 4]}
            />
            <Bar
              dataKey="remainingPicks"
              layout="vertical"
              stackId="a"
              fill="var(--color-remainingPicks)"
              radius={[0, 4, 4, 0]}
            >
              <LabelList
                dataKey={d => `${d.pickCount}/${d.totalPicks}`}
                position="right"
                offset={12}
                className="fill-(--color-label)"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
