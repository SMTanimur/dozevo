import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock, CheckCircle2, Circle, AlertCircle, ArrowRight, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface RecentCardProps {
  recentTasks?: Record<string, unknown>[];
}

export const RecentCard = ({ recentTasks }: RecentCardProps) => {
  const getTaskIcon = (status?: string) => {
    if (!status) return <Circle className="h-4 w-4 text-muted-foreground" />;

    const statusLower = status.toLowerCase();
    if (statusLower.includes('complete') || statusLower.includes('done')) {
      return (
        <div className="p-1 rounded-md bg-green-500/10 text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
        </div>
      );
    } else if (statusLower.includes('progress')) {
      return (
        <div className="p-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Clock className="h-3.5 w-3.5 animate-pulse" />
        </div>
      );
    } else {
      return (
        <div className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <AlertCircle className="h-3.5 w-3.5" />
        </div>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="p-5 h-full flex flex-col justify-between bg-card/70 backdrop-blur-md border border-border shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl relative overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute -right-10 -top-10 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors duration-500" />

        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-5 drag-handle">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Clock className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-foreground">Recent Tasks</h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              Updates
            </span>
          </div>

          {/* List Content */}
          <div className="space-y-2.5">
            {recentTasks && recentTasks.length > 0 ? (
              recentTasks.map((task: Record<string, unknown>, idx) => {
                const statusObj = task.status as Record<string, unknown>;
                const statusName = (statusObj?.status as string) || '';
                return (
                  <motion.div
                    key={(task._id as string) || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 hover:bg-muted/70 border border-transparent hover:border-border/60 transition-all duration-200 cursor-pointer group/item"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {getTaskIcon(statusName)}
                      <span className="text-sm font-medium truncate text-foreground/90 group-hover/item:text-foreground">
                        {task.name as string}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: `${statusObj?.color || '#9CA3AF'}10`,
                          color: (statusObj?.color as string) || '#9CA3AF',
                          borderColor: `${statusObj?.color || '#9CA3AF'}20`,
                        }}
                      >
                        {statusName}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all" />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <div className="p-3 rounded-full bg-muted/40 mb-3 text-muted-foreground/60">
                  <Activity className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">No recent tasks</span>
                <span className="text-xs text-muted-foreground/60 mt-1">Create or update tasks to see activity</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Activity className="h-3.5 w-3.5" />
            Activity Log
          </span>
          <span>Synced live</span>
        </div>
      </Card>
    </motion.div>
  );
};
