"use client";

import * as React from "react";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  Thermometer,
  Droplet,
  AlertTriangle,
  Wind,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";

interface SensorData {
  id: number;
  temperature: number;
  humidity: number;
  air_quality?: number; // Optional if using mq2_value or AQI
  mq2_value?: number;
  timestamp?: string;
  created_at: string;
}

const fetchLatestSensor = async (): Promise<SensorData> => {
  const res = await fetch("/api/sensor/latest");
  if (!res.ok) throw new Error("Failed to fetch latest sensor data");
  return res.json();
};

export function AlertNotif() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["latestSensor"],
    queryFn: fetchLatestSensor,
    refetchInterval: 60000, // automatically refetch every 60s
  });

  if (isLoading) {
    return (
      <Alert>
        <AlertCircleIcon />
        <AlertTitle>Loading sensor data...</AlertTitle>
        <AlertDescription>
          Please wait while we retrieve the latest readings.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>No sensor data available</AlertTitle>
        <AlertDescription>
          Could not retrieve latest sensor readings. Please check the system.
        </AlertDescription>
      </Alert>
    );
  }

  const { temperature, humidity, mq2_value, air_quality } = data;
  const alerts: React.ReactElement[] = [];

  // 🌡️ Temperature alerts
  if (temperature > 35) {
    alerts.push(
      <Alert key="temp-high">
        <Thermometer className="text-red-500" />
        <AlertTitle className="text-red-500">
          High temperature detected
        </AlertTitle>
        <AlertDescription>
          Current: <b>{temperature}°C</b>
        </AlertDescription>
      </Alert>
    );
  } else if (temperature < 20) {
    alerts.push(
      <Alert key="temp-low">
        <Thermometer />
        <AlertTitle>Low temperature detected</AlertTitle>
        <AlertDescription>
          Current: <b>{temperature}°C</b>
        </AlertDescription>
      </Alert>
    );
  }

  // 💧 Humidity alerts
  if (humidity > 70) {
    alerts.push(
      <Alert key="humid-high">
        <Droplet />
        <AlertTitle>High humidity detected</AlertTitle>
        <AlertDescription>
          Current: <b>{humidity}%</b>
        </AlertDescription>
      </Alert>
    );
  } else if (humidity < 40) {
    alerts.push(
      <Alert key="humid-low">
        <Droplet />
        <AlertTitle>Low humidity detected</AlertTitle>
        <AlertDescription>
          Current: <b>{humidity}%</b>
        </AlertDescription>
      </Alert>
    );
  }

  // 🌫️ Air quality alerts (using air_quality or mq2_value)
  const aqi = air_quality ?? mq2_value;
  if (aqi) {
    if (aqi >= 600) {
      alerts.push(
        <Alert key="air-critical" variant="destructive">
          <AlertTriangle />
          <AlertTitle>Critical Air Quality Alert</AlertTitle>
          <AlertDescription className="flex flex-row items-center gap-1">
            AQI: <b>{aqi}</b> — dangerous levels detected!
          </AlertDescription>
        </Alert>
      );
    } else if (aqi >= 450) {
      alerts.push(
        <Alert key="air-warning">
          <Wind />
          <AlertTitle>Air quality warning</AlertTitle>
          <AlertDescription>
            AQI: <b>{aqi}</b> — elevated levels detected.
          </AlertDescription>
        </Alert>
      );
    }
  }

  // ✅ All normal
  if (alerts.length === 0) {
    alerts.push(
      <Alert key="nominal">
        <CheckCircle2Icon />
        <AlertTitle>All sensors nominal</AlertTitle>
        <AlertDescription>
          Temp: {temperature}°C · Humidity: {humidity}% · AQI: {aqi ?? "N/A"}
        </AlertDescription>
      </Alert>
    );
  }

  // Display only first 5 alerts
  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      {alerts.slice(0, 5)}
    </div>
  );
}
