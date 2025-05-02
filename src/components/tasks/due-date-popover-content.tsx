'use client';

import React from 'react';
import {
  format,
  addDays,
  startOfDay,
  nextMonday,
  endOfWeek,
  isToday,
  isTomorrow,
} from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

// Helper function for relative date formatting (can be moved to utils)
export const formatRelativeDate = (date: Date | undefined | null): string => {
  if (!date) return 'Set date';
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  // Add other relative checks if needed (e.g., Yesterday)
  return format(date, 'MMM d');
};

interface QuickSelectButtonProps {
  label: string;
  date: Date;
  onSelect: (date: Date) => void;
  secondaryLabel?: string;
}

const QuickSelectButton: React.FC<QuickSelectButtonProps> = ({
  label,
  date,
  onSelect,
  secondaryLabel,
}) => (
  <Button
    variant='ghost'
    size='sm'
    className='w-full justify-start text-sm font-normal px-2 py-1.5 h-auto'
    onClick={() => onSelect(date)}
  >
    <span className='flex-grow'>{label}</span>
    {secondaryLabel && (
      <span className='text-xs text-gray-500'>{secondaryLabel}</span>
    )}
  </Button>
);

interface DueDatePopoverContentProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined | null) => void; // Allow null for clearing
}

export function DueDatePopoverContent({
  selectedDate,
  onDateSelect,
}: DueDatePopoverContentProps) {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const nextWeek = nextMonday(today);
  // Corrected calculation for Saturday of the *current* week
  const thisWeekendSat = addDays(
    startOfDay(endOfWeek(today, { weekStartsOn: 1 })),
    -1
  );

  const quickSelectOptions = [
    { label: 'Today', date: today, secondaryLabel: format(today, 'EEE') },
    {
      label: 'Tomorrow',
      date: tomorrow,
      secondaryLabel: format(tomorrow, 'EEE'),
    },
    {
      label: 'This weekend',
      date: thisWeekendSat,
      secondaryLabel: format(thisWeekendSat, 'EEE'),
    },
    {
      label: 'Next week',
      date: nextWeek,
      secondaryLabel: format(nextWeek, 'MMM d'),
    },
    // TODO: Add other options like Next weekend, 2 weeks, 4 weeks
  ];

  return (
    <div className='flex p-2'>
      {/* Left Panel: Quick Selects */}
      <div className='w-40 pr-3 mr-3 flex flex-col gap-1'>
        {/* "No due date" Button (acts as clear) */}
        <Button
          variant='outline'
          size='sm'
          className='justify-start text-sm font-normal mb-2 h-8'
          onClick={() => onDateSelect(null)}
        >
          <span
            className={
              !selectedDate ? 'text-blue-600 font-medium' : 'text-gray-600'
            }
          >
            No due date
          </span>
        </Button>

        <p className='text-xs font-semibold mb-1 px-2 text-gray-600'>
          Suggestions
        </p>
        {quickSelectOptions.map(opt => (
          <QuickSelectButton
            key={opt.label}
            label={opt.label}
            date={opt.date}
            onSelect={onDateSelect}
            secondaryLabel={opt.secondaryLabel}
          />
        ))}
      </div>

      {/* Right Panel: Calendar */}
      <div className=''>
        <Calendar
          mode='single'
          selected={selectedDate}
          onSelect={onDateSelect}
          initialFocus
          month={selectedDate}
        />
      </div>
    </div>
  );
}
