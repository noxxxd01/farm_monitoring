"use client";

import { DataTable } from "@/components/data-table"; // adjust path
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Columns2 } from "lucide-react";
import { VisibilityState } from "@tanstack/react-table";
import { CardDescription } from "@/components/ui/card";

export default function Page() {
  // Column visibility state
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: true,
      temperature: true,
      humidity: true,
      airQuality: true,
      timestamp: true,
      action: true,
    });

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Data Tables</h1>
          <CardDescription className="text-muted-foreground">
            Monitor environmental data
          </CardDescription>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shadow-none">
                <Columns2 className="w-4 h-4" />
                Customize Columns
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={columnVisibility.temperature}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    temperature: checked,
                  }))
                }
              >
                Temperature
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.humidity}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    humidity: checked,
                  }))
                }
              >
                Humidity
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.airQuality}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    airQuality: checked,
                  }))
                }
              >
                Air Quality
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.timestamp}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    timestamp: checked,
                  }))
                }
              >
                Timestamp
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.action}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    action: checked,
                  }))
                }
              >
                Status
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Pass columnVisibility to your DataTable */}
      <DataTable columnVisibility={columnVisibility} />
    </div>
  );
}
