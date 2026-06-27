import React from 'react';
import { Card } from '@/components/ui/card';
import { File, ArrowUpRight, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface DocsCardProps {
  recentDocs?: Record<string, unknown>[];
}

export const DocsCard = ({ recentDocs }: DocsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="p-5 h-full flex flex-col justify-between bg-card/70 backdrop-blur-md border border-border shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl relative overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute -right-10 -top-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-5 drag-handle">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <File className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-foreground">Docs</h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              Wiki
            </span>
          </div>

          {/* List Content */}
          <div className="space-y-2.5">
            {recentDocs && recentDocs.length > 0 ? (
              recentDocs.map((doc: Record<string, unknown>, idx) => (
                <motion.div
                  key={(doc._id as string) || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 hover:bg-muted/70 border border-transparent hover:border-border/60 transition-all duration-200 cursor-pointer group/item"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <File className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm font-medium truncate text-foreground/90 group-hover/item:text-foreground">
                      {doc.name as string}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 text-muted-foreground group-hover/item:text-primary transition-colors">
                    <span className="text-[10px] font-medium">Read</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transform group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-transform" />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <div className="p-3 rounded-full bg-muted/40 mb-3 text-muted-foreground/60">
                  <File className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">No documents found</span>
                <span className="text-xs text-muted-foreground/60 mt-1">Create wiki docs in the Docs tab</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            Knowledge Base
          </span>
          <span>Updated recently</span>
        </div>
      </Card>
    </motion.div>
  );
};
