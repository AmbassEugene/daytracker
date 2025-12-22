import { StyleSheet, View, Text } from 'react-native';
import useThemeColors from '../hooks/useThemeColors';

export default function EmptyState({
  message = 'No goals yet!',
  subMessage = 'Tap the + button to add your first goal'
}) {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{message}</Text>
      <Text style={styles.emptyStateSubtext}>{subMessage}</Text>
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textTertiary,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#d1d5db',
    marginTop: 8,
  },
});
