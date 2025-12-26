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
          goal={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onShare={onShare}
          onAddSubgoal={onAddSubtask}
          onToggleSubgoal={onToggleSubtask}
          onDeleteSubgoal={onDeleteSubtask}
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
