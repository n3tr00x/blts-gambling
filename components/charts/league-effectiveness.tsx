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
import { LeagueEffectiveness } from '@/lib/supabase/database';

const chartConfig = {
  hitPercent: {
    label: 'Trafione (%)',
    color: 'var(--chart-1)',
  },
  missPercent: {
    label: 'Nietrafione (%)',
    color: 'var(--chart-2)',
  },
  label: {
    color: 'var(--color-foreground)',
  },
} satisfies ChartConfig;

type LeagueEffectivenessChartProps = {
  data: LeagueEffectiveness[];
};

export function LeagueEffectivenessChart({ data }: LeagueEffectivenessChartProps) {
  const processedData = data.map(league => ({
    ...league,
    missCount: league.pickCount - league.hitCount,
    hitPercent: ((league.hitCount / league.pickCount) * 100).toFixed(1),
    missPercent: (
      ((league.pickCount - league.hitCount) / league.pickCount) *
      100
    ).toFixed(2),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Największa skuteczność wg lig</CardTitle>
        <CardDescription>
          Wykres uwzględnia skuteczność gdy dana liga zostanie wybrana minimum 10 razy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[550px] w-full">
          <BarChart
            accessibilityLayer
            data={processedData}
            layout="vertical"
            barSize={64}
            margin={{ right: 64 }}
          >
            <YAxis
              dataKey="leagueName"
              type="category"
              tickLine={true}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="pickCount" type="number" hide domain={[0, 100]} />
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
              dataKey="hitPercent"
              layout="vertical"
              stackId="a"
              fill={chartConfig.hitPercent.color}
              radius={[4, 0, 0, 4]}
            >
              <LabelList
                dataKey="leagueName"
                position="insideLeft"
                offset={12}
                fontSize={12}
                className="fill-(--color-label)"
              />
            </Bar>
            <Bar
              dataKey="missPercent"
              layout="vertical"
              stackId="a"
              fill={chartConfig.missPercent.color}
              radius={[0, 4, 4, 0]}
            >
              <LabelList
                dataKey={d => `${d.hitCount}/${d.pickCount}`}
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
