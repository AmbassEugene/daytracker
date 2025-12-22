import { useState, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import AddTaskModal from '../components/AddTaskModal';
import StatisticsModal from '../components/StatisticsModal';
import SettingsModal from '../components/SettingsModal';
import LoadingScreen from '../components/LoadingScreen';
import useTaskManager from '../hooks/useTaskManager';
import { COLORS, CATEGORIES } from '../constants';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { tasks, isLoading, addTask, editTask, toggleTask, deleteTask } = useTaskManager();

  // Filter tasks by category
  const filteredTasks = useMemo(() => {
    if (selectedCategory === 'all') {
      return tasks;
    }
    return tasks.filter(task => task.category === selectedCategory);
  }, [tasks, selectedCategory]);

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

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedCategory === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedCategory === 'all' && styles.filterButtonTextActive
            ]}>
              All
            </Text>
          </TouchableOpacity>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filterButton,
                { borderColor: cat.color },
                selectedCategory === cat.id && { backgroundColor: cat.color }
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedCategory === cat.id && styles.filterButtonTextActive
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TaskList
        tasks={filteredTasks}
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

      <TouchableOpacity
        style={styles.statsButton}
        onPress={() => setStatsModalVisible(true)}
      >
        <Text style={styles.statsButtonText}>📊</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setSettingsModalVisible(true)}
      >
        <Text style={styles.settingsButtonText}>⚙️</Text>
      </TouchableOpacity>

      <AddTaskModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        editingTask={editingTask}
      />

      <StatisticsModal
        visible={statsModalVisible}
        onClose={() => setStatsModalVisible(false)}
        tasks={tasks}
      />

      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        tasks={tasks}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
  },
  filterScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterButtonTextActive: {
    color: COLORS.white,
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
  statsButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  statsButtonText: {
    fontSize: 28,
  },
  settingsButton: {
    position: 'absolute',
    bottom: 170,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#64748b',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  settingsButtonText: {
    fontSize: 28,
  },
});
