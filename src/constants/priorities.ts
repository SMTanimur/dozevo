import { Flag, CircleOff } from 'lucide-react'; // Using CircleOff for Clear
import type React from 'react';

export type PriorityId = 'urgent' | 'high' | 'normal' | 'low';

export interface Priority {
  id: PriorityId;
  name: string;
  color: string; // Tailwind CSS color class or hex
  icon: React.FC<React.ComponentProps<'svg'>>;
}

export const PRIORITIES: Readonly<Record<PriorityId, Priority>> = {
  urgent: {
    id: 'urgent',
    name: 'Urgent',
    color: '#EF4444', // Example: Red-500
    icon: Flag,
  },
  high: {
    id: 'high',
    name: 'High',
    color: '#F59E0B', // Example: Amber-500
    icon: Flag,
  },
  normal: {
    id: 'normal',
    name: 'Normal',
    color: '#3B82F6', // Example: Blue-500
    icon: Flag,
  },
  low: {
    id: 'low',
    name: 'Low',
    color: '#A1A1AA', // Example: Zinc-400
    icon: Flag,
  },
};

export const PRIORITY_OPTIONS: Readonly<Priority[]> = Object.values(PRIORITIES);

// Define the "Clear" or "None" option separately
export const NO_PRIORITY_ID = 'none';
export interface NoPriorityOption {
  id: typeof NO_PRIORITY_ID;
  name: string;
  color: string;
  icon: React.FC<React.ComponentProps<'svg'>>;
}
export const NO_PRIORITY: Readonly<NoPriorityOption> = {
  id: NO_PRIORITY_ID,
  name: 'Clear',
  color: '#71717A', // Example: Zinc-500
  icon: CircleOff,
};

export function getPriorityDetails(
  priorityId: PriorityId | typeof NO_PRIORITY_ID | string | null | undefined
): Priority | NoPriorityOption | null {
  if (!priorityId || priorityId === NO_PRIORITY_ID) {
    // Returning null, representing no priority
    return null;
  }
  // Return the specific priority or null if the id is invalid
  return PRIORITIES[priorityId as PriorityId] || null;
}
