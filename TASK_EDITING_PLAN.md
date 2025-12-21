# Task Editing Implementation Plan

## Goal
Allow users to edit existing tasks without losing completion history or other task data.

## Implementation Approach

### 1. Update AddTaskModal Component
- Add `editingTask` prop to support both create and edit modes
- Pre-fill form fields when editing
- Change modal title to "Edit Task" when in edit mode
- Change button text to "Save Changes" when editing

### 2. Add Edit Function to useTaskManager Hook
- Create `editTask(taskId, updatedData)` function
- Find task by ID and update its properties
- Preserve `id`, `completed`, `createdAt`, and any streak data
- Update only the editable fields: description, purpose, priority, isRepeating

### 3. Update TaskItem Component
- Add "Edit" button or use long-press gesture
- Option 1: Add edit icon button next to delete button
- Option 2: Long-press on task to show edit/delete options
- Recommended: Add edit icon for explicit, accessible interaction

### 4. Update HomeScreen
- Add state for tracking which task is being edited
- Pass edit function and selected task to modal
- Handle both add and edit submission

## User Flow

1. User taps edit icon on a task
2. Modal opens with task data pre-filled
3. User modifies fields
4. User taps "Save Changes"
5. Task updates in place
6. Modal closes

## Technical Details

### AddTaskModal Props
```javascript
{
  visible: boolean,
  onClose: function,
  onSubmit: function,
  editingTask: object | null  // NEW: task object when editing
}
```

### useTaskManager Return
```javascript
{
  tasks: array,
  isLoading: boolean,
  addTask: function,
  editTask: function,  // NEW
  toggleTask: function,
  deleteTask: function,
}
```

### TaskItem Props
```javascript
{
  task: object,
  onToggle: function,
  onEdit: function,  // NEW
  onDelete: function,
}
```

## Benefits
- Users can fix typos and update task details
- No need to delete and recreate tasks
- Preserves task history and completion status
- Better user experience

## Next Steps
1. Update AddTaskModal to support editing
2. Add editTask to useTaskManager
3. Add edit button to TaskItem
4. Wire everything together in HomeScreen
5. Test thoroughly
6. Commit changes
