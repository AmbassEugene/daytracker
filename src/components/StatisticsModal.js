import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Statistics from './Statistics';
import useThemeColors from '../hooks/useThemeColors';
import { useTheme } from '../contexts/ThemeContext';

export default function StatisticsModal({ visible, onClose, tasks }) {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  const styles = getStyles(colors);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer} edges={['top', 'left', 'right']}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Statistics</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        <Statistics tasks={tasks} />
      </SafeAreaView>
    </Modal>
  );
}

const getStyles = (colors) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textSecondary,
    lineHeight: 28,
  },
});
