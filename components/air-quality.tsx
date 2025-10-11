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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "MQ2 gas sensor readings per hour (last 24 hours)";

const chartConfig = {
  mq2: {
    label: "MQ2 Value",
    color: "var(--chart-mq2, #f97316)", // change color for MQ2
  },
};

// Helper: group readings by hour and compute average per hour
function groupByHour(data: { timestamp: string; mq2_value: number }[]) {
  const now = new Date();
  const hours = Array.from({ length: 24 }, (_, i) => now.getHours() - i)
    .map((h) => (h < 0 ? h + 24 : h))
    .reverse(); // last 24 hours ascending

  const hourlyData = hours.map((hour) => {
    const readings = data.filter(
      (d) => new Date(d.timestamp).getHours() === hour
    );
    const avg = readings.length
      ? Math.round(
          readings.reduce((acc, r) => acc + r.mq2_value, 0) / readings.length
        )
      : 0;
    return { hour: hour.toString().padStart(2, "0") + ":00", mq2: avg };
  });

  return hourlyData;
}

export function MQ2Chart() {
  const [chartData, setChartData] = React.useState<
    { hour: string; mq2: number }[]
  >([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/sensor/all");
        const json = await res.json();
        setChartData(groupByHour(json));
      } catch (err) {
        console.error("Failed to fetch sensor data:", err);
      }
    };
    fetchData();
  }, []);

  const latest = chartData[chartData.length - 1] ?? { mq2: 0 };
  const avg = React.useMemo(() => {
    if (!chartData.length) return 0;
    const sum = chartData.reduce((acc, d) => acc + d.mq2, 0);
    return Math.round(sum / chartData.length);
  }, [chartData]);

  return (
    <Card className="py-0 shadow-none">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>MQ2 Sensor (hourly)</CardTitle>
          <CardDescription>
            Last 24 hours — higher values indicate higher gas concentration.
          </CardDescription>
        </div>

        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:border-l sm:px-8 sm:py-6">
            <span className="text-muted-foreground text-xs">Latest</span>
            <span className="text-lg leading-none font-bold sm:text-3xl">
              {latest.mq2}
            </span>
            <span className="text-muted-foreground text-xs">
              24h avg: {avg}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[220px] w-full"
        >
          <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
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
                  nameKey="MQ2 Value"
                  labelFormatter={(v) => `Hour: ${v}`}
                />
              }
            />
            <Bar dataKey="mq2" fill="var(--chart-mq2)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
