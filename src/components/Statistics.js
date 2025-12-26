import { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import useThemeColors from '../hooks/useThemeColors';

export default function Statistics({ goals }) {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  // Memoize all statistics calculations to prevent unnecessary recalculations
  const stats = useMemo(() => {
    // Calculate statistics
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.completed).length;
    const activeGoals = totalGoals - completedGoals;
    const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    // Daily goals stats
    const dailyGoals = goals.filter(g => g.isRepeating);
    const completedDailyGoals = dailyGoals.filter(g => g.completed).length;
    const dailyCompletionRate = dailyGoals.length > 0
      ? Math.round((completedDailyGoals / dailyGoals.length) * 100)
      : 0;

    // Streak stats
    const activeStreaks = goals.filter(g => g.isRepeating && g.currentStreak > 0);
    const longestCurrentStreak = activeStreaks.length > 0
      ? Math.max(...activeStreaks.map(g => g.currentStreak))
      : 0;
    const bestAllTimeStreak = goals.length > 0
      ? Math.max(...goals.map(g => g.longestStreak || 0))
      : 0;

    // Category breakdown
    const categoryStats = goals.reduce((acc, goal) => {
      const cat = goal.category || 'personal';
      if (!acc[cat]) {
        acc[cat] = { total: 0, completed: 0 };
      }
      acc[cat].total++;
      if (goal.completed) acc[cat].completed++;
      return acc;
    }, {});

    // Priority breakdown
    const priorityStats = {
      high: goals.filter(g => g.priority === 'high').length,
      medium: goals.filter(g => g.priority === 'medium').length,
      low: goals.filter(g => g.priority === 'low').length,
    };

    // Overdue goals
    const now = new Date();
    const overdueGoals = goals.filter(goal => {
      if (!goal.dueDate || goal.completed) return false;
      const dueDateTime = new Date(goal.dueDate);
      dueDateTime.setHours(23, 59, 59);
      return now > dueDateTime;
    }).length;

    // Subtask statistics
    const totalSubtasks = goals.reduce((sum, goal) =>
      sum + (goal.subtasks?.length || 0), 0);
    const completedSubtasks = goals.reduce((sum, goal) =>
      sum + (goal.subtasks?.filter(st => st.completed).length || 0), 0);
    const subtaskCompletionRate = totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
    const goalsWithSubgoals = goals.filter(g => g.subtasks?.length > 0).length;

    return {
      totalGoals,
      completedGoals,
      activeGoals,
      completionRate,
      dailyGoals,
      completedDailyGoals,
      dailyCompletionRate,
      activeStreaks,
      longestCurrentStreak,
      bestAllTimeStreak,
      categoryStats,
      priorityStats,
      overdueGoals,
      totalSubtasks,
      completedSubtasks,
      subtaskCompletionRate,
      goalsWithSubgoals,
    };
  }, [goals]);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalGoals}</Text>
          <Text style={styles.statLabel}>Total Goals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.activeGoals}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.completedGoals}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, styles.percentValue]}>{stats.completionRate}%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Daily Goals</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.dailyGoals.length}</Text>
          <Text style={styles.statLabel}>Total Daily Goals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, styles.percentValue]}>{stats.dailyCompletionRate}%</Text>
          <Text style={styles.statLabel}>Today's Progress</Text>
        </View>
      </View>

      {stats.totalSubtasks > 0 && (
        <>
          <Text style={styles.sectionTitle}>Micro Goals Progress</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalSubtasks}</Text>
              <Text style={styles.statLabel}>Total Micro Goals</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.completedSubtasks}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, styles.percentValue]}>{stats.subtaskCompletionRate}%</Text>
              <Text style={styles.statLabel}>Completion Rate</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.goalsWithSubgoals}</Text>
              <Text style={styles.statLabel}>Goals with Micro Goals</Text>
            </View>
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>Streaks</Text>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.wideCard]}>
          <Text style={styles.statValue}>🔥 {stats.longestCurrentStreak}</Text>
          <Text style={styles.statLabel}>Current Best Streak</Text>
        </View>
        <View style={[styles.statCard, styles.wideCard]}>
          <Text style={styles.statValue}>⭐ {stats.bestAllTimeStreak}</Text>
          <Text style={styles.statLabel}>All-Time Best</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.fullWidthCard]}>
          <Text style={styles.statValue}>{stats.activeStreaks.length}</Text>
          <Text style={styles.statLabel}>Active Streaks</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Priority Breakdown</Text>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.wideCard, styles.highPriorityCard]}>
          <Text style={styles.statValue}>{stats.priorityStats.high}</Text>
          <Text style={styles.statLabel}>High Priority</Text>
        </View>
        <View style={[styles.statCard, styles.wideCard, styles.mediumPriorityCard]}>
          <Text style={styles.statValue}>{stats.priorityStats.medium}</Text>
          <Text style={styles.statLabel}>Medium Priority</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.fullWidthCard, styles.lowPriorityCard]}>
          <Text style={styles.statValue}>{stats.priorityStats.low}</Text>
          <Text style={styles.statLabel}>Low Priority</Text>
        </View>
      </View>

      {stats.overdueGoals > 0 && (
        <>
          <Text style={styles.sectionTitle}>Alerts</Text>
          <View style={styles.alertCard}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Overdue Goals</Text>
              <Text style={styles.alertText}>
                You have {stats.overdueGoals} overdue {stats.overdueGoals === 1 ? 'goal' : 'goals'}
              </Text>
            </View>
          </View>
        </>
      )}

      {Object.keys(stats.categoryStats).length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Category Progress</Text>
          {Object.entries(stats.categoryStats).map(([category, categoryData]) => {
            const rate = categoryData.total > 0 ? Math.round((categoryData.completed / categoryData.total) * 100) : 0;
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
                  {categoryData.completed} of {categoryData.total} completed
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
    marginBottom: 12,
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
    flexBasis: '48%',
    flexGrow: 1,
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
    borderLeftColor: colors.error,
  },
  mediumPriorityCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  lowPriorityCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  alertCard: {
    backgroundColor: colors.alertBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.alertBorder,
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
    color: colors.alertBorder,
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    color: colors.alertText,
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
    backgroundColor: colors.progressBackground,
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
