// ...existing code...
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  Thermometer,
  Droplet,
  AlertTriangle,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertNotif() {
  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>All sensors nominal</AlertTitle>
        <AlertDescription>
          Temp: 22°C · Humidity: 55% · NH3: 1.2 ppm · H2S: 0.3 ppm
        </AlertDescription>
      </Alert>

      <Alert>
        <Thermometer />
        <AlertTitle>High temperature detected</AlertTitle>
        <AlertDescription>
          Sensor A1: 40°C — recommend increasing ventilation or shade. Verify
          sensor units and trend.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>Elevated NH3 / H2S levels</AlertTitle>
        <AlertDescription>
          Latest: NH3 25 ppm · H2S 5 ppm — odour and health risk in pig pen.
          <ul className="list-inside list-disc text-sm mt-2">
            <li>
              Immediate: ventilate and remove animals from area if possible
            </li>
            <li>Notify operations staff</li>
            <li>Inspect manure handling and drainage</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
// ...existing code...
