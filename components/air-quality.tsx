"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description =
  "Gas sensor readings (NH3, H2S) per hour (last 24 hours)";

const chartConfig = {
  nh3: { label: "NH3 (ppm)", color: "var(--chart-nh3, #f59e0b)" },
  h2s: { label: "H2S (ppm)", color: "var(--chart-h2s, #ef4444)" },
} satisfies ChartConfig;

function generateHourlyGas(hours = 24) {
  const now = new Date();
  const data: { hour: string; nh3: number; h2s: number }[] = [];
  for (let i = hours - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourLabel = d.getHours().toString().padStart(2, "0") + ":00";
    // mock: small diurnal variation + noise
    const nh3Base =
      5 + 6 * Math.sin((d.getHours() / 24) * Math.PI * 2 - Math.PI / 2);
    const h2sBase =
      0.5 + 1.5 * Math.sin((d.getHours() / 24) * Math.PI * 2 - Math.PI / 2);
    const nh3 = Math.max(
      0,
      Math.round((nh3Base + (Math.random() - 0.5) * 2) * 10) / 10
    );
    const h2s = Math.max(
      0,
      Math.round((h2sBase + (Math.random() - 0.5) * 0.6) * 10) / 10
    );
    data.push({ hour: hourLabel, nh3, h2s });
  }
  return data;
}

export function AirQualityChart() {
  // stable server-rendered initial state (avoids SSR/client mismatch)
  const [chartData, setChartData] = React.useState<
    { hour: string; nh3: number; h2s: number }[]
  >(() => {
    const now = new Date();
    return Array.from({ length: 24 }).map((_, i) => {
      const d = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
      return {
        hour: d.getHours().toString().padStart(2, "0") + ":00",
        nh3: 0,
        h2s: 0,
      };
    });
  });

  // generate noisy data only on the client after mount
  React.useEffect(() => {
    setChartData(() => generateHourlyGas(24));
  }, []);

  const latest = chartData[chartData.length - 1] ?? { nh3: 0, h2s: 0 };
  const avg = React.useMemo(() => {
    if (chartData.length === 0) return { nh3: 0, h2s: 0 };
    const sumNh3 = chartData.reduce((s, r) => s + r.nh3, 0);
    const sumH2s = chartData.reduce((s, r) => s + r.h2s, 0);
    return {
      nh3: Math.round((sumNh3 / chartData.length) * 10) / 10,
      h2s: Math.round((sumH2s / chartData.length) * 10) / 10,
    };
  }, [chartData]);

  return (
    <Card className="py-0 shadow-none">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Gas Sensors — NH3 & H2S (hourly)</CardTitle>
          <CardDescription>
            Last 24 hours — units: ppm. NH3/H2S cause odour and are harmful at
            high levels.
          </CardDescription>
        </div>

        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
            <span className="text-muted-foreground text-xs">Latest NH3</span>
            <span className="text-lg leading-none font-bold sm:text-3xl">
              {latest.nh3} ppm
            </span>
            <span className="text-muted-foreground text-xs">
              24h avg: {avg.nh3} ppm
            </span>
          </div>
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
            <span className="text-muted-foreground text-xs">Latest H2S</span>
            <span className="text-lg leading-none font-bold sm:text-3xl">
              {latest.h2s} ppm
            </span>
            <span className="text-muted-foreground text-xs">
              24h avg: {avg.h2s} ppm
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[220px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={6}
            />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[160px]"
                  nameKey=""
                  labelFormatter={(v) => `Hour: ${v}`}
                />
              }
            />
            <Bar dataKey="nh3" fill="var(--color-nh3)" />
            <Bar dataKey="h2s" fill="var(--color-h2s)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
