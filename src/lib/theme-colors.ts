/**
 * Theme-aware color utilities
 * These functions return CSS variables that respond to theme changes
 */

export const themeColors = {
  // Background gradients
  bgGradient: 'bg-gradient-to-br from-background via-background to-primary/5',
  bgGradientSubtle:
    'bg-gradient-to-br from-muted/50 via-background to-muted/30',

  // Card styles
  card: 'bg-card border-border',
  cardHover: 'hover:bg-accent hover:border-primary/20',

  // Text gradients
  textGradient:
    'bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent',
  textMuted: 'text-muted-foreground',
  textPrimary: 'text-primary',

  // Button gradients
  buttonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  buttonSecondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80',

  // Borders
  border: 'border-border',
  borderMuted: 'border-border/50',

  // Shadows
  shadow: 'shadow-lg shadow-primary/10',
  shadowHover: 'hover:shadow-xl hover:shadow-primary/20',
};

/**
 * Get theme-aware gradient classes
 */
export const getThemeGradient = (
  variant: 'primary' | 'secondary' | 'accent' = 'primary'
) => {
  const gradients = {
    primary: 'bg-gradient-to-r from-primary via-primary/80 to-primary/60',
    secondary:
      'bg-gradient-to-r from-secondary via-secondary/80 to-secondary/60',
    accent: 'bg-gradient-to-r from-accent via-accent/80 to-accent/60',
  };
  return gradients[variant];
};

/**
 * Get theme-aware icon background
 */
export const getThemeIconBg = () => {
  return 'bg-primary/10 hover:bg-primary/20';
};

/**
 * Get theme-aware status colors (still using fixed colors for status indicators)
 */
export const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    'To Do': 'hsl(var(--chart-3))',
    'In Progress': 'hsl(var(--chart-4))',
    Completed: 'hsl(var(--chart-2))',
    Done: 'hsl(var(--chart-2))',
    Blocked: 'hsl(var(--destructive))',
    Review: 'hsl(var(--chart-1))',
    'No Status': 'hsl(var(--muted-foreground))',
  };
  return statusColors[status] || 'hsl(var(--muted-foreground))';
};
