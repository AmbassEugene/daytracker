import { memo, useState } from 'react';
import { StyleSheet, View, Text, Pressable, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIORITY_COLORS, PRIORITY_BACKGROUNDS, CATEGORY_MAP } from '../constants';
import useThemeColors from '../hooks/useThemeColors';
import { useTheme } from '../contexts/ThemeContext';
import MicroGoalList from './MicroGoalList';
import MicroGoalInput from './MicroGoalInput';

const GoalItem = memo(({ goal, onToggle, onEdit, onDelete, onShare, onAddSubtask, onToggleSubtask, onDeleteSubtask }) => {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  const priorityBgColor = PRIORITY_BACKGROUNDS[isDark ? 'dark' : 'light'][goal.priority];
  const styles = getStyles(colors, priorityBgColor);
  const hasActiveStreak = goal.isRepeating && goal.currentStreak > 0;
  const showStreakInfo = goal.isRepeating && (goal.currentStreak > 0 || goal.longestStreak > 0);
  const categoryInfo = goal.category ? CATEGORY_MAP[goal.category] : null;
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate subtask progress
  const subtasks = goal.subtasks || [];
  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const hasSubtasks = subtasks.length > 0;

  // Handle subtask toggle with auto-complete prompt
  const handleToggleSubtask = (subgoalId) => {
    // Find the subtask being toggled
    const subtask = subtasks.find(st => st.id === subgoalId);
    if (!subtask) return;

    // Check if this was the last incomplete subtask and it's now being completed
    const wasLastIncomplete = !sugoal.completed &&
      subtasks.filter(st => !st.completed).length === 1;

    // If parent is not completed and all subtasks will be complete, prompt FIRST
    if (wasLastIncomplete && !goal.completed) {
      Alert.alert(
        'All Micro Goals Complete!',
        'Mark parent goal as done too?',
        [
          {
            text: 'No, keep it open',
            style: 'cancel',
            onPress: () => {
              // User said no, just toggle the subtask
              onToggleSubtask(goal.id, subgoalId);
            }
          },
          {
            text: 'Yes, complete it',
            onPress: () => {
              // Toggle subtask AND parent together
              onToggleSubtask(goal.id, subgoalId);
              // Small delay to let subtask update first
              setTimeout(() => onToggle(goal.id), 100);
            },
          },
        ],
        { cancelable: false } // Prevent dismissing without choosing
      );
    } else {
      // Not the last subtask, just toggle normally
      onToggleSubtask(goal.id, subgoalId);
    }
  };

  // Check if goal is overdue
  const isOverdue = () => {
    if (!goal.dueDate || goal.completed) return false;

    const now = new Date();
    const dueDateTime = new Date(goal.dueDate);

    if (goal.dueTime) {
      const [hours, minutes] = goal.dueTime.split(':');
      dueDateTime.setHours(parseInt(hours), parseInt(minutes));
      return now > dueDateTime;
    }

    dueDateTime.setHours(23, 59, 59);
    return now > dueDateTime;
  };

  // Format due date display as countdown
  const formatDueDate = () => {
    if (!goal.dueDate) return null;

    const dueDateTime = new Date(goal.dueDate);
    const now = new Date();

    // Set time for due date if it has dueTime
    if (goal.dueTime) {
      const [hours, minutes] = goal.dueTime.split(':');
      dueDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
      // If no time, set to end of day
      dueDateTime.setHours(23, 59, 59, 999);
    }

    const diffMs = dueDateTime - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    // Past due
    if (diffMs < 0) {
      const absDays = Math.abs(diffDays);
      if (absDays === 0) return 'Today';
      if (absDays === 1) return 'Yesterday';
      return `${absDays} days ago`;
    }

    // Future
    if (diffDays === 0) {
      if (diffHours === 0) {
        if (diffMinutes <= 1) return 'in 1 min';
        return `in ${diffMinutes} mins`;
      }
      if (diffHours === 1) return 'in 1 hour';
      return `in ${diffHours} hours`;
    }

    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `in ${diffDays} days`;

    const weeks = Math.floor(diffDays / 7);
    if (weeks === 1) return 'in 1 week';
    if (weeks < 4) return `in ${weeks} weeks`;

    const months = Math.floor(diffDays / 30);
    if (months === 1) return 'in 1 month';
    if (months < 12) return `in ${months} months`;

    const years = Math.floor(diffDays / 365);
    if (years === 1) return 'in 1 year';
    if (years > 1) return `in ${years} years`;

    // Fallback - shouldn't reach here, but return null just in case
    return null;
  };

  const goalIsOverdue = isOverdue();
  const dueDateDisplay = formatDueDate();

  return (
    <View style={[styles.goalItem, goal.completed && styles.goalItemCompleted]}>
      <TouchableOpacity
        style={styles.goalContent}
        onPress={() => setIsExpanded(!isExpanded)}
        onLongPress={() => onToggle(goal.id)}
      >
        <View style={styles.goalInfo}>
          <Text style={[styles.goalDescription, goal.completed && styles.goalTextCompleted]}>
            {goal.description}
          </Text>
          {goal.purpose ? (
            <Text style={styles.goalPurpose}>Purpose: {goal.purpose}</Text>
          ) : null}

          {/* Row 1: Streak + Subtasks + Due Date */}
          {(showStreakInfo || hasSubtasks || dueDateDisplay) && (
            <View style={styles.badgeRow}>
              {hasActiveStreak && (
                <View style={styles.currentStreakBadge}>
                  <Text style={styles.streakIcon}>🔥</Text>
                  <Text style={styles.streakText}>{goal.currentStreak} day streak</Text>
                </View>
              )}
              {goal.longestStreak > 0 && !hasActiveStreak && (
                <Text style={styles.longestStreakText}>
                  Best: {goal.longestStreak} days
                </Text>
              )}
              {hasSubtasks && (
                <View style={styles.subtaskProgressBadge}>
                  <Text style={styles.subtaskProgressIcon}>✓</Text>
                  <Text style={styles.subtaskProgressText}>
                    {completedSubtasks}/{subtasks.length}
                  </Text>
                </View>
              )}
              {dueDateDisplay && (
                <View style={[
                  styles.dueDateBadge,
                  goalIsOverdue && styles.dueDateBadgeOverdue
                ]}>
                  <Text style={[
                    styles.dueDateText,
                    goalIsOverdue && styles.dueDateTextOverdue
                  ]}>
                    {goalIsOverdue && '⚠️ '}{dueDateDisplay}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Row 2: Priority + Category + Daily tag */}
          {(categoryInfo || goal.isRepeating || goal.priority) && (
            <View style={styles.badgeRow}>
              <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[goal.priority] }]}>
                <Text style={styles.priorityText}>{goal.priority.toUpperCase()}</Text>
              </View>
              {categoryInfo && (
                <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color }]}>
                  <Text style={styles.categoryText}>{categoryInfo.label}</Text>
                </View>
              )}
              {goal.isRepeating && (
                <View style={styles.repeatingBadge}>
                  <Text style={styles.repeatingText}>Daily</Text>
                </View>
              )}
            </View>
          )}

          {/* Subtasks - shown when expanded */}
          {isExpanded && (
            <>
              <MicroGoalList
                subtasks={subtasks}
                onToggle={handleToggleSubtask}
                onDelete={(subgoalId) => onDeleteSubtask(goal.id, subgoalId)}
              />
              <MicroGoalInput
                onAdd={(description) => onAddSubtask(goal.id, description)}
                placeholder="+ Add micro goal"
              />
            </>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.actionButtons}>
        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }
          ]}
          onPress={() => onDelete(goal.id)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.editButton,
            pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }
          ]}
          onPress={() => onEdit(goal)}
        >
          <Text style={styles.editButtonText}>✎</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.shareButton,
            pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }
          ]}
          onPress={() => onShare(goal)}
        >
          <Ionicons name="share-outline" size={20} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
});

export default GoalItem;

const getStyles = (colors, priorityBgColor) => StyleSheet.create({
  goalItem: {
    backgroundColor: priorityBgColor,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalItemCompleted: {
    opacity: 0.6,
  },
  goalContent: {
    flex: 1,
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalDescription: {
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
  goalTextCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  goalPurpose: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
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
  subtaskProgressBadge: {
    backgroundColor: colors.badgeCyan,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subtaskProgressIcon: {
    color: colors.badgeCyanText,
    fontSize: 10,
    fontWeight: '700',
  },
  subtaskProgressText: {
    color: colors.badgeCyanText,
    fontSize: 10,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 10,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.editButtonBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.deleteButtonBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: 20,
    fontWeight: 'bold',
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.editButtonBg,
    alignItems: 'center',
    justifyContent: 'center',
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
