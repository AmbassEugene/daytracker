import { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import AddTaskModal from '../components/AddTaskModal';
import LoadingScreen from '../components/LoadingScreen';
import useTaskManager from '../hooks/useTaskManager';
import { COLORS } from '../constants';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { tasks, isLoading, addTask, editTask, toggleTask, deleteTask } = useTaskManager();

  const handleSubmitTask = (taskData) => {
    let success;

    if (taskData.id) {
      // Editing existing task
      success = editTask(taskData);
    } else {
      // Adding new task
      success = addTask(taskData);
    }

    if (success) {
      setModalVisible(false);
      setEditingTask(null);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingTask(null);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Header />

      <TaskList
        tasks={tasks}
        onToggle={toggleTask}
        onEdit={handleEditTask}
        onDelete={deleteTask}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <AddTaskModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        editingTask={editingTask}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '300',
  },
});
