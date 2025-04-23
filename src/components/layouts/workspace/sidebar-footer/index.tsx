import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { HelpCircle, UserPlus } from "lucide-react";

interface SidebarFooterProps {
  isCollapsed?: boolean;
}

export function SidebarFooter({ isCollapsed = false }: SidebarFooterProps) {
  return (
    <div className="border-t p-2">
      <div className={cn("flex", isCollapsed ? "flex-col" : "items-center justify-around")}>
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "sm"}
          className={cn(
            "text-muted-foreground hover:text-foreground",
            isCollapsed ? "h-10 w-10 mb-2" : "h-10 w-full"
          )}
          asChild
        >
          <Link href="/invite">
            <UserPlus className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span>Invite</span>}
          </Link>
        </Button>
        
        {isCollapsed ? null : <Separator orientation="vertical" className="h-6" />}
        
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "sm"}
          className={cn(
            "text-muted-foreground hover:text-foreground",
            isCollapsed ? "h-10 w-10" : "h-10 w-full"
          )}
          asChild
        >
          <Link href="/help">
            <HelpCircle className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span>Help</span>}
          </Link>
        </Button>
      </div>
    </div>
  );
}