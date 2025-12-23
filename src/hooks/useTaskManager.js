import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { STORAGE_KEYS, PRIORITY_ORDER } from '../constants';

export default function useTaskManager() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Save tasks to AsyncStorage
  const saveTasks = useCallback(async (updatedTasks) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
      Alert.alert('Error', 'Failed to save goals. Please try again.');
    }
  }, []);

  // Load tasks and reset daily tasks on mount
  useEffect(() => {
    const migrateToSubtasks = async () => {
      try {
        const version = await AsyncStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);

        if (version !== '2.0') {
          const storedTasks = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
          if (storedTasks) {
            const tasks = JSON.parse(storedTasks);
            const migratedTasks = tasks.map(task => ({
              ...task,
              subtasks: task.subtasks || []  // Add empty array if missing
            }));

            await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(migratedTasks));
            await AsyncStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, '2.0');
            console.log('Migrated tasks to schema version 2.0');
          }
        }
      } catch (error) {
        console.error('Migration error:', error);
      }
    };

    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        Alert.alert('Error', 'Failed to load goals.');
      } finally {
        setIsLoading(false);
      }
    };

    const resetDailyTasks = async () => {
      try {
        const lastResetDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_RESET);
        const today = new Date().toDateString();

        if (lastResetDate !== today) {
          const storedTasks = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
          if (storedTasks) {
            const parsedTasks = JSON.parse(storedTasks);
            const updatedTasks = parsedTasks.map(task =>
              task.isRepeating ? { ...task, completed: false } : task
            );
            await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
            setTasks(updatedTasks);
          }
          await AsyncStorage.setItem(STORAGE_KEYS.LAST_RESET, today);
        }
      } catch (error) {
        console.error('Error resetting daily tasks:', error);
      }
    };

    // Run migration first, then load tasks
    migrateToSubtasks().then(() => {
      loadTasks();
      resetDailyTasks();
    });
  }, []);

  // Calculate streak for a task based on completion history
  const calculateStreak = useCallback((completionHistory) => {
    if (!completionHistory || completionHistory.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const sortedDates = [...completionHistory].sort((a, b) => new Date(b) - new Date(a));
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Check if there's a completion today or yesterday to start current streak
    const latestCompletion = new Date(sortedDates[0]).toDateString();
    if (latestCompletion === today || latestCompletion === yesterday) {
      currentStreak = 1;
      tempStreak = 1;

      // Count consecutive days
      for (let i = 1; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i]).toDateString();
        const previousDate = new Date(sortedDates[i - 1]);
        const expectedDate = new Date(previousDate.getTime() - 86400000).toDateString();

        if (currentDate === expectedDate) {
          currentStreak++;
          tempStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    tempStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]).toDateString();
      const previousDate = new Date(sortedDates[i - 1]);
      const expectedDate = new Date(previousDate.getTime() - 86400000).toDateString();

      if (currentDate === expectedDate) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }, []);

  // Add a new task
  const addTask = useCallback((taskData) => {
    if (!taskData.description.trim()) {
      Alert.alert('Error', 'Please enter a goal description');
      return false;
    }

    // Calculate the order for the new task (append to end)
    const maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order || 0)) : 0;

    const newTask = {
      id: Date.now().toString(),
      description: taskData.description,
      purpose: taskData.purpose,
      priority: taskData.priority,
      isRepeating: taskData.isRepeating,
      category: taskData.category || 'personal',
      dueDate: taskData.dueDate || null,
      dueTime: taskData.dueTime || null,
      completed: false,
      createdAt: new Date().toISOString(),
      completionHistory: [],
      currentStreak: 0,
      longestStreak: 0,
      order: maxOrder + 1,
      subtasks: [],
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    return true;
  }, [tasks, saveTasks]);

  // Edit an existing task
  const editTask = useCallback((taskData) => {
    if (!taskData.description.trim()) {
      Alert.alert('Error', 'Please enter a goal description');
      return false;
    }

    const updatedTasks = tasks.map(task => {
      if (task.id === taskData.id) {
        // Preserve original task data, only update editable fields
        return {
          ...task,
          description: taskData.description,
          purpose: taskData.purpose,
          priority: taskData.priority,
          isRepeating: taskData.isRepeating,
          category: taskData.category || task.category || 'personal',
          dueDate: taskData.dueDate !== undefined ? taskData.dueDate : task.dueDate,
          dueTime: taskData.dueTime !== undefined ? taskData.dueTime : task.dueTime,
        };
      }
      return task;
    });

    saveTasks(updatedTasks);
    return true;
  }, [tasks, saveTasks]);

  // Toggle task completion
  const toggleTask = useCallback((taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const isCompleting = !task.completed;
        const today = new Date().toDateString();
        let updatedCompletionHistory = task.completionHistory || [];

        if (isCompleting && task.isRepeating) {
          // Add today's date to completion history if not already there
          const todayAlreadyCompleted = updatedCompletionHistory.some(
            date => new Date(date).toDateString() === today
          );

          if (!todayAlreadyCompleted) {
            updatedCompletionHistory = [...updatedCompletionHistory, new Date().toISOString()];
          }
        } else if (!isCompleting && task.isRepeating) {
          // Remove today's completion from history when uncompleting
          updatedCompletionHistory = updatedCompletionHistory.filter(
            date => new Date(date).toDateString() !== today
          );
        }

        // Calculate updated streaks
        const { currentStreak, longestStreak } = calculateStreak(updatedCompletionHistory);

        return {
          ...task,
          completed: isCompleting,
          completionHistory: updatedCompletionHistory,
          currentStreak,
          longestStreak: Math.max(task.longestStreak || 0, longestStreak),
        };
      }
      return task;
    });
    saveTasks(updatedTasks);
  }, [tasks, saveTasks, calculateStreak]);

  // Delete a task
  const deleteTask = useCallback((taskId) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            saveTasks(updatedTasks);
          },
        },
      ]
    );
  }, [tasks, saveTasks]);

  // Reorder tasks (for drag and drop)
  const reorderTasks = useCallback((reorderedTasks) => {
    // Update order field for each task based on new position
    const tasksWithNewOrder = reorderedTasks.map((task, index) => ({
      ...task,
      order: index,
    }));
    saveTasks(tasksWithNewOrder);
  }, [saveTasks]);

  // Helper function to check if a task is overdue
  const isOverdue = useCallback((task) => {
    if (!task.dueDate || task.completed) return false;

    const now = new Date();
    const dueDateTime = new Date(task.dueDate);

    if (task.dueTime) {
      const [hours, minutes] = task.dueTime.split(':');
      dueDateTime.setHours(parseInt(hours), parseInt(minutes));
      return now > dueDateTime;
    }

    // If no time specified, consider it due at end of day
    dueDateTime.setHours(23, 59, 59);
    return now > dueDateTime;
  }, []);

  // Memoized sorted tasks
  const sortedTasks = useMemo(() => {
    // First, ensure all tasks have an order field (for backwards compatibility)
    const tasksWithOrder = tasks.map((task, index) => ({
      ...task,
      order: task.order !== undefined ? task.order : index,
    }));

    return [...tasksWithOrder].sort((a, b) => {
      // Completed tasks go to bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Overdue tasks at the top (for uncompleted tasks)
      const aOverdue = isOverdue(a);
      const bOverdue = isOverdue(b);
      if (aOverdue !== bOverdue) {
        return aOverdue ? -1 : 1;
      }

      // Tasks with due dates before tasks without
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;

      // Sort by due date if both have one
      if (a.dueDate && b.dueDate) {
        const dateCompare = new Date(a.dueDate) - new Date(b.dueDate);
        if (dateCompare !== 0) return dateCompare;

        // If same date, sort by time
        if (a.dueTime && b.dueTime) {
          return a.dueTime.localeCompare(b.dueTime);
        }
        if (a.dueTime && !b.dueTime) return -1;
        if (!a.dueTime && b.dueTime) return 1;
      }

      // Sort by priority
      const priorityCompare = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (priorityCompare !== 0) return priorityCompare;

      // Finally, use manual order for tasks with same priority
      return (a.order || 0) - (b.order || 0);
    });
  }, [tasks, isOverdue]);

  // Add a subtask to a task
  const addSubtask = useCallback((taskId, description) => {
    if (!description || !description.trim()) {
      return false;
    }

    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newSubtask = {
          id: Date.now().toString(),
          description: description.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
        };
        return {
          ...task,
          subtasks: [...(task.subtasks || []), newSubtask],
        };
      }
      return task;
    });

    saveTasks(updatedTasks);
    return true;
  }, [tasks, saveTasks]);

  // Toggle a subtask's completion status
  const toggleSubtask = useCallback((taskId, subtaskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = (task.subtasks || []).map(subtask => {
          if (subtask.id === subtaskId) {
            return {
              ...subtask,
              completed: !subtask.completed,
              completedAt: !subtask.completed ? new Date().toISOString() : null,
            };
          }
          return subtask;
        });
        return {
          ...task,
          subtasks: updatedSubtasks,
        };
      }
      return task;
    });

    saveTasks(updatedTasks);
  }, [tasks, saveTasks]);

  // Delete a subtask
  const deleteSubtask = useCallback((taskId, subtaskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: (task.subtasks || []).filter(subtask => subtask.id !== subtaskId),
        };
      }
      return task;
    });

    saveTasks(updatedTasks);
  }, [tasks, saveTasks]);

  // Edit a subtask's description
  const editSubtask = useCallback((taskId, subtaskId, newDescription) => {
    if (!newDescription || !newDescription.trim()) {
      return false;
    }

    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = (task.subtasks || []).map(subtask => {
          if (subtask.id === subtaskId) {
            return {
              ...subtask,
              description: newDescription.trim(),
            };
          }
          return subtask;
        });
        return {
          ...task,
          subtasks: updatedSubtasks,
        };
      }
      return task;
    });

    saveTasks(updatedTasks);
    return true;
  }, [tasks, saveTasks]);

  return {
    tasks: sortedTasks,
    isLoading,
    addTask,
    editTask,
    toggleTask,
    deleteTask,
    reorderTasks,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    editSubtask,
  };
}
