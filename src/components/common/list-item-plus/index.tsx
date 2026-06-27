'use client';

import { ISpace } from '@/types';
import React, { useState } from 'react';
import { Button, Popover, PopoverContent, PopoverTrigger } from '../../ui';
import { FileText, ListTodo, Pencil, Plus, ChevronRight } from 'lucide-react';
import { CreateListModal } from '../../modals';
import { motion, AnimatePresence } from 'motion/react';

interface ListItemPlusProps {
  itemPlusType: 'space' | 'list';
  space: ISpace;
}

export const ListItemPlus = ({ itemPlusType, space }: ListItemPlusProps) => {
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='h-6 w-6 rounded-lg hover:bg-muted/80 text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center transition-all duration-200'
            isTooltip
            tooltipContent={
              itemPlusType === 'space'
                ? 'Create Lists, Docs and more'
                : 'Create Tasks, Notes and more'
            }
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <Plus className='h-3.5 w-3.5' />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          align='start' 
          side='right' 
          className='ml-4 w-[320px] p-0 bg-card/95 backdrop-blur-md border border-border shadow-2xl rounded-2xl overflow-hidden'
        >
          <div className='p-4 border-b border-border/50 bg-muted/20'>
            <h4 className='font-bold text-sm text-foreground'>Create new</h4>
            <p className='text-xs text-muted-foreground mt-0.5'>
              Start a new document or project in {space.name}
            </p>
          </div>
          
          <div className='p-2 space-y-1.5'>
            <AnimatePresence>
              {isOpen && (
                <div className="space-y-1.5">
                  {/* Create List */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <button
                      onClick={() => {
                        setShowCreateListModal(true);
                        setIsOpen(false);
                      }}
                      className='w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-muted/70 border border-transparent hover:border-border/40 transition-all duration-200 cursor-pointer group'
                    >
                      <div className='flex items-start gap-3 min-w-0'>
                        <div className='p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500/20 transition-colors'>
                          <ListTodo className='h-4.5 w-4.5' />
                        </div>
                        <div className='flex flex-col min-w-0'>
                          <span className='text-sm font-semibold text-foreground'>List</span>
                          <span className='text-xs text-muted-foreground truncate max-w-[200px]'>
                            Track tasks, projects, people & more
                          </span>
                        </div>
                      </div>
                      <ChevronRight className='h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all' />
                    </button>
                  </motion.div>

                  {/* Create Doc */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <button
                      onClick={() => {
                        // Will trigger creation of a new Doc (navigates or pops Modal)
                        setIsOpen(false);
                      }}
                      className='w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-muted/70 border border-transparent hover:border-border/40 transition-all duration-200 cursor-pointer group'
                    >
                      <div className='flex items-start gap-3 min-w-0'>
                        <div className='p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500/20 transition-colors'>
                          <FileText className='h-4.5 w-4.5' />
                        </div>
                        <div className='flex flex-col min-w-0'>
                          <span className='text-sm font-semibold text-foreground'>Doc</span>
                          <span className='text-xs text-muted-foreground truncate max-w-[200px]'>
                            Write notes, docs & wikis
                          </span>
                        </div>
                      </div>
                      <ChevronRight className='h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all' />
                    </button>
                  </motion.div>

                  {/* Create Whiteboard */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <button
                      onClick={() => {
                        // Will trigger creation of a new Whiteboard
                        setIsOpen(false);
                      }}
                      className='w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-muted/70 border border-transparent hover:border-border/40 transition-all duration-200 cursor-pointer group'
                    >
                      <div className='flex items-start gap-3 min-w-0'>
                        <div className='p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500/20 transition-colors'>
                          <Pencil className='h-4.5 w-4.5' />
                        </div>
                        <div className='flex flex-col min-w-0'>
                          <span className='text-sm font-semibold text-foreground'>Whiteboard</span>
                          <span className='text-xs text-muted-foreground truncate max-w-[200px]'>
                            Collaborate visually with your team
                          </span>
                        </div>
                      </div>
                      <ChevronRight className='h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all' />
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </PopoverContent>
      </Popover>
      <CreateListModal
        isOpen={showCreateListModal}
        onClose={() => setShowCreateListModal(false)}
        spaceId={space._id}
      />
    </>
  );
};
