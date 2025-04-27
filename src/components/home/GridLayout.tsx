import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
  import { useLayoutStore } from '@/stores/layoutStore';
  import { Layout } from '@/types';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface GridLayoutProps {
  pageId: string;
  children: React.ReactNode;
}

export const GridLayout: React.FC<GridLayoutProps> = ({ pageId, children }) => {
  const { getLayoutsForPage, setLayouts } = useLayoutStore();
  const layouts = getLayoutsForPage(pageId);

  const handleLayoutChange = (
    _: Layout[],
    allLayouts: { lg: Layout[]; md: Layout[]; sm: Layout[]; xs: Layout[] }
  ) => {
    setLayouts(pageId, allLayouts);
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts as unknown as ReactGridLayout.Layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
      cols={{ lg: 12, md: 12, sm: 6, xs: 4 }}
      rowHeight={100}
      margin={[16, 16]}
      draggableHandle=".drag-handle"
      isDraggable
      isResizable
      onLayoutChange={handleLayoutChange}
    >
      {children}
    </ResponsiveGridLayout>
  );
};

