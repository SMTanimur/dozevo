import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LayoutStore, Layouts } from '@/types';

const defaultLayouts: Layouts = {
  lg: [
    { i: 'docs', x: 0, y: 0, w: 6, h: 4 },
    { i: 'recent', x: 6, y: 0, w: 6, h: 4 },
    { i: 'tasks', x: 0, y: 4, w: 8, h: 4 },
    { i: 'stats', x: 8, y: 4, w: 4, h: 4 },
    { i: 'workload', x: 0, y: 8, w: 6, h: 4 },
    { i: 'resources', x: 6, y: 8, w: 6, h: 4 },
  ],
  md: [
    { i: 'docs', x: 0, y: 0, w: 6, h: 4 },
    { i: 'recent', x: 6, y: 0, w: 6, h: 4 },
    { i: 'tasks', x: 0, y: 4, w: 8, h: 4 },
    { i: 'stats', x: 8, y: 4, w: 4, h: 4 },
    { i: 'workload', x: 0, y: 8, w: 6, h: 4 },
    { i: 'resources', x: 6, y: 8, w: 6, h: 4 },
  ],
  sm: [
    { i: 'docs', x: 0, y: 0, w: 6, h: 4 },
    { i: 'recent', x: 0, y: 4, w: 6, h: 4 },
    { i: 'tasks', x: 0, y: 8, w: 6, h: 4 },
    { i: 'stats', x: 0, y: 12, w: 6, h: 4 },
    { i: 'workload', x: 0, y: 16, w: 6, h: 4 },
    { i: 'resources', x: 6, y: 16, w: 6, h: 4 },
  ],
  xs: [
    { i: 'docs', x: 0, y: 0, w: 4, h: 4 },
    { i: 'recent', x: 0, y: 4, w: 4, h: 4 },
    { i: 'tasks', x: 0, y: 8, w: 4, h: 4 },
    { i: 'stats', x: 0, y: 12, w: 4, h: 4 },
    { i: 'workload', x: 0, y: 16, w: 4, h: 4 },
    { i: 'resources', x: 4, y: 16, w: 4, h: 4 },
  ],
};

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set, get) => ({
      layouts: {
        'team-overview': defaultLayouts,
      },
      currentPage: 'team-overview',

      setLayouts: (pageId: string, layouts: Layouts) => {
        set(state => ({
          layouts: {
            ...state.layouts,
            [pageId]: layouts,
          },
        }));
      },

      setCurrentPage: (pageId: string) => {
        set({ currentPage: pageId });
      },

      getLayoutsForPage: (pageId: string) => {
        const state = get();
        return state.layouts[pageId] || defaultLayouts;
      },
    }),
    {
      name: 'layout-storage',
    }
  )
);
