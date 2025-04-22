
import { create } from 'zustand';

interface GlobalModalState {
 

  setGlobalStore: (
    updater:
      | Partial<GlobalModalState>
      | ((prevState: GlobalModalState) => Partial<GlobalModalState>)
  ) => void;
}

export const useGlobalStateStore = create<GlobalModalState>(set => ({





  setGlobalStore: updater => {
    set(state => ({
      ...state,
      ...(typeof updater === 'function' ? updater(state) : updater),
    }));
  },
}));
