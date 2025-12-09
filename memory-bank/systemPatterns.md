# System Patterns - CUET ClassNectar

## Design System Architecture

### Color Token System
All colors are defined as HSL values in CSS variables for consistent theming:

```css
/* Core Colors (index.css) */
--background, --foreground
--card, --card-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground

/* Semantic Colors */
--success, --success-foreground  /* Green - positive states */
--warning, --warning-foreground  /* Orange - caution states */
--info, --info-foreground        /* Blue - informational */

/* Chart Colors */
--chart-present  /* Green for present attendance */
--chart-absent   /* Red for absent attendance */
--chart-late     /* Orange for late attendance */

/* Icon Accent Colors */
--icon-blue, --icon-purple, --icon-orange, --icon-green, --icon-teal
```

### Component Patterns

#### Card-Based Layouts
- Use `Card` with `bg-secondary/50` for dashboard cards
- Hover states: `hover:bg-secondary/70 hover:shadow-md`
- Consistent padding: `p-5` or `p-6`

#### Progress Component
Supports variants: `default`, `success`, `warning`, `destructive`
```tsx
<Progress value={75} variant="success" className="h-2" />
```

#### Quick Action Cards
2x3 grid layout with icon + label pattern:
```tsx
<Card className="cursor-pointer border-border bg-secondary/50">
  <CardContent className="flex flex-col items-start p-5">
    <div className={`mb-3 h-10 w-10 rounded-lg ${colorClass}`}>
      <Icon className="h-5 w-5" />
    </div>
    <span className="text-sm font-medium">{title}</span>
  </CardContent>
</Card>
```

### Dashboard Layout Pattern
Two-column responsive grid:
- Left column (2/3): Main content (Enrolled Classes, Attendance Overview)
- Right column (1/3): Quick Actions, Recent Notices

```tsx
<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
  <div className="space-y-8 lg:col-span-2">
    {/* Main content */}
  </div>
  <div className="space-y-8">
    {/* Sidebar */}
  </div>
</div>
```

### Color Usage Guidelines
- NEVER use direct colors like `text-white`, `bg-red-500`
- ALWAYS use semantic tokens: `text-foreground`, `bg-destructive`
- Icon colors use `text-icon-{color}` with matching `bg-icon-{color}/10`

## API Integration Pattern

### File Structure
- API functions in `src/api/{feature}.ts`
- Types in `src/types/index.ts`
- Mock data fallbacks in components for development

### Error Handling
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ["featureName"],
  queryFn: fetchFunction,
  retry: 1,
});
```

## Route Structure
- `/student/*` - Student pages
- `/teacher/*` - Teacher pages
- `/admin/*` - Admin pages
- Public pages at root level
