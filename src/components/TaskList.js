import { ScrollView, StyleSheet } from 'react-native';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

export default function TaskList({ tasks, onToggle, onEdit, onDelete, onAddSubtask, onToggleSubtask, onDeleteSubtask }) {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.taskList}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddSubtask={onAddSubtask}
          onToggleSubtask={onToggleSubtask}
          onDeleteSubtask={onDeleteSubtask}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  taskList: {
    padding: 16,
  },
});
