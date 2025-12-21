# Component Refactoring Plan

## Proposed Directory Structure

```
DayTracker/
├── App.js                          # Main app entry point (navigation setup)
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js           # Main tasks screen
│   │   ├── StatisticsScreen.js    # (Future) Stats dashboard
│   │   └── SettingsScreen.js      # (Future) App settings
│   ├── components/
│   │   ├── TaskItem.js             # Individual task card component
│   │   ├── TaskList.js             # List of tasks with empty state
│   │   ├── AddTaskModal.js         # Modal for creating new tasks
│   │   ├── Header.js               # App header with title
│   │   ├── EmptyState.js           # Empty state when no tasks
│   │   └── LoadingScreen.js        # Loading spinner screen
│   ├── hooks/
│   │   └── useTaskManager.js       # Custom hook for task management logic
│   ├── constants/
│   │   └── index.js                # Colors, storage keys, etc.
│   └── styles/
│       └── theme.js                # Shared theme/style constants
├── package.json
├── README.md
├── FEATURES.md
└── OPTIMIZATION_NOTES.md
```

## Screens to Create

### 1. **src/screens/HomeScreen.js**
- Main screen with all current task functionality
- Contains: Header, TaskList, AddTaskModal, AddButton
- Uses useTaskManager hook for all logic
- This becomes the main screen that's currently in App.js

### 2. **src/screens/StatisticsScreen.js** (Future)
- Dashboard with task statistics and charts
- Will be created when implementing the statistics feature

### 3. **src/screens/SettingsScreen.js** (Future)
- App settings and preferences
- Theme toggle, notifications, etc.

## Components to Create

### 1. **src/components/TaskItem.js**
- Memoized task card component
- Props: task, onToggle, onDelete
- Handles task display and interactions

### 2. **src/components/TaskList.js**
- Displays list of tasks or empty state
- Props: tasks, onToggle, onDelete
- Manages ScrollView and task mapping

### 3. **src/components/AddTaskModal.js**
- Full modal for adding tasks
- Props: visible, onClose, onSubmit, (optional) initialValues for editing
- Manages form state internally

### 4. **src/components/Header.js**
- App header with title and subtitle
- Props: title, subtitle (optional)

### 5. **src/components/EmptyState.js**
- Empty state message
- Props: message, subMessage (optional)

### 6. **src/components/LoadingScreen.js**
- Loading indicator screen
- Props: message (optional)

## Custom Hooks

### **src/hooks/useTaskManager.js**
Manages all task-related logic:
- Load tasks from storage
- Save tasks to storage
- Add, toggle, delete tasks
- Daily task reset
- Returns: { tasks, isLoading, addTask, toggleTask, deleteTask }

## Constants

### **src/constants/index.js**
Export all constants:
- PRIORITY_COLORS
- STORAGE_KEYS
- Other app-wide constants

## Benefits of This Structure

1. **Better Organization**: Clear separation of concerns
2. **Reusability**: Components can be reused easily
3. **Testability**: Easier to test individual components
4. **Maintainability**: Smaller files are easier to understand
5. **Scalability**: Easy to add new components/features
6. **Performance**: Already optimized with memo, useCallback, useMemo

## Migration Strategy

1. Create directory structure (src/screens, src/components, src/hooks, src/constants, src/styles)
2. Create constants file (src/constants/index.js)
3. Extract components one by one:
   - LoadingScreen.js
   - EmptyState.js
   - Header.js
   - TaskItem.js
   - TaskList.js
   - AddTaskModal.js
4. Create custom hook (src/hooks/useTaskManager.js)
5. Create HomeScreen.js with all the logic
6. Update App.js to render HomeScreen (preparation for future navigation)
7. Test thoroughly on device
8. Commit changes

Note: For now, App.js will simply render HomeScreen. When we add navigation later for Statistics and Settings screens, we'll add React Navigation.

## Questions to Consider

- Should AddTaskModal manage its own state or receive it via props?
- Do we want a separate styles file or keep styles with components?
- Should we create a TaskList component or keep it in App.js?
- Any additional components needed?

Please review and let me know if you'd like to:
- Add/remove any components
- Change the directory structure
- Modify the approach
- Add anything else
