import { StyleSheet, View, Text } from 'react-native';
import { PRIORITY_COLORS, CATEGORY_MAP } from '../constants';

export default function GoalImageCard({ task }) {
  const categoryInfo = task.category ? CATEGORY_MAP[task.category] : null;
  const hasActiveStreak = task.isRepeating && task.currentStreak > 0;
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const hasSubtasks = subtasks.length > 0;

  // Format due date
  const formatDueDate = () => {
    if (!task.dueDate) return null;
    const date = new Date(task.dueDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      {/* Header with App Branding */}
      <View style={styles.header}>
        <Text style={styles.appName}>DayTracker</Text>
        <Text style={styles.tagline}>Daily Goals. Real Progress.</Text>
      </View>

      {/* Goal Content */}
      <View style={styles.content}>
        {/* Priority Badge */}
        <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[task.priority] }]}>
          <Text style={styles.priorityText}>{task.priority.toUpperCase()}</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>{task.description}</Text>

        {/* Purpose (if exists) */}
        {task.purpose && (
          <Text style={styles.purpose}>Why: {task.purpose}</Text>
        )}

        {/* Category */}
        {categoryInfo && (
          <View style={styles.infoRow}>
            <Text style={styles.categoryEmoji}>{categoryInfo.emoji}</Text>
            <Text style={styles.categoryText}>{categoryInfo.name}</Text>
          </View>
        )}

        {/* Streak Info */}
        {hasActiveStreak && (
          <View style={styles.infoRow}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakText}>
              {task.currentStreak} day streak
              {task.longestStreak > task.currentStreak && ` • Best: ${task.longestStreak}`}
            </Text>
          </View>
        )}

        {/* Subtasks Progress */}
        {hasSubtasks && (
          <View style={styles.infoRow}>
            <Text style={styles.subtaskEmoji}>📝</Text>
            <Text style={styles.subtaskText}>
              {completedSubtasks}/{subtasks.length} subtasks completed
            </Text>
          </View>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <View style={styles.infoRow}>
            <Text style={styles.dueDateEmoji}>📅</Text>
            <Text style={styles.dueDateText}>Due: {formatDueDate()}</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Shared from DayTracker</Text>
        <Text style={styles.footerSubtext}>Track your goals • Build your streak</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 400,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 12,
    color: '#E8F4FF',
    letterSpacing: 0.5,
  },
  content: {
    padding: 24,
    backgroundColor: '#ffffff',
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    lineHeight: 28,
  },
  purpose: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#444444',
    fontWeight: '500',
  },
  streakEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  streakText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  subtaskEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  subtaskText: {
    fontSize: 14,
    color: '#444444',
    fontWeight: '500',
  },
  dueDateEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  dueDateText: {
    fontSize: 14,
    color: '#444444',
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#F7F9FC',
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 10,
    color: '#999999',
  },
});
