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
      Alert.alert('Error', 'Failed to save tasks. Please try again.');
    }
  }, []);

  // Load tasks and reset daily tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        Alert.alert('Error', 'Failed to load tasks.');
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

    loadTasks();
    resetDailyTasks();
  }, []);

  // Add a new task
  const addTask = useCallback((taskData) => {
    if (!taskData.description.trim()) {
      Alert.alert('Error', 'Please enter a task description');
      return false;
    }

    const newTask = {
      id: Date.now().toString(),
      description: taskData.description,
      purpose: taskData.purpose,
      priority: taskData.priority,
      isRepeating: taskData.isRepeating,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    return true;
  }, [tasks, saveTasks]);

  // Toggle task completion
  const toggleTask = useCallback((taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  }, [tasks, saveTasks]);

  // Delete a task
  const deleteTask = useCallback((taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
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

  // Memoized sorted tasks
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    });
  }, [tasks]);

  return {
    tasks: sortedTasks,
    isLoading,
    addTask,
    toggleTask,
    deleteTask,
  };
}
