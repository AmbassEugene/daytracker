import { StyleSheet, View, Text } from 'react-native';
import useThemeColors from '../hooks/useThemeColors';

export default function Header({ title = 'DayTracker', subtitle = 'Track your goals and build winning streaks' }) {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
