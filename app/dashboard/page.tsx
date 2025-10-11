/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { AlertNotif } from "@/components/alert-notif";
import { TempHumidChart } from "@/components/temp_hum_chart";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Threshold } from "@/components/threshold";
import { MQ2Chart } from "@/components/air-quality";

export default function Page() {
  const [data, setData] = React.useState<any>(null);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);
  const [isInactive, setIsInactive] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/sensor/latest");
        const json = await res.json();
        if (res.ok) {
          setData(json);
          setLastUpdated(new Date(json.created_at)); // track latest data time
        }
      } catch (err) {
        console.error("Error fetching sensor data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // ⏰ Detect inactivity (no new data in 5 minutes)
  React.useEffect(() => {
    const checkInactive = setInterval(() => {
      if (!lastUpdated) return;
      const now = new Date();
      const diffMinutes = (now.getTime() - lastUpdated.getTime()) / 60000;
      setIsInactive(diffMinutes > 5); // more than 5 minutes = inactive
    }, 60000); // check every minute

    return () => clearInterval(checkInactive);
  }, [lastUpdated]);

  const metrics = [
    {
      id: "temp",
      title: "Temperature",
      description: "Current ambient temperature",
      display: data ? `${data.temperature.toFixed(1)}°C` : "--",
      sub:
        data && data.temperature > 35
          ? "High"
          : data && data.temperature < 25
          ? "Low"
          : "Normal",
      percent: data ? Math.min(data.temperature, 100) : 0,
      color:
        data && data.temperature > 35
          ? "bg-red-500"
          : data && data.temperature < 25
          ? "bg-blue-500"
          : "bg-green-500",
    },
    {
      id: "humidity",
      title: "Humidity",
      description: "Current relative humidity",
      display: data ? `${data.humidity.toFixed(1)}%` : "--",
      sub:
        data && data.humidity > 70
          ? "Humid"
          : data && data.humidity < 40
          ? "Dry"
          : "Comfortable",
      percent: data ? data.humidity : 0,
      color:
        data && data.humidity > 70
          ? "bg-red-500"
          : data && data.humidity < 40
          ? "bg-blue-500"
          : "bg-green-500",
    },
    {
      id: "mq2",
      title: "Air Quality (MQ-2)",
      description: "Gas sensor reading (ppm)",
      display: data ? `${data.mq2_value} ppm` : "--",
      sub:
        data && data.mq2_value > 1000
          ? "Critical"
          : data && data.mq2_value > 600
          ? "Poor"
          : data && data.mq2_value > 300
          ? "Moderate"
          : "Good",
      percent: data ? Math.min((data.mq2_value / 1500) * 100, 100) : 0,
      color:
        data && data.mq2_value > 1000
          ? "bg-red-500"
          : data && data.mq2_value > 600
          ? "bg-yellow-500"
          : "bg-green-500",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* 🌐 Inactive alert */}
      {isInactive && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-800 rounded-md text-center font-medium">
          ⚠️ Sensor inactive — no data received in the last 5 minutes.
        </div>
      )}

      <div className="grid auto-rows-min gap-4 xl:grid-cols-2">
        <div className="col-span-1">
          <div className="grid auto-cols-auto gap-4 lg:grid-cols-2">
            {metrics.map((m) => (
              <Card key={m.id} className="shadow-none rounded-xl">
                <CardHeader>
                  <CardTitle>{m.title}</CardTitle>
                  <CardDescription>{m.description}</CardDescription>
                  <CardAction>
                    <span
                      className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        isInactive
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 me-1 rounded-full ${
                          isInactive ? "bg-red-500" : "bg-green-500"
                        }`}
                      ></span>
                      {isInactive ? "Inactive" : "Active"}
                    </span>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className="text-5xl font-bold">
                    {m.display}{" "}
                    <span className="text-sm text-muted-foreground">
                      {m.sub}
                    </span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Progress
                    value={isInactive ? 0 : m.percent}
                    className={`w-full ${m.color}`}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="col-span-1">
          <Threshold />
        </div>
      </div>

      <TempHumidChart />
      <div className="grid auto-rows-min gap-4 xl:grid-cols-6">
        <div className="col-span-3 md:col-span-4">
          <MQ2Chart />
        </div>
        <div className="col-span-2 md:col-span-2">
          <AlertNotif />
        </div>
      </div>
    </div>
  );
}
