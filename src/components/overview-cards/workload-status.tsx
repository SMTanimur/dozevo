import React, { useMemo } from 'react';
import { Card } from '../ui';
import { PieChart, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface WorkloadStatusProps {
  workloadByStatus?: Record<string, unknown>[];
}

export const WorkloadStatus = ({ workloadByStatus }: WorkloadStatusProps) => {
  // Calculate total task count to compute percentages
  const totalTasks = useMemo(() => {
    if (!workloadByStatus) return 0;
    return workloadByStatus.reduce(
      (sum, item) => sum + ((item.count as number) || 0),
      0
    );
  }, [workloadByStatus]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="p-5 h-full flex flex-col justify-between bg-card/70 backdrop-blur-md border border-border shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl relative overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute -right-10 -top-10 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors duration-500" />

        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-5 drag-handle">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <PieChart className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-foreground">Workload</h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              Status Metrics
            </span>
          </div>

          {/* List Content */}
          <div className="space-y-4">
            {workloadByStatus && workloadByStatus.length > 0 ? (
              workloadByStatus.map((item: Record<string, unknown>, idx) => {
                const count = (item.count as number) || 0;
                const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
                
                return (
                  <div key={item.status as string} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-foreground/80">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: (item.color as string) || '#9CA3AF',
                          }}
                        />
                        <span className="text-sm font-medium text-foreground">{item.status as string}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-foreground">{count}</span>
                        <span className="text-[10px] text-muted-foreground font-normal">({percentage}%)</span>
                      </div>
                    </div>
                    {/* Progress track */}
                    <div className="w-full bg-muted/50 h-2 rounded-full overflow-hidden border border-transparent">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }}
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: (item.color as string) || '#9CA3AF',
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <div className="p-3 rounded-full bg-muted/40 mb-3 text-muted-foreground/60">
                  <PieChart className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">No workload data</span>
                <span className="text-xs text-muted-foreground/60 mt-1">Create statuses and add tasks</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Info className="h-3.5 w-3.5" />
            Distribution ratios
          </span>
          <span className="font-semibold text-foreground/90">{totalTasks} total tasks</span>
        </div>
      </Card>
    </motion.div>
  );
};
