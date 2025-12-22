import { StyleSheet, View, Text, ScrollView } from 'react-native';
import useThemeColors from '../hooks/useThemeColors';

export default function Statistics({ tasks }) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Daily goals stats
  const dailyGoals = tasks.filter(t => t.isRepeating);
  const completedDailyGoals = dailyGoals.filter(t => t.completed).length;
  const dailyCompletionRate = dailyGoals.length > 0
    ? Math.round((completedDailyGoals / dailyGoals.length) * 100)
    : 0;

  // Streak stats
  const activeStreaks = tasks.filter(t => t.isRepeating && t.currentStreak > 0);
  const longestCurrentStreak = activeStreaks.length > 0
    ? Math.max(...activeStreaks.map(t => t.currentStreak))
    : 0;
  const bestAllTimeStreak = tasks.length > 0
    ? Math.max(...tasks.map(t => t.longestStreak || 0))
    : 0;

  // Category breakdown
  const categoryStats = tasks.reduce((acc, task) => {
    const cat = task.category || 'personal';
    if (!acc[cat]) {
      acc[cat] = { total: 0, completed: 0 };
    }
    acc[cat].total++;
    if (task.completed) acc[cat].completed++;
    return acc;
  }, {});

  // Priority breakdown
  const priorityStats = {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };

  // Overdue goals
  const now = new Date();
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const dueDateTime = new Date(task.dueDate);
    dueDateTime.setHours(23, 59, 59);
    return now > dueDateTime;
  }).length;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalTasks}</Text>
          <Text style={styles.statLabel}>Total Goals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{activeTasks}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, styles.percentValue]}>{completionRate}%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Daily Goals</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{dailyGoals.length}</Text>
          <Text style={styles.statLabel}>Total Daily Goals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, styles.percentValue]}>{dailyCompletionRate}%</Text>
          <Text style={styles.statLabel}>Today's Progress</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Streaks</Text>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.wideCard]}>
          <Text style={styles.statValue}>🔥 {longestCurrentStreak}</Text>
          <Text style={styles.statLabel}>Current Best Streak</Text>
        </View>
        <View style={[styles.statCard, styles.wideCard]}>
          <Text style={styles.statValue}>⭐ {bestAllTimeStreak}</Text>
          <Text style={styles.statLabel}>All-Time Best</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.fullWidthCard]}>
          <Text style={styles.statValue}>{activeStreaks.length}</Text>
          <Text style={styles.statLabel}>Active Streaks</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Priority Breakdown</Text>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.wideCard, styles.highPriorityCard]}>
          <Text style={styles.statValue}>{priorityStats.high}</Text>
          <Text style={styles.statLabel}>High Priority</Text>
        </View>
        <View style={[styles.statCard, styles.wideCard, styles.mediumPriorityCard]}>
          <Text style={styles.statValue}>{priorityStats.medium}</Text>
          <Text style={styles.statLabel}>Medium Priority</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.fullWidthCard, styles.lowPriorityCard]}>
          <Text style={styles.statValue}>{priorityStats.low}</Text>
          <Text style={styles.statLabel}>Low Priority</Text>
        </View>
      </View>

      {overdueTasks > 0 && (
        <>
          <Text style={styles.sectionTitle}>Alerts</Text>
          <View style={styles.alertCard}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Overdue Goals</Text>
              <Text style={styles.alertText}>
                You have {overdueTasks} overdue {overdueTasks === 1 ? 'goal' : 'goals'}
              </Text>
            </View>
          </View>
        </>
      )}

      {Object.keys(categoryStats).length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Category Progress</Text>
          {Object.entries(categoryStats).map(([category, stats]) => {
            const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
            return (
              <View key={category} style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                  <Text style={styles.categoryRate}>{rate}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${rate}%` }]} />
                </View>
                <Text style={styles.categoryStats}>
                  {stats.completed} of {stats.total} completed
                </Text>
              </View>
            );
          })}
        </>
      )}
    </ScrollView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  wideCard: {
    flex: 1,
  },
  fullWidthCard: {
    flex: 1,
    width: '100%',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  percentValue: {
    color: colors.primary,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  highPriorityCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  mediumPriorityCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  lowPriorityCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  alertCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  alertIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    color: '#991b1b',
  },
  categoryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  categoryRate: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  categoryStats: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
