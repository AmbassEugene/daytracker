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
  const { tasks, isLoading, addTask, toggleTask, deleteTask } = useTaskManager();

  const handleAddTask = (taskData) => {
    const success = addTask(taskData);
    if (success) {
      setModalVisible(false);
    }
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
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddTask}
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
