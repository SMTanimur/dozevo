import { create } from 'zustand';

interface GlobalModalState {
  selectedTaskId: string | null;
  isTaskModalOpen: boolean;
  openTaskModal: (id: string) => void;
  closeTaskModal: () => void;
  setGlobalStore: (
    updater:
      | Partial<GlobalModalState>
      | ((prevState: GlobalModalState) => Partial<GlobalModalState>)
  ) => void;
}

export const useGlobalStateStore = create<GlobalModalState>(set => ({
  selectedTaskId: null,
  isTaskModalOpen: false,
  openTaskModal: (id: string) => {
    set({ selectedTaskId: id, isTaskModalOpen: true });
  },
  closeTaskModal: () => {
    set({ isTaskModalOpen: false });
  },

  setGlobalStore: updater => {
    set(state => ({
      ...state,
      ...(typeof updater === 'function' ? updater(state) : updater),
    }));
  },
}));
