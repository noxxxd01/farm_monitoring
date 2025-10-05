/* eslint-disable @typescript-eslint/no-explicit-any */

import { AirQualityChart } from "@/components/air-quality";
import { AlertNotif } from "@/components/alert-notif";

import { TempHumidChart } from "@/components/temp_hum_chart";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// ...existing code...

export default async function Page() {
  // dynamic data for three cards
  const metrics = [
    {
      id: "temp",
      title: "Temperature",
      description: "Current ambient temperature",
      display: "40°C",
      sub: "High",
      percent: 40,
    },
    {
      id: "humidity",
      title: "Humidity",
      description: "Current relative humidity",
      display: "68%",
      sub: "comfortable",
      percent: 68,
    },
    {
      id: "air",
      title: "Air Quality",
      description: "PM2.5 concentration",
      display: "12 µg/m³",
      sub: "Good",
      percent: 12,
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.id} className="shadow-none rounded-xl">
            <CardHeader>
              <CardTitle>{m.title}</CardTitle>
              <CardDescription>{m.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold">
                {m.display}{" "}
                <span className="text-sm text-muted-foreground">{m.sub}</span>
              </p>
            </CardContent>
            <CardFooter>
              <Progress value={m.percent} className="w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>

      <TempHumidChart />
      <div className="grid auto-rows-min gap-4 md:grid-cols-6">
        <div className="col-span-3 md:col-span-4">
          <AirQualityChart />
        </div>
        <div className="col-span-2 md:col-span-2">
          <AlertNotif />
        </div>
      </div>
    </div>
  );
}
