'use client';

import React, { useState, useMemo } from 'react';
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  parseISO,
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Search,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGlobalStateStore } from '@/stores';
import { useTaskMutations } from '@/hooks/task';
import { useGetStatuses } from '@/hooks/list';
import { ITask, IList } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskCalendarViewProps {
  workspaceId: string;
  spaceId: string;
  tasks: ITask[];
  lists: IList[];
}

export default function TaskCalendarView({
  workspaceId,
  spaceId,
  tasks,
  lists,
}: TaskCalendarViewProps) {
  const { openTaskModal } = useGlobalStateStore();
  const { createTask } = useTaskMutations();

  // Calendar navigation state
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Add Task Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDateForNewTask, setSelectedDateForNewTask] = useState<Date | null>(null);
  const [newTaskName, setNewTaskName] = useState('');
  const [selectedListId, setSelectedListId] = useState<string>(lists[0]?._id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch statuses for selected list (for task creation)
  const { data: statuses = [] } = useGetStatuses({
    workspaceId,
    spaceId,
    listId: selectedListId,
  }, {
    enabled: !!workspaceId && !!spaceId && !!selectedListId,
  });

  // Handle month navigation
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  // Filter tasks by search term
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch && !task.archived;
    });
  }, [tasks, searchTerm]);

  // Calendar dates generation
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  // Open add task dialog
  const handleOpenAddDialog = (date: Date) => {
    setSelectedDateForNewTask(date);
    setNewTaskName('');
    if (lists.length > 0 && !selectedListId) {
      setSelectedListId(lists[0]._id);
    }
    setIsAddModalOpen(true);
  };

  // Submit new task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim() || !selectedDateForNewTask || !selectedListId) return;

    setIsSubmitting(true);
    // Find the first status in the list
    const defaultStatus = statuses[0]?._id || 'open';

    try {
      await createTask({
        params: { spaceId, listId: selectedListId },
        data: {
          name: newTaskName.trim(),
          status: defaultStatus as string,
          listId: selectedListId,
          due_date: selectedDateForNewTask.toISOString(),
        },
      });
      setIsAddModalOpen(false);
      setNewTaskName('');
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-primary/5">
      {/* Calendar Header / Controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-b border-border bg-background/80 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="p-2 rounded-xl bg-primary shadow-lg shadow-primary/30"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <CalendarIcon className="h-4 w-4 text-primary-foreground" />
          </motion.div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevMonth}
                className="h-8 w-8 rounded-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
                className="h-8 w-8 rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="h-8 px-3 ml-1 rounded-lg text-xs font-medium"
              >
                Today
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-[220px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tasks..."
              className="h-9 pl-9 pr-3 rounded-lg text-sm w-full focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/30 text-center py-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-grid-pattern overflow-hidden">
        {calendarDays.map((day, idx) => {
          const isCurrentMonth = format(day, 'M') === format(currentMonth, 'M');
          
          // Get tasks due on this day
          const dayTasks = filteredTasks.filter(task => {
            if (!task.due_date) return false;
            try {
              return isSameDay(parseISO(task.due_date), day);
            } catch (e) {
              return false;
            }
          });

          return (
            <div
              key={idx}
              className={`group relative flex flex-col border-r border-b border-border p-2 min-h-[90px] overflow-hidden transition-all duration-200 ${
                isCurrentMonth ? 'bg-card/50' : 'bg-muted/10 text-muted-foreground/40'
              } ${isToday(day) ? 'bg-primary/5 ring-1 ring-primary/20 inset-0' : ''}`}
            >
              {/* Day Header */}
              <div className="flex justify-between items-center mb-1">
                <span
                  className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                    isToday(day)
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                      : isCurrentMonth
                      ? 'text-foreground'
                      : 'text-muted-foreground/30'
                  }`}
                >
                  {format(day, 'd')}
                </span>

                {/* Hover Add Task Button */}
                <button
                  onClick={() => handleOpenAddDialog(day)}
                  className="opacity-0 group-hover:opacity-100 flex items-center justify-center p-1 rounded-md text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  title="Add task on this day"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin max-h-[calc(100%-1.5rem)]">
                <AnimatePresence>
                  {dayTasks.map(task => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => openTaskModal(task._id)}
                      className="group/task flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-white hover:bg-primary/5 border border-border hover:border-primary/30 cursor-pointer shadow-sm hover:shadow transition-all duration-150 truncate"
                      style={{
                        borderLeft: `3px solid ${task.status?.color || '#3b82f6'}`,
                      }}
                    >
                      <span className="truncate flex-1 text-slate-700 group-hover/task:text-primary">
                        {task.name}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl p-6 bg-card border border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              Add Task for {selectedDateForNewTask && format(selectedDateForNewTask, 'MMM d, yyyy')}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateTask} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="task-name" className="text-sm font-semibold">
                Task Name
              </Label>
              <Input
                id="task-name"
                type="text"
                placeholder="What needs to be done?"
                value={newTaskName}
                onChange={e => setNewTaskName(e.target.value)}
                autoFocus
                className="w-full h-10 px-3 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            {lists.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="task-list" className="text-sm font-semibold">
                  List / Column Group
                </Label>
                <Select
                  value={selectedListId}
                  onValueChange={setSelectedListId}
                >
                  <SelectTrigger id="task-list" className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Select list group" />
                  </SelectTrigger>
                  <SelectContent>
                    {lists.map(list => (
                      <SelectItem key={list._id} value={list._id}>
                        {list.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg px-5 bg-primary hover:bg-primary/95 text-primary-foreground shadow-md shadow-primary/20"
              >
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
