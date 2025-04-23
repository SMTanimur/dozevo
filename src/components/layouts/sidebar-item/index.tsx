"use client";

import { ElementType, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarItemProps {
  href: string;
  icon: ElementType | (() => React.ReactNode);
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  indent?: boolean;
  variant?: "default" | "accent";
  actions?: ReactNode;
  onClick?: () => void;
}

export function SidebarItem({
  href,
  icon: Icon,
  label,
  isActive = false,
  isCollapsed = false,
  indent = false,
  variant = "default",
  actions,
  onClick,
}: SidebarItemProps) {
  const IconComponent = typeof Icon === "function" ? Icon : () => <Icon className="h-5 w-5" />;
  
  const item = (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
        isActive && variant === "default" && "bg-muted text-foreground",
        isActive && variant === "accent" && "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
        indent && !isCollapsed && "ml-4",
      )}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex shrink-0 items-center justify-center">
        <IconComponent />
      </div>
      
      {!isCollapsed && (
        <>
          <span className="truncate">{label}</span>
          {actions && <div className="ml-auto flex items-center gap-1">{actions}</div>}
        </>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{item}</TooltipTrigger>
          <TooltipContent side="right" align="start" className="flex items-center gap-2">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return item;
}