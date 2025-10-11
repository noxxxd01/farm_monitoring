/* eslint-disable @typescript-eslint/no-explicit-any */
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

const chartConfig: ChartConfig = {
  temp: { label: "Temperature (°C)", color: "var(--chart-temp, #ff7a59)" },
  humid: { label: "Humidity (%)", color: "var(--chart-humid, #4aa3ff)" },
};

interface DataPoint {
  time_slot: string;
  temp: number | null;
  humid: number | null;
}

export function TempHumidChart() {
  const [chartData, setChartData] = React.useState<DataPoint[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/sensor/hourly"); // API returning time_slot
        if (!res.ok) throw new Error("Failed to fetch data");
        const json: DataPoint[] = await res.json();

        setChartData(json);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Temperature & Humidity (last 24h)</CardTitle>
        <CardDescription>
          Temperature in °C and relative humidity % — including half-hour
          readings
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time_slot"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
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
            <Legend verticalAlign="top" align="right" />
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
    </Card>
  );
}
