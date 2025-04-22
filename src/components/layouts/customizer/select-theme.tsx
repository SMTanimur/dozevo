"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";


const allThemes = [
  { key: "light", label: "Light", icon: "Sun" },
  { key: "dark", label: "Dark", icon: "Moon" },
];

export const SelectTheme = () => {
  const { theme: mode, setTheme } = useTheme();

  return (
    <div>
      <div className="mb-1 text-sm font-medium text-default-800">Color Scheme</div>
      <div className="text-muted-foreground font-normal text-xs mb-4">
        Choose Light or Dark Scheme.
      </div>
      <div className=" grid grid-cols-2 gap-3">
        {allThemes?.map((themeOption) => {
          const isActive = mode === themeOption.key;
          return (
            <div key={themeOption.key} className="flex-1 w-full text-center">
              <button
                onClick={() => setTheme(themeOption.key)}
                className={cn(
                  "border rounded w-full flex flex-col items-center justify-center py-3 px-4 transition-colors duration-200",
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-default-200 text-default-600 hover:bg-default-100 dark:hover:bg-default-800"
                )}
                style={{
                  // Optionally apply primary color dynamically if needed elsewhere, but removed from direct styling here
                  // "--theme-primary": primaryColor ? primaryColor : undefined
                } as React.CSSProperties}
              >
                {/* @ts-expect-error - themeOption.icon is inferred as string, but Icon expects a specific union type. Best fix is outside selection (use 'as const' on allThemes). */}
                <Icon name={themeOption.icon} className="w-6 h-6 mb-1" />
              </button>
              <Label className="text-xs text-muted-foreground font-normal block mt-2">
                {themeOption.label}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
