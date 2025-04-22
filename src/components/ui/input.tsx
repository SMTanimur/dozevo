import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";
import { icons } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: keyof typeof icons;
  inputClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputClassName, icon, type, ...props }, ref) => {
    if (icon) {
      return (
        <label className={cn("relative block w-full", className)}>
          <Icon
            name={icon}
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground"
          />
          <input
            autoComplete="off"
            data-testid=""
            type={type}
            className={cn(
              "nopan nodelete nodrag noflow flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors pl-9 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              inputClassName,
            )}
            ref={ref}
            {...props}
          />
        </label>
      );
    } else {
      return (
        <input
          data-testid=""
          type={type}
          className={cn(
            "nopan nodelete nodrag noflow flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
          )}
          ref={ref}
          {...props}
        />
      );
    }
  },
);
Input.displayName = "Input";

export { Input };
