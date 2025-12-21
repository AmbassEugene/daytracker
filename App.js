import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPurpose, setTaskPurpose] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [isRepeating, setIsRepeating] = useState(false);

  useEffect(() => {
    loadTasks();
    resetDailyTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('daytracker_tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem('daytracker_tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const resetDailyTasks = async () => {
    try {
      const lastResetDate = await AsyncStorage.getItem('last_reset_date');
      const today = new Date().toDateString();

      if (lastResetDate !== today) {
        const storedTasks = await AsyncStorage.getItem('daytracker_tasks');
        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks);
          const updatedTasks = parsedTasks.map(task => {
            if (task.isRepeating) {
              return { ...task, completed: false };
            }
            return task;
          });
          await saveTasks(updatedTasks);
        }
        await AsyncStorage.setItem('last_reset_date', today);
      }
    } catch (error) {
      console.error('Error resetting daily tasks:', error);
    }
  };

  const addTask = () => {
    if (!taskDescription.trim()) {
      Alert.alert('Error', 'Please enter a task description');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      description: taskDescription,
      purpose: taskPurpose,
      priority: taskPriority,
      isRepeating: isRepeating,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);

    setTaskDescription('');
    setTaskPurpose('');
    setTaskPriority('medium');
    setIsRepeating(false);
    setModalVisible(false);
  };

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
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
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const TaskItem = ({ task }) => (
    <View style={[styles.taskItem, task.completed && styles.taskItemCompleted]}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => toggleTaskCompletion(task.id)}
      >
        <View style={styles.taskHeader}>
          <View style={styles.taskInfo}>
            <Text style={[styles.taskDescription, task.completed && styles.taskTextCompleted]}>
              {task.description}
            </Text>
            {task.purpose ? (
              <Text style={styles.taskPurpose}>Purpose: {task.purpose}</Text>
            ) : null}
          </View>
          <View style={styles.taskMeta}>
            <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[task.priority] }]}>
              <Text style={styles.priorityText}>{task.priority.toUpperCase()}</Text>
            </View>
            {task.isRepeating && (
              <View style={styles.repeatingBadge}>
                <Text style={styles.repeatingText}>Daily</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTask(task.id)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>DayTracker</Text>
        <Text style={styles.subtitle}>Keep track of your daily tasks</Text>
      </View>

      <ScrollView style={styles.taskList}>
        {sortedTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No tasks yet!</Text>
            <Text style={styles.emptyStateSubtext}>Tap the + button to add your first task</Text>
          </View>
        ) : (
          sortedTasks.map(task => <TaskItem key={task.id} task={task} />)
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Task</Text>

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={styles.input}
              placeholder="What do you need to do?"
              value={taskDescription}
              onChangeText={setTaskDescription}
              multiline
            />

            <Text style={styles.label}>Purpose</Text>
            <TextInput
              style={styles.input}
              placeholder="Why is this important?"
              value={taskPurpose}
              onChangeText={setTaskPurpose}
              multiline
            />

            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityButtons}>
              {['high', 'medium', 'low'].map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    { borderColor: PRIORITY_COLORS[priority] },
                    taskPriority === priority && { backgroundColor: PRIORITY_COLORS[priority] }
                  ]}
                  onPress={() => setTaskPriority(priority)}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    taskPriority === priority && styles.priorityButtonTextActive
                  ]}>
                    {priority.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.repeatingContainer}>
              <Text style={styles.label}>Daily Repeating Task</Text>
              <Switch
                value={isRepeating}
                onValueChange={setIsRepeating}
                trackColor={{ false: '#d1d5db', true: '#60a5fa' }}
                thumbColor={isRepeating ? '#3b82f6' : '#f3f4f6'}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setTaskDescription('');
                  setTaskPurpose('');
                  setTaskPriority('medium');
                  setIsRepeating(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addTask}
              >
                <Text style={styles.saveButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  taskList: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#9ca3af',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#d1d5db',
    marginTop: 8,
  },
  taskItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  taskItemCompleted: {
    opacity: 0.6,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  taskPurpose: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  taskMeta: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  repeatingBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  repeatingText: {
    color: '#1e40af',
    fontSize: 10,
    fontWeight: '600',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  deleteButtonText: {
    color: '#dc2626',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    minHeight: 50,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  priorityButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  priorityButtonTextActive: {
    color: '#fff',
  },
  repeatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
