import { useThemeStore } from "@/stores";
import { cn } from "@/lib/utils";
import React from "react";
import { useTheme } from "next-themes";
import { Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components";
import { themes } from "@/configs";


export const ThemeChange = () => {
  const { theme, setTheme } = useThemeStore();
  const { resolvedTheme: mode } = useTheme();
  const newTheme = themes.find((t) => t.name === theme);

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(event.target.value);
  };

  return (
    <div
      style={{
        "--theme-primary": `${newTheme?.cssVars[mode === "dark" ? "dark" : "light"].primary
          }`,
      } as React.CSSProperties
      }
    >
 
      <div className="text-muted-foreground font-normal text-xs mb-4">
        Choose a Theme
      </div>
      <div className=" flex flex-wrap ">
        {[
          "zinc",
          "neutral",
          "red",
          "rose",
          "orange",
          "blue",
          "yellow",
          "violet",
        ].map((value) => {
          const themeObj = themes.find((theme) => theme.name === value);
          const isActive = theme === value; // Compare theme.name with value
          return (
            <TooltipProvider key={value}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <label>
                    <input
                      type="radio"
                      className="hidden"
                      value={value}
                      checked={theme === value} // Compare theme with value
                      onChange={handleThemeChange}
                    />
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs",
                        isActive
                          ? "border-border"
                          : "border-transparent"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full"
                        )}
                        style={{
                          backgroundColor: `hsl(${themeObj?.activeColor[
                            mode === "dark" ? "dark" : "light"
                          ]})`
                        } as React.CSSProperties}
                      >
                        {isActive && (
                          <Check className="h-4 w-4 text-primary-foreground" />
                        )}
                      </div>
                    </div>
                  </label>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  className="rounded-[0.5rem] bg-zinc-900 text-zinc-50  capitalize"
                >
                  {value}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
};


