import React from "react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores";
import { cn } from "@/lib/utils";

export const RadiusInit = () => {
  const { radius, setRadius } = useThemeStore();

  return (
    <div>
      <div className="mb-3  relative inline-block px-3 py-[3px] rounded bg-primary/10 text-primary  text-xs font-medium">
        Rounded
      </div>
      <div className="grid grid-cols-5 gap-2">
        {["0", "0.3", "0.5", "0.75", "1.0"].map((value) => {
          const isActive = radius === parseFloat(value);
          
          return (
            <Button
              variant="outline"
              key={value}
              onClick={() => setRadius(parseFloat(value))}

              className={cn(
                isActive
                  ? "border-primary text-primary bg-primary/10 border-2"
                  : "text-default-600"
              )}
            >
              {value}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

