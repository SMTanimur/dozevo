# Modern Dashboard Components

Beautiful, animated, and reusable dashboard components built with **Framer Motion** and **Recharts**.

## 🎨 Components Overview

### 1. **Animated Wrapper Components**

Location: `src/components/common/animated-wrapper.tsx`

Reusable animation wrappers for any component:

#### `AnimatedWrapper`

```tsx
<AnimatedWrapper variant='slideUp' delay={0.2} duration={0.5}>
  <YourComponent />
</AnimatedWrapper>
```

**Props:**

- `variant`: `'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale'`
- `delay`: number (seconds)
- `duration`: number (seconds)
- `className`: string

#### `StaggerContainer`

Animate children with stagger effect:

```tsx
<StaggerContainer staggerDelay={0.1}>
  <ChildComponent />
  <ChildComponent />
  <ChildComponent />
</StaggerContainer>
```

#### `AnimatedCard`

Card with hover animation:

```tsx
<AnimatedCard delay={0.3} whileHover={true}>
  <Card>Content</Card>
</AnimatedCard>
```

#### `CountUp`

Animated number counter:

```tsx
<CountUp end={95} duration={1.5} suffix='%' prefix='$' />
```

---

### 2. **Stat Cards**

#### `AnimatedStatCard`

Location: `src/components/overview-cards/animated-stat-card.tsx`

Beautiful stat card with icon animation:

```tsx
<AnimatedStatCard
  title='Total Tasks'
  value={42}
  icon={ListChecks}
  gradient='bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700'
  iconColor='text-blue-600'
  iconBgColor='bg-blue-100 dark:bg-blue-900/30'
  delay={0}
  suffix='%'
  description='Optional description'
/>
```

**Features:**

- Animated icon with hover rotation
- Count-up animation
- Gradient background
- Floating icon animation
- Hover effects

#### `ModernDashboardStats`

Location: `src/components/overview-cards/modern-dashboard-stats.tsx`

Complete stats section with 6 cards:

```tsx
<ModernDashboardStats
  totalTasks={100}
  completionRate={75}
  dueSoon={5}
  activities={24}
  inProgress={10}
  overdue={2}
/>
```

---

### 3. **Chart Components**

#### `AnimatedChartCard`

Location: `src/components/overview-cards/animated-chart-card.tsx`

Reusable chart wrapper with animated header:

```tsx
<AnimatedChartCard
  title='Chart Title'
  description='Chart description'
  gradient='bg-gradient-to-r from-blue-500 to-purple-600'
  delay={0.3}
  height='h-80'
>
  <YourChartComponent />
</AnimatedChartCard>
```

**Features:**

- Animated gradient header
- Background pattern animation
- Customizable height
- Smooth entrance animations

#### `TaskStatusChart`

Location: `src/components/overview-cards/task-status-chart.tsx`

Interactive pie/donut chart:

```tsx
<TaskStatusChart
  data={[
    { name: 'To Do', value: 10 },
    { name: 'In Progress', value: 5 },
    { name: 'Completed', value: 20 },
  ]}
  delay={0.2}
/>
```

**Features:**

- Hover interactions
- Custom colors per status
- Animated rendering
- Percentage labels

#### `ActivityTrendChart`

Location: `src/components/overview-cards/activity-trend-chart.tsx`

Area chart for activity trends:

```tsx
<ActivityTrendChart
  data={[
    { date: 'Oct 1', count: 5 },
    { date: 'Oct 2', count: 8 },
    { date: 'Oct 3', count: 12 },
  ]}
  delay={0.3}
/>
```

**Features:**

- Gradient fill
- Smooth curves
- Animated rendering
- Responsive

#### `PriorityChart`

Location: `src/components/overview-cards/priority-chart.tsx`

Bar chart for task priorities:

```tsx
<PriorityChart
  data={[
    { name: 'High', value: 5, fill: '#ef4444' },
    { name: 'Medium', value: 8, fill: '#f59e0b' },
    { name: 'Low', value: 12, fill: '#3b82f6' },
  ]}
  delay={0.4}
/>
```

**Features:**

- Hover highlighting
- Custom colors
- Rounded bars
- Interactive

#### `WorkspaceStructureChart`

Location: `src/components/overview-cards/workspace-structure-chart.tsx`

Grouped bar chart for workspace structure:

```tsx
<WorkspaceStructureChart
  data={[
    { name: 'Project A', spaces: 5, lists: 12 },
    { name: 'Project B', spaces: 3, lists: 8 },
  ]}
  delay={0.7}
/>
```

---

### 4. **Information Cards**

#### `TasksDueSoonCard`

Location: `src/components/overview-cards/tasks-due-soon-card.tsx`

Display upcoming tasks with animations:

```tsx
<TasksDueSoonCard
  tasks={[
    { _id: '1', title: 'Task 1', dueDate: '2024-10-20', priority: 'high' },
    { _id: '2', title: 'Task 2', dueDate: '2024-10-21', priority: 'medium' },
  ]}
  delay={0.5}
/>
```

**Features:**

- Staggered task animations
- Priority badges
- Empty state with animation
- Hover effects

#### `CompletionProgressCard`

Location: `src/components/overview-cards/completion-progress-card.tsx`

Task completion progress with breakdown:

```tsx
<CompletionProgressCard
  completionRate={75}
  totalTasks={100}
  completedTasks={75}
  todoTasks={10}
  inProgressTasks={15}
  delay={0.6}
/>
```

**Features:**

- Animated progress bar
- Count-up animations
- Status breakdown cards
- Hover interactions

---

## 🚀 Usage in WorkspaceHomeScreen

The redesigned `WorkspaceHomeScreen` demonstrates all components:

```tsx
import { WorkspaceHomeScreen } from '@/app/(worksapce)/[w_id]/home/screen/workspace-home-screen';

// Usage
<WorkspaceHomeScreen w_id='workspace-id' />;
```

### Key Features:

1. **Animated Header**

   - Rotating sparkle icon
   - Gradient title
   - Completion badge

2. **Stats Grid**

   - 6 animated stat cards
   - Staggered entrance
   - Hover interactions

3. **Charts Section**

   - 3-column responsive grid
   - Task status pie chart
   - Activity trend area chart
   - Priority distribution bar chart

4. **Information Cards**

   - Tasks due soon
   - Completion progress
   - Workspace structure

5. **Loading State**
   - Skeleton components
   - Smooth transitions

---

## 🎭 Animation Variants

All components use consistent animation patterns:

- **Entrance**: Fade in + slide up
- **Stagger**: Children animate sequentially
- **Hover**: Scale up, glow effects
- **Icons**: Floating, rotating animations
- **Numbers**: Count-up effects
- **Background**: Subtle pattern movements

---

## 🎨 Design System

### Color Gradients:

- **Blue**: Stats, primary charts
- **Purple**: Activity, secondary info
- **Amber/Orange**: Priorities, warnings
- **Green**: Completion, success
- **Red**: Due soon, overdue
- **Cyan**: Progress, analytics

### Component States:

- **Loading**: Skeleton components
- **Empty**: Animated empty states
- **Hover**: Scale and glow effects
- **Active**: Highlighted states

---

## 🔧 Customization

### Adding New Stat Card:

```tsx
<AnimatedStatCard
  title='Your Metric'
  value={yourValue}
  icon={YourIcon}
  gradient='bg-gradient-to-br from-color-500 to-color-700'
  iconColor='text-color-600'
  iconBgColor='bg-color-100 dark:bg-color-900/30'
  delay={0.8}
/>
```

### Creating Custom Chart:

```tsx
<AnimatedChartCard
  title='Custom Chart'
  description='Your description'
  gradient='bg-gradient-to-r from-your-color-500 to-your-color-600'
  delay={0.5}
>
  <ResponsiveContainer>{/* Your Recharts component */}</ResponsiveContainer>
</AnimatedChartCard>
```

---

## 📦 Dependencies

All required packages are already installed:

- `motion` (Framer Motion) - Animations
- `recharts` - Charts
- `lucide-react` - Icons
- `@radix-ui` - UI components

---

## 🎯 Best Practices

1. **Delay Timing**: Increment by 0.1-0.2s for sequential animations
2. **Responsive**: All components are mobile-friendly
3. **Dark Mode**: Full dark mode support included
4. **Performance**: Memoized calculations, optimized renders
5. **Accessibility**: Proper ARIA labels and semantic HTML

---

## 📱 Responsive Breakpoints

- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3 columns
- **Large**: 6 columns (stats)

---

## 🌟 Features

✅ Smooth animations with Framer Motion
✅ Interactive charts with hover effects
✅ Count-up number animations
✅ Staggered entrance animations
✅ Gradient backgrounds
✅ Dark mode support
✅ Fully responsive
✅ Reusable components
✅ Type-safe with TypeScript
✅ Loading skeletons
✅ Empty states
✅ Hover interactions

---

## 🎓 Learn More

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Recharts Docs](https://recharts.org/)
- [Shadcn UI](https://ui.shadcn.com/)

---

Built with ❤️ using Next.js, Framer Motion, and Recharts
