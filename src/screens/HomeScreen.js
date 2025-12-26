import { useState, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, Pressable, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import AddTaskModal from '../components/AddTaskModal';
import StatisticsModal from '../components/StatisticsModal';
import SettingsModal from '../components/SettingsModal';
import ShareGoalModal from '../components/ShareGoalModal';
import LoadingScreen from '../components/LoadingScreen';
import useTaskManager from '../hooks/useTaskManager';
import useThemeColors from '../hooks/useThemeColors';
import { useTheme } from '../contexts/ThemeContext';
import { CATEGORIES } from '../constants';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sharingTask, setSharingTask] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { tasks, isLoading, addTask, editTask, toggleTask, deleteTask, addSubtask, toggleSubtask, deleteSubtask } = useTaskManager();
  const colors = useThemeColors();
  const { isDark } = useTheme();

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

  const handleShareTask = (task) => {
    setSharingTask(task);
    setShareModalVisible(true);
  };

  const handleCloseShareModal = () => {
    setShareModalVisible(false);
    setSharingTask(null);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const styles = getStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDark ? "light" : "dark"} />

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
        onShare={handleShareTask}
        onAddSubtask={addSubtask}
        onToggleSubtask={toggleSubtask}
        onDeleteSubtask={deleteSubtask}
      />

      {menuVisible && (
        <View style={styles.menuContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.menuButton,
              pressed && { backgroundColor: colors.buttonBackground }
            ]}
            onPress={() => {
              setStatsModalVisible(true);
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuButtonIcon}>📊</Text>
            <Text style={styles.menuButtonText}>Statistics</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.menuButton,
              pressed && { backgroundColor: colors.buttonBackground }
            ]}
            onPress={() => {
              setSettingsModalVisible(true);
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuButtonIcon}>⚙️</Text>
            <Text style={styles.menuButtonText}>Settings</Text>
          </Pressable>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.menuToggleButton,
          pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }
        ]}
        onPress={() => setMenuVisible(!menuVisible)}
      >
        <Text style={styles.menuToggleButtonText}>☰</Text>
      </Pressable>

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

      <ShareGoalModal
        visible={shareModalVisible}
        task={sharingTask}
        onClose={handleCloseShareModal}
      />
    </SafeAreaView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    borderColor: colors.primary,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 180,
    right: 20,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    minWidth: 160,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  addButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '300',
    lineHeight: 36,
  },
  menuToggleButton: {
    position: 'absolute',
    bottom: 130,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  menuToggleButtonText: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '300',
  },
});
