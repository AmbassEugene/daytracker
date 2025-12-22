import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants';
import useDataManager from '../hooks/useDataManager';

export default function SettingsModal({ visible, onClose, tasks }) {
  const { exportData, importData, shareTasks, clearAllData } = useDataManager();

  const handleExport = async () => {
    await exportData();
  };

  const handleImport = async () => {
    await importData();
    // Close modal after import to allow app refresh
    onClose();
  };

  const handleShare = async () => {
    await shareTasks(tasks);
  };

  const handleClear = async () => {
    await clearAllData();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Settings</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <TouchableOpacity style={styles.settingItem} onPress={handleExport}>
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>📤</Text>
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Export Data</Text>
              <Text style={styles.settingDescription}>
                Backup your goals to a JSON file
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleImport}>
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>📥</Text>
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Import Data</Text>
              <Text style={styles.settingDescription}>
                Restore goals from a backup file
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleShare}>
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>📲</Text>
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Share All Tasks</Text>
              <Text style={styles.settingDescription}>
                Share your goals with others
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, styles.dangerItem]} onPress={handleClear}>
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>🗑️</Text>
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, styles.dangerText]}>Clear All Data</Text>
              <Text style={styles.settingDescription}>
                Delete all goals permanently
              </Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>ℹ️</Text>
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Version</Text>
              <Text style={styles.settingDescription}>DayTracker v1.0.0</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
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
    color: COLORS.textSecondary,
    lineHeight: 28,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dangerItem: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  dangerText: {
    color: COLORS.error,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
