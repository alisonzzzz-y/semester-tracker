# Semester Tracker - Project Context

## Project Overview

Semester Tracker is a weekly task management and scoring system designed for students to track study tasks, class attendance, exercise, and other meaningful activities. The app uses a point-based system with automatic weekly resets every Monday.

## Tech Stack

- **Framework**: React 18+ (single-file component)
- **UI**: Custom components with inline styles
- **Icons**: Lucide React
- **Charts**: Recharts
- **Storage**: localStorage with automatic weekly archiving
- **Styling**: Dark theme (#0d0d0d background) with purple accent (#8b5cf6)

## Core Features

### 1. Task Management
- Four task categories with different point values:
  - Study Tasks: 3-8 points (customizable via slider)
  - Class Attendance: 3 points (fixed)
  - Exercise: 7 points (fixed)
  - Other Meaningful: 3-8 points (customizable via slider)
- Task operations: add, complete, uncomplete, delete
- Smooth deletion animation (300ms fadeSlideOut)

### 2. Three Main Views

#### Dashboard
- Quick Add Task form with category pills
- Customizable point sliders for Study Tasks and Other Meaningful
- Four stat cards: Weekly Score, Streak, Today, This Week
- Three task sections:
  - Today's Tasks (created today)
  - This Week's Tasks (created this week, excluding today)
  - Previous Tasks (created before this Monday)

#### Calendar
- Month view with Monday-Sunday week layout
- Left panel (2/3 width): Calendar grid with task status dots
- Right panel (1/3 width): Selected date task details
- Features:
  - Purple ring for selected date
  - Purple dot for today
  - Colored dots for completed/incomplete tasks
  - "Today" button to jump to current date

#### Statistics
- Overview cards: Total Tasks, Completed, Total Points, Completion %
- Weekly Performance chart (last 7 weeks from history + current week)
- Category Breakdown with completion counts (not percentages)
- 30-Day Activity heatmap

### 3. Weekly Reset System

**Every Monday at 00:00:**
- `weeklyScore` resets to 0
- `streak` (consecutive days) resets to 0
- Previous week data saved to `weekHistory` array
- `lastWeeklyReset` timestamp updated

**Week Calculation:**
- Week starts Monday, ends Sunday
- `getThisMonday()` helper function calculates current week's Monday
- All week-based statistics use this Monday as the baseline

### 4. Data Structure

```javascript
// localStorage schema
{
  tasks: [
    {
      id: timestamp,
      text: string,
      category: "Study Tasks" | "Class Attendance" | "Exercise" | "Other Meaningful",
      completed: boolean,
      date: ISO string,
      score: number,
      completedAt?: ISO string
    }
  ],
  weeklyScore: number,
  streak: number,
  lastWeeklyReset: ISO string,
  weekHistory: [
    {
      startDate: ISO string (Monday),
      endDate: ISO string (Sunday),
      score: number,
      tasksCompleted: number,
      totalTasks: number
    }
  ]
}
```

### 5. Streak Logic

Streak represents consecutive days in the **current week** where tasks were completed:
- Starts from 0 on Monday
- Increments only if tasks completed on consecutive days
- Breaks if a day is skipped
- Resets every Monday

**Example:**
```
Monday ✓ Completed → Streak = 1
Tuesday ✓ Completed → Streak = 2
Wednesday ✗ No tasks → Streak = 2 (no change, but will break if Thursday is completed)
Thursday ✓ Completed → Streak = 1 (new streak from Thursday only)
```

## Design System

### Colors
- **Background**: #0d0d0d (deep gray, not pure black)
- **Surface-1**: #1c1c1e (cards)
- **Surface-2**: #222222 (inputs, chips)
- **Surface-3**: #2a2a2a (hover states)
- **Primary Accent**: #8b5cf6 (purple)
- **Category Colors**:
  - Study Tasks: #8b5cf6 (purple)
  - Class Attendance: #7C3AED (deep purple)
  - Exercise: #F97316 (orange)
  - Other Meaningful: #8b5cf6 (purple)

### Typography
- **Font**: Inter, -apple-system, BlinkMacSystemFont
- **Text Hierarchy**:
  - Primary: #ffffff (100%)
  - Secondary: #d1d1d1 (82%)
  - Tertiary: #8a8a8a (54%)
  - Disabled: #555555 (33%)

### Spacing
- 8pt grid system: 8, 12, 16, 24, 32, 48px
- Card padding: 32px (p-8)
- Card gap: 24px (gap-6)

### Border Radius
- Cards: 16px (rounded-2xl)
- Buttons: 12px (rounded-xl)
- Pills: 24px (rounded-full)
- Small elements: 8px (rounded-lg)

### Animations
- Transition duration: 150-300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Delete animation: 300ms fadeSlideOut with translateX(-20px) and scale(0.95)

## Key Functions

### Task Operations
- `addTask()` - Creates new task, shows success notification
- `completeTask(taskId)` - Marks complete, updates score and streak
- `uncompleteTask(taskId)` - Reverts completion, deducts score
- `deleteTask(taskId)` - Adds to deletingTasks Set, removes after 300ms animation

### Date Helpers
- `getThisMonday()` - Returns Monday 00:00:00 of current week
- `getTodayTasks()` - Filters tasks created today
- `getWeekTasks()` - Filters tasks created this week (Monday to now)
- `getPreviousTasks()` - Filters tasks created before this Monday

### Statistics
- `getWeeklyTrend()` - Returns 7 weeks (6 from history + current week)
- `getCategoryStats()` - Returns completion counts per category
- `getCalendarData()` - Returns 30 days of task activity

## File Structure

```
semester-tracker.jsx (single file containing):
├── State management (useState hooks)
├── Data persistence (useEffect + localStorage)
├── Weekly reset logic (on load check)
├── Task operation functions
├── Helper functions (date, filtering)
├── View rendering logic
├── DashboardView component
├── CalendarView component
├── StatsView component
└── WeeklyChart component
```

## Common Customization Requests

### Change Theme Color
Replace all instances of `#8b5cf6` with desired color. Update `categories` object colors.

### Adjust Weekly Target
Currently 100 points. Modify display in Dashboard stats card.

### Add New Category
Add entry to `categories` object:
```javascript
'New Category': { 
  score: 5,           // or null for customizable
  color: '#hex', 
  icon: '🎯', 
  fixed: true,        // or false for slider
  min: 3,             // if fixed: false
  max: 8              // if fixed: false
}
```

### Change Week Start Day
Modify `getThisMonday()` logic to calculate from desired day. Update calendar header array.

### Modify Reset Schedule
Change condition in first `useEffect` from checking Monday to desired day/time.

## Important Patterns

### Avoid Layout Shift
- Use `outline` instead of `border` for focus states
- Use `boxShadow: 0 0 0 Xpx` instead of `border: Xpx` for rings
- Set `minHeight` and `maxHeight` to same value for fixed-height containers

### State Updates
- Use functional updates: `setScore(prev => prev + points)`
- Batch related state updates in same function
- Update localStorage via useEffect dependency array

### Performance
- Use `deletingTasks` Set to track animations before removal
- Implement smooth 300ms delete animation
- Apply `transition-all duration-150` for hover states

### Error Prevention
- Check `task.completed` before toggling
- Filter out null dates in calendar grid
- Validate `customScore` is within min/max range

## Known Constraints

- **Single File**: All code in one .jsx file for portability
- **No Backend**: Uses localStorage only (client-side)
- **No Authentication**: Single-user application
- **Desktop-First**: Optimized for desktop, mobile is functional but not primary
- **Browser Storage Limit**: ~5-10MB localStorage limit
- **Week History**: Unlimited growth (could be capped in future)

## Extension Points

### Easy Additions
- Task search/filter
- Export data (CSV/JSON)
- Import data
- Light theme toggle
- Custom category icons

### Medium Complexity
- Task tags/labels
- Task priorities
- Recurring tasks
- Task notes/descriptions
- Multiple users (requires backend)

### Complex Features
- Cloud sync (Supabase/Firebase)
- Mobile app (React Native)
- Shared workspaces
- AI suggestions
- Analytics dashboard

## Development Guidelines

### When Modifying Code
1. Maintain single-file structure unless explicitly asked to split
2. Preserve dark theme and purple accent unless requested otherwise
3. Keep 8pt spacing grid
4. Use existing animation patterns
5. Update localStorage schema version if data structure changes

### When Adding Features
1. Add state at top level
2. Create helper functions before components
3. Pass functions as props to child components
4. Update localStorage save/load logic
5. Consider weekly reset implications

### When Fixing Bugs
1. Check browser console for errors
2. Verify localStorage data structure
3. Test weekly reset logic with date manipulation
4. Test across Chrome, Safari, Firefox
5. Check mobile viewport if UI-related

## Testing Checklist

- [ ] Add task in each category
- [ ] Complete and uncomplete tasks
- [ ] Delete tasks (verify animation)
- [ ] Switch between all three views
- [ ] Click dates in calendar
- [ ] Use Today button in calendar
- [ ] Adjust sliders for customizable categories
- [ ] Verify weekly score updates
- [ ] Check streak calculation
- [ ] Navigate to previous/next month
- [ ] Test on Monday (reset day)
- [ ] Verify data persists after refresh

## Performance Targets

- Time to Interactive: < 1s
- First Contentful Paint: < 0.5s
- Task add/complete response: < 100ms
- Animation smoothness: 60fps
- localStorage operations: < 50ms

---

**Last Updated**: 2026-03-10
**Version**: 1.0
**Author**: Built collaboratively with Claude
