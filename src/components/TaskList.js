import { StyleSheet, ScrollView } from 'react-native';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <ScrollView style={styles.taskList}>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  taskList: {
    flex: 1,
    padding: 16,
  },
});
