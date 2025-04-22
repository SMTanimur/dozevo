import { create } from 'zustand'
import { persist, createJSONStorage } from "zustand/middleware";

import { siteConfig } from '@/configs';

interface ThemeStoreState {
  theme: string;
  setTheme: (theme: string) => void;
  radius: number;
  setRadius: (value: number) => void;

  
}

export const useThemeStore = create<ThemeStoreState>()(
 persist(
      (set) => ({
           theme: siteConfig.theme,
      setTheme: (theme) => set({ theme }),
      radius: siteConfig.radius,
      setRadius: (value) => set({ radius: value }),
     

        
      }),
      { name: "theme-store",
      storage: createJSONStorage(() => localStorage), },
    ),
)



