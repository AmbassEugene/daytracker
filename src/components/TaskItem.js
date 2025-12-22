import { memo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { PRIORITY_COLORS, CATEGORY_MAP } from '../constants';
import useThemeColors from '../hooks/useThemeColors';

const TaskItem = memo(({ task, onToggle, onEdit, onDelete }) => {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const hasActiveStreak = task.isRepeating && task.currentStreak > 0;
  const showStreakInfo = task.isRepeating && (task.currentStreak > 0 || task.longestStreak > 0);
  const categoryInfo = task.category ? CATEGORY_MAP[task.category] : null;

  // Check if task is overdue
  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;

    const now = new Date();
    const dueDateTime = new Date(task.dueDate);

    if (task.dueTime) {
      const [hours, minutes] = task.dueTime.split(':');
      dueDateTime.setHours(parseInt(hours), parseInt(minutes));
      return now > dueDateTime;
    }

    dueDateTime.setHours(23, 59, 59);
    return now > dueDateTime;
  };

  // Format due date display
  const formatDueDate = () => {
    if (!task.dueDate) return null;

    const dueDateTime = new Date(task.dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = dueDateTime.toDateString() === today.toDateString();
    const isTomorrow = dueDateTime.toDateString() === tomorrow.toDateString();

    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';

    const options = { month: 'short', day: 'numeric' };
    return dueDateTime.toLocaleDateString('en-US', options);
  };

  const taskIsOverdue = isOverdue();
  const dueDateDisplay = formatDueDate();

  return (
    <View style={[styles.taskItem, task.completed && styles.taskItemCompleted]}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => onToggle(task.id)}
      >
        <View style={styles.taskHeader}>
          <View style={styles.taskInfo}>
            <View style={styles.descriptionRow}>
              <Text style={[styles.taskDescription, task.completed && styles.taskTextCompleted]}>
                {task.description}
              </Text>
              {categoryInfo && (
                <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color }]}>
                  <Text style={styles.categoryText}>{categoryInfo.label}</Text>
                </View>
              )}
            </View>
            {task.purpose ? (
              <Text style={styles.taskPurpose}>Purpose: {task.purpose}</Text>
            ) : null}
            {showStreakInfo && (
              <View style={styles.streakContainer}>
                {hasActiveStreak && (
                  <View style={styles.currentStreakBadge}>
                    <Text style={styles.streakIcon}>🔥</Text>
                    <Text style={styles.streakText}>{task.currentStreak} day streak</Text>
                  </View>
                )}
                {task.longestStreak > 0 && (
                  <Text style={styles.longestStreakText}>
                    Best: {task.longestStreak} days
                  </Text>
                )}
              </View>
            )}
          </View>
          <View style={styles.taskMeta}>
            {dueDateDisplay && (
              <View style={[
                styles.dueDateBadge,
                taskIsOverdue && styles.dueDateBadgeOverdue
              ]}>
                <Text style={[
                  styles.dueDateText,
                  taskIsOverdue && styles.dueDateTextOverdue
                ]}>
                  {taskIsOverdue && '⚠️ '}{dueDateDisplay}
                  {task.dueTime && ` ${task.dueTime}`}
                </Text>
              </View>
            )}
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
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(task)}
        >
          <Text style={styles.editButtonText}>✎</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(task.id)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default TaskItem;

const getStyles = (colors) => StyleSheet.create({
  taskItem: {
    backgroundColor: colors.white,
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
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  taskPurpose: {
    fontSize: 13,
    color: colors.textSecondary,
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
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  repeatingBadge: {
    backgroundColor: colors.badgeBlue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  repeatingText: {
    color: colors.badgeBlueText,
    fontSize: 10,
    fontWeight: '600',
  },
  dueDateBadge: {
    backgroundColor: colors.badgeCyan,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  dueDateBadgeOverdue: {
    backgroundColor: colors.errorLight,
  },
  dueDateText: {
    color: colors.badgeCyanText,
    fontSize: 10,
    fontWeight: '600',
  },
  dueDateTextOverdue: {
    color: colors.error,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.editButtonBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.deleteButtonBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: 24,
    fontWeight: 'bold',
  },
  streakContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currentStreakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.badgeOrange,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.badgeOrangeBorder,
  },
  streakIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.badgeOrangeText,
  },
  longestStreakText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
