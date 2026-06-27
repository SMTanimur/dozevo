import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UploadCloud, GripVertical, Paperclip, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const ResourcesCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.15 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="h-full"
  >
    <Card className="h-full flex flex-col justify-between bg-card/70 backdrop-blur-md border border-border shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl relative overflow-hidden group">
      {/* Glow effect */}
      <div className="absolute -right-10 -top-10 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-colors duration-500" />

      <div>
        {/* Header */}
        <CardHeader className="flex drag-handle flex-row items-center justify-between space-y-0 pb-3 p-5 pt-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
              <Paperclip className="h-5 w-5" />
            </div>
            <CardTitle className="text-base font-bold text-foreground">Resources</CardTitle>
          </div>
          <div className="drag-handle cursor-grab text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted">
            <GripVertical className="h-4 w-4" />
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="px-5 pb-2">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex flex-col justify-center items-center h-32 border-2 border-dashed border-border hover:border-pink-500/50 hover:bg-pink-500/[0.01] rounded-xl p-5 text-muted-foreground transition-all duration-300 cursor-pointer group/drop"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="p-2.5 rounded-full bg-pink-500/5 text-pink-600 dark:text-pink-400 mb-2 group-hover/drop:bg-pink-500/10 transition-colors"
            >
              <UploadCloud className="h-6 w-6" />
            </motion.div>
            <span className="text-xs font-semibold text-foreground/80 group-hover/drop:text-primary transition-colors">
              Drop files here to attach
            </span>
            <span className="text-[10px] text-muted-foreground/60 mt-1">
              or browse from your device
            </span>
          </motion.div>
        </CardContent>
      </div>

      <div className="p-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <HelpCircle className="h-3.5 w-3.5" />
          Attachment limits
        </span>
        <span>Max 50MB per file</span>
      </div>
    </Card>
  </motion.div>
);
