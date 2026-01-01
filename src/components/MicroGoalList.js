import { View, Text, Pressable, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import useThemeColors from '../hooks/useThemeColors';
import { SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../constants';

export default function MicroGoalList({ subtasks = [], onToggle, onDelete }) {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  if (!subtasks || subtasks.length === 0) {
    return null;
  }

  const handleDelete = (subtaskId, description) => {
    Alert.alert(
      'Delete Micro Goal',
      `Delete "${description}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(subtaskId)
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Micro Goals</Text>
      {subtasks.map((subtask) => (
        <View key={subtask.id} style={styles.subtaskItem}>
          <TouchableOpacity
            style={styles.subtaskRow}
            onPress={() => onToggle(subtask.id)}
            activeOpacity={0.6}
          >
            <View
              style={[
                styles.checkbox,
                subtask.completed && styles.checkboxChecked
              ]}
            >
              {subtask.completed && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <Text
              style={[
                styles.subtaskText,
                subtask.completed && styles.subtaskTextCompleted
              ]}
            >
              {subtask.description}
            </Text>
          </TouchableOpacity>
          <Pressable
            style={styles.deleteButton}
            onPress={() => handleDelete(subtask.id, subtask.description)}
            hitSlop={8}
          >
            <Text style={styles.deleteButtonText}>×</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  header: {
    ...TYPOGRAPHY.label,
    color: colors.textSecondary,
    marginBottom: SPACING.sm,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  subtaskRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  subtaskText: {
    ...TYPOGRAPHY.body,
    flex: 1,
    color: colors.textPrimary,
  },
  subtaskTextCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  deleteButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 20,
    color: colors.error,
    fontWeight: '300',
  },
});
