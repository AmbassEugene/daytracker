import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { STORAGE_KEYS, PRIORITY_ORDER } from '../constants';

export default function useGoalManager() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Save goals to AsyncStorage
  const saveGoals = useCallback(async (updatedGoals) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updatedGoals));
      setGoals(updatedGoals);
    } catch (error) {
      console.error('Error saving goals:', error);
      Alert.alert('Error', 'Failed to save goals. Please try again.');
    }
  }, []);

  // Load goals and reset daily goals on mount
  useEffect(() => {
    const migrateToSubtasks = async () => {
      try {
        const version = await AsyncStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);

        if (version !== '2.0') {
          const storedGoals = await AsyncStorage.getItem(STORAGE_KEYS.GOALS);
          if (storedGoals) {
            const goals = JSON.parse(storedGoals);
            const migratedGoals = goals.map(goal => ({
              ...goal,
              subtasks: goal.subtasks || []  // Add empty array if missing
            }));

            await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(migratedGoals));
            await AsyncStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, '2.0');
            console.log('Migrated goals to schema version 2.0');
          }
        }
      } catch (error) {
        console.error('Migration error:', error);
      }
    };

    const loadGoals = async () => {
      try {
        const storedGoals = await AsyncStorage.getItem(STORAGE_KEYS.GOALS);
        if (storedGoals) {
          setGoals(JSON.parse(storedGoals));
        }
      } catch (error) {
        console.error('Error loading goals:', error);
        Alert.alert('Error', 'Failed to load goals.');
      } finally {
        setIsLoading(false);
      }
    };

    const resetDailyGoals = async () => {
      try {
        const lastResetDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_RESET);
        const today = new Date().toDateString();

        if (lastResetDate !== today) {
          const storedGoals = await AsyncStorage.getItem(STORAGE_KEYS.GOALS);
          if (storedGoals) {
            const parsedGoals = JSON.parse(storedGoals);
            const updatedGoals = parsedGoals.map(goal =>
              goal.isRepeating ? { ...goal, completed: false } : goal
            );
            await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updatedGoals));
            setGoals(updatedGoals);
          }
          await AsyncStorage.setItem(STORAGE_KEYS.LAST_RESET, today);
        }
      } catch (error) {
        console.error('Error resetting daily goals:', error);
      }
    };

    // Run migration first, then load tasks
    migrateToSubtasks().then(() => {
      loadGoals();
      resetDailyGoals();
    });
  }, []);

  // Calculate streak for a goal based on completion history
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

  // Add a new goal
  const addGoal = useCallback((goalData) => {
    if (!goalData.description.trim()) {
      Alert.alert('Error', 'Please enter a goal description');
      return false;
    }

    // Calculate the order for the new goal (append to end)
    const maxOrder = goals.length > 0 ? Math.max(...goals.map(g => g.order || 0)) : 0;

    const newGoal = {
      id: Date.now().toString(),
      description: goalData.description,
      purpose: goalData.purpose,
      priority: goalData.priority,
      isRepeating: goalData.isRepeating,
      category: goalData.category || 'personal',
      dueDate: goalData.dueDate || null,
      dueTime: goalData.dueTime || null,
      completed: false,
      createdAt: new Date().toISOString(),
      completionHistory: [],
      currentStreak: 0,
      longestStreak: 0,
      order: maxOrder + 1,
      subtasks: [],
    };

    const updatedGoals = [...goals, newGoal];
    saveGoals(updatedGoals);
    return true;
  }, [goals, saveGoals]);

  // Edit an existing goal
  const editGoal = useCallback((goalData) => {
    if (!goalData.description.trim()) {
      Alert.alert('Error', 'Please enter a goal description');
      return false;
    }

    const updatedGoals = goals.map(goal => {
      if (goal.id === goalData.id) {
        // Preserve original goal data, only update editable fields
        return {
          ...goal,
          description: goalData.description,
          purpose: goalData.purpose,
          priority: goalData.priority,
          isRepeating: goalData.isRepeating,
          category: goalData.category || goal.category || 'personal',
          dueDate: goalData.dueDate !== undefined ? goalData.dueDate : goal.dueDate,
          dueTime: goalData.dueTime !== undefined ? goalData.dueTime : goal.dueTime,
        };
      }
      return goal;
    });

    saveGoals(updatedGoals);
    return true;
  }, [goals, saveGoals]);

  // Toggle goal completion
  const toggleGoal = useCallback((goalId) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const isCompleting = !goal.completed;
        const today = new Date().toDateString();
        let updatedCompletionHistory = goal.completionHistory || [];

        if (isCompleting && goal.isRepeating) {
          // Add today's date to completion history if not already there
          const todayAlreadyCompleted = updatedCompletionHistory.some(
            date => new Date(date).toDateString() === today
          );

          if (!todayAlreadyCompleted) {
            updatedCompletionHistory = [...updatedCompletionHistory, new Date().toISOString()];
          }
        } else if (!isCompleting && goal.isRepeating) {
          // Remove today's completion from history when uncompleting
          updatedCompletionHistory = updatedCompletionHistory.filter(
            date => new Date(date).toDateString() !== today
          );
        }

        // Calculate updated streaks
        const { currentStreak, longestStreak } = calculateStreak(updatedCompletionHistory);

        return {
          ...goal,
          completed: isCompleting,
          completionHistory: updatedCompletionHistory,
          currentStreak,
          longestStreak: Math.max(goal.longestStreak || 0, longestStreak),
        };
      }
      return goal;
    });
    saveGoals(updatedGoals);
  }, [goals, saveGoals, calculateStreak]);

  // Delete a goal
  const deleteGoal = useCallback((goalId) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedGoals = goals.filter(goal => goal.id !== goalId);
            saveGoals(updatedGoals);
          },
        },
      ]
    );
  }, [goals, saveGoals]);

  // Reorder goals (for drag and drop)
  const reorderGoals = useCallback((reorderedGoals) => {
    // Update order field for each goal based on new position
    const goalsWithNewOrder = reorderedGoals.map((goal, index) => ({
      ...goal,
      order: index,
    }));
    saveGoals(goalsWithNewOrder);
  }, [saveGoals]);

  // Helper function to check if a goal is overdue
  const isOverdue = useCallback((goal) => {
    if (!goal.dueDate || goal.completed) return false;

    const now = new Date();
    const dueDateTime = new Date(goal.dueDate);

    if (goal.dueTime) {
      const [hours, minutes] = goal.dueTime.split(':');
      dueDateTime.setHours(parseInt(hours), parseInt(minutes));
      return now > dueDateTime;
    }

    // If no time specified, consider it due at end of day
    dueDateTime.setHours(23, 59, 59);
    return now > dueDateTime;
  }, []);

  // Memoized sorted goals
  const sortedGoals = useMemo(() => {
    // First, ensure all goals have an order field (for backwards compatibility)
    const goalsWithOrder = goals.map((goal, index) => ({
      ...goal,
      order: goal.order !== undefined ? goal.order : index,
    }));

    return [...goalsWithOrder].sort((a, b) => {
      // Completed goals go to bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Overdue goals at the top (for uncompleted goals)
      const aOverdue = isOverdue(a);
      const bOverdue = isOverdue(b);
      if (aOverdue !== bOverdue) {
        return aOverdue ? -1 : 1;
      }

      // Goals with due dates before goals without
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

      // Finally, use manual order for goals with same priority
      return (a.order || 0) - (b.order || 0);
    });
  }, [goals, isOverdue]);

  // Add a subtask to a goal
  const addSubgoal = useCallback((goalId, description) => {
    if (!description || !description.trim()) {
      return false;
    }

    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newSubgoal = {
          id: Date.now().toString(),
          description: description.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
        };
        return {
          ...goal,
          subtasks: [...(goal.subtasks || []), newSubgoal],
        };
      }
      return goal;
    });

    saveGoals(updatedGoals);
    return true;
  }, [goals, saveGoals]);

  // Toggle a subtask's completion status
  const toggleSubgoal = useCallback((goalId, subtaskId) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedSubtasks = (goal.subtasks || []).map(subgoal => {
          if (subgoal.id === subtaskId) {
            return {
              ...subgoal,
              completed: !subgoal.completed,
              completedAt: !subgoal.completed ? new Date().toISOString() : null,
            };
          }
          return subgoal;
        });
        return {
          ...goal,
          subtasks: updatedSubtasks,
        };
      }
      return goal;
    });

    saveGoals(updatedGoals);
  }, [goals, saveGoals]);

  // Delete a subtask
  const deleteSubgoal = useCallback((goalId, subtaskId) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          subtasks: (goal.subtasks || []).filter(subgoal => subgoal.id !== subtaskId),
        };
      }
      return goal;
    });

    saveGoals(updatedGoals);
  }, [goals, saveGoals]);

  // Edit a subtask's description
  const editSubgoal = useCallback((goalId, subtaskId, newDescription) => {
    if (!newDescription || !newDescription.trim()) {
      return false;
    }

    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedSubtasks = (goal.subtasks || []).map(subgoal => {
          if (subgoal.id === subtaskId) {
            return {
              ...subgoal,
              description: newDescription.trim(),
            };
          }
          return subgoal;
        });
        return {
          ...goal,
          subtasks: updatedSubtasks,
        };
      }
      return goal;
    });

    saveGoals(updatedGoals);
    return true;
  }, [goals, saveGoals]);

  return {
    goals: sortedGoals,
    isLoading,
    addGoal,
    editGoal,
    toggleGoal,
    deleteGoal,
    reorderGoals,
    addSubgoal,
    toggleSubgoal,
    deleteSubgoal,
    editSubgoal,
  };
}
