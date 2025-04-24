"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ChevronRight, icons, MoreHorizontal, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ISpace } from "@/types";
import { SidebarItem } from "../../sidebar-item";

interface SidebarSpaceItemProps {
  space: ISpace;
  isActive?: boolean;
  isCollapsed?: boolean;
}

export function SidebarSpaceItem({
  space,
  isActive = false,
  isCollapsed = false,
}: SidebarSpaceItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasLists = space.lists && space.lists.length > 0;

  return (
    <div>
      <div className="group w-full relative flex items-center">
        {hasLists && !isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-2 z-10 h-6 w-6 -translate-x-full p-0 opacity-0 group-hover:opacity-100"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronRight
              className={cn(
                "h-3 w-3 text-muted-foreground transition-transform",
                isExpanded && "rotate-90"
              )}
            />
          </Button>
        )}

        <SidebarItem
          href={`/space/${space._id}`}
          color={space.color}
          icon={space.avatar as keyof typeof icons}
          label={space.name}
          isActive={isActive}
          isCollapsed={isCollapsed}
          actions={
            !isCollapsed ? (
              <>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-3 w-3" />
                </Button>
              </>
            ) : null
          }
          onClick={hasLists ? () => setIsExpanded(!isExpanded) : undefined}
        />
      </div>

      {isExpanded && !isCollapsed && hasLists && (
        <div className="ml-4 mt-1 space-y-1">
          {space.lists?.map((list) => (
            <SidebarItem
              key={list._id}
              href={`/space/${space._id}/list/${list._id}`}
              color={list.color}
              icon={list.icon as keyof typeof icons}
              label={list.name}
              isCollapsed={isCollapsed}
              indent
            />
          ))}
        </div>
      )}
    </div>
  );
}