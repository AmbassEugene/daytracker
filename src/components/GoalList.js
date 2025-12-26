import { ScrollView, StyleSheet } from 'react-native';
import GoalItem from './GoalItem';
import EmptyState from './EmptyState';

export default function GoalList({ goals, onToggle, onEdit, onDelete, onShare, onAddSubtask, onToggleSubtask, onDeleteSubtask }) {
  if (goals.length === 0) {
    return <EmptyState />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.goalList}>
      {goals.map((goal) => (
        <GoalItem
          key={goal.id}
          goal={goal}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onShare={onShare}
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
  goalList: {
    padding: 16,
  },
});
