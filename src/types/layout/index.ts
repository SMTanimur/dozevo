export interface Layout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Layouts {
  lg: Layout[];
  md: Layout[];
  sm: Layout[];
  xs: Layout[];
}

export interface LayoutStore {
  layouts: Record<string, Layouts>;
  currentPage: string;
  setLayouts: (pageId: string, layouts: Layouts) => void;
  setCurrentPage: (pageId: string) => void;
  getLayoutsForPage: (pageId: string) => Layouts | null;
}
