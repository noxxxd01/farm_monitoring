"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  Legend,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Temperature and humidity per hour (last 24 hours)";

const chartConfig = {
  temp: {
    label: "Temperature (°C)",
    color: "var(--chart-temp, #ff7a59)",
  },
  humid: {
    label: "Humidity (%)",
    color: "var(--chart-humid, #4aa3ff)",
  },
} satisfies ChartConfig;

function generateHourlyData(hours = 24) {
  const now = new Date();
  const data: { hour: string; temp: number; humid: number }[] = [];
  for (let i = hours - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourLabel = d.getHours().toString().padStart(2, "0") + ":00";
    // simple sinusoidal mock: warmer midday, cooler night
    const tBase =
      18 + 6 * Math.sin((d.getHours() / 24) * Math.PI * 2 - Math.PI / 2);
    const temp = Math.round((tBase + (Math.random() - 0.5) * 1.5) * 10) / 10;
    // humidity roughly inverse to temperature in this mock
    const hBase =
      60 - 10 * Math.sin((d.getHours() / 24) * Math.PI * 2 - Math.PI / 2);
    const humid = Math.round((hBase + (Math.random() - 0.5) * 3) * 10) / 10;
    data.push({ hour: hourLabel, temp, humid });
  }
  return data;
}

export function TempHumidChart() {
  const chartData = React.useMemo(() => generateHourlyData(24), []);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Temperature & Humidity (hourly)</CardTitle>
        <CardDescription>
          Last 24 hours — temperature in °C and relative humidity %
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value}
            />

            {/* legend so series are clear */}
            <Legend verticalAlign="top" align="right" />

            {/* separate Y axes so temp and humidity are not stacked */}
            <YAxis yAxisId="temp" domain={[0, "dataMax + 5"]}>
              <Label
                value="Temperature (°C)"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>

            <YAxis yAxisId="humid" orientation="right" domain={[0, 100]}>
              <Label
                value="Humidity (%)"
                angle={90}
                position="insideRight"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <defs>
              <linearGradient id="fillTemp" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-temp, #ff7a59)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-temp, #ff7a59)"
                  stopOpacity={0.08}
                />
              </linearGradient>
              <linearGradient id="fillHumid" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-humid, #4aa3ff)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-humid, #4aa3ff)"
                  stopOpacity={0.08}
                />
              </linearGradient>
            </defs>

            <Area
              dataKey="humid"
              yAxisId="humid"
              type="natural"
              fill="url(#fillHumid)"
              fillOpacity={0.5}
              stroke="var(--color-humid, #4aa3ff)"
            />
            <Area
              dataKey="temp"
              yAxisId="temp"
              type="natural"
              fill="url(#fillTemp)"
              fillOpacity={0.5}
              stroke="var(--color-temp, #ff7a59)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Hourly readings — last 24h <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Updated live on the client
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
