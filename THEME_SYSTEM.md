# Theme System Documentation

Your application uses a powerful theme system with **9 color themes** and automatic dark mode support.

## 🎨 Available Themes

1. **Zinc** (Default) - Neutral gray
2. **Neutral** - Balanced gray
3. **Red** - Bold red accent
4. **Rose** - Soft pink/rose
5. **Orange** - Warm orange
6. **Green** - Fresh green
7. **Blue** - Professional blue
8. **Yellow** - Bright yellow
9. **Violet** - Purple/violet

## 🔧 How It Works

### Theme Store

Location: `src/stores/useThemestore/index.ts`

```typescript
import { useThemeStore } from '@/stores';

const { theme, setTheme } = useThemeStore();

// Change theme
setTheme('blue'); // zinc, neutral, red, rose, orange, green, blue, yellow, violet
```

### CSS Variables

All themes use CSS variables defined in `src/styles/theme.css`:

```css
/* Each theme defines these variables */
--background
--foreground
--card
--card-foreground
--primary
--primary-foreground
--secondary
--secondary-foreground
--muted
--muted-foreground
--accent
--accent-foreground
--destructive
--destructive-foreground
--border
--input
--ring
```

## 🎯 Using Theme-Aware Colors

### ✅ DO THIS (Theme-aware):

```tsx
// Use CSS variable classes
<div className="bg-background text-foreground">
<div className="bg-card border-border">
<div className="bg-primary text-primary-foreground">
<div className="text-muted-foreground">
```

### ❌ DON'T DO THIS (Hardcoded):

```tsx
// Don't use hardcoded Tailwind colors
<div className="bg-white dark:bg-slate-900">  // ❌ Bad
<div className="bg-blue-500 text-white">      // ❌ Bad
<div className="text-gray-600">               // ❌ Bad
```

## 🧩 Helper Components

### ThemeWrapper

```tsx
import { ThemeWrapper } from '@/components/common';

<ThemeWrapper variant='default'>{children}</ThemeWrapper>;
```

### ThemeGradientBg

```tsx
import { ThemeGradientBg } from '@/components/common';

<ThemeGradientBg>{/* Background with theme-aware gradient */}</ThemeGradientBg>;
```

### ThemeCard

```tsx
import { ThemeCard } from '@/components/common';

<ThemeCard hover={true}>{/* Theme-aware card with hover effects */}</ThemeCard>;
```

### ThemeGradientText

```tsx
import { ThemeGradientText } from '@/components/common';

<ThemeGradientText>Your Gradient Text</ThemeGradientText>;
```

## 🎨 Theme Switcher Component

```tsx
import { ThemeSwitcher } from '@/components/common';

// Add to any component to allow users to change themes
<ThemeSwitcher />;
```

## 📋 Common Patterns

### Background Colors

```tsx
// Main background
className = 'bg-background';

// Card background
className = 'bg-card';

// Muted background
className = 'bg-muted';

// Accent background
className = 'bg-accent';

// Primary color
className = 'bg-primary text-primary-foreground';
```

### Text Colors

```tsx
// Main text
className = 'text-foreground';

// Muted text
className = 'text-muted-foreground';

// Primary color text
className = 'text-primary';

// Card text
className = 'text-card-foreground';
```

### Borders

```tsx
// Standard border
className = 'border-border';

// Lighter border
className = 'border-border/50';

// Input border
className = 'border-input';
```

### Buttons

```tsx
// Primary button
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">

// Destructive button
<Button className="bg-destructive text-destructive-foreground">

// Outline button (uses theme colors automatically)
<Button variant="outline">
```

## 🌙 Dark Mode

Dark mode is handled automatically! Each theme has both light and dark variants.

The system uses `next-themes` with the class strategy:

- Light mode: Default theme classes
- Dark mode: `.dark` class applied to body

## 🎭 Migration Guide

### Before (Hardcoded):

```tsx
<div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
  <div className="bg-blue-500 text-white">
    <span className="text-gray-600 dark:text-gray-400">
```

### After (Theme-aware):

```tsx
<div className="bg-background text-foreground">
  <div className="bg-primary text-primary-foreground">
    <span className="text-muted-foreground">
```

## 🚀 Benefits

✅ **9 theme colors** - Easy to switch
✅ **Automatic dark mode** - Both light and dark variants
✅ **Consistent branding** - All components match
✅ **Easy customization** - Change one place, updates everywhere
✅ **No hardcoded colors** - All use CSS variables
✅ **User preference** - Persisted in localStorage

## 🔍 Quick Reference

| Purpose         | Class Name                                   |
| --------------- | -------------------------------------------- |
| Main background | `bg-background`                              |
| Main text       | `text-foreground`                            |
| Card            | `bg-card text-card-foreground`               |
| Primary action  | `bg-primary text-primary-foreground`         |
| Secondary       | `bg-secondary text-secondary-foreground`     |
| Muted/subtle    | `bg-muted text-muted-foreground`             |
| Accent          | `bg-accent text-accent-foreground`           |
| Error/delete    | `bg-destructive text-destructive-foreground` |
| Border          | `border-border`                              |
| Input           | `border-input`                               |
| Focus ring      | `ring-ring`                                  |

## 💡 Examples

### Gradient with Theme Colors

```tsx
<div className="bg-gradient-to-br from-background via-background to-primary/5">
```

### Glassmorphism with Theme

```tsx
<div className="bg-background/80 backdrop-blur-xl border-border">
```

### Hover States

```tsx
<div className="hover:bg-primary/10 hover:border-primary/50">
```

### Shadows

```tsx
<div className="shadow-lg shadow-primary/30">
```

---

**Remember**: Always use theme variables instead of hardcoded colors for a consistent, themeable UI!
