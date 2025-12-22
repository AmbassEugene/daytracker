import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '../constants';

export default function EmptyState({
  message = 'No goals yet!',
  subMessage = 'Tap the + button to add your first goal'
}) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{message}</Text>
      <Text style={styles.emptyStateSubtext}>{subMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textTertiary,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#d1d5db',
    marginTop: 8,
  },
});
