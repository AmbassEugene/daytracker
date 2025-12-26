import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import useDataManager from '../hooks/useDataManager';
import useThemeColors from '../hooks/useThemeColors';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsModal({ visible, onClose, tasks }) {
  const { exportData, importData, clearAllData } = useDataManager();
  const colors = useThemeColors();
  const { isDark, themeMode, setTheme } = useTheme();

  const handleExport = async () => {
    await exportData();
  };

  const handleImport = async () => {
    await importData();
    // Close modal after import to allow app refresh
    onClose();
  };

  const handleShareApp = async () => {
    const shareMessage = "Daily goals. Real progress. Zero excuses. Start now 👉";

    try {
      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      console.error('Share app error:', error);
    }
  };

  const handleClear = async () => {
    await clearAllData();
    onClose();
  };

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

          <TouchableOpacity style={styles.settingItem} onPress={handleShareApp}>
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>📲</Text>
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Share App</Text>
              <Text style={styles.settingDescription}>
                Invite friends to track their goals
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

          <Text style={styles.sectionTitle}>Appearance</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>{isDark ? '🌙' : '☀️'}</Text>
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Theme</Text>
              <View style={styles.themeOptions}>
                <TouchableOpacity
                  style={[styles.themeButton, themeMode === 'light' && styles.themeButtonActive]}
                  onPress={() => setTheme('light')}
                >
                  <Text style={[styles.themeButtonText, themeMode === 'light' && styles.themeButtonTextActive]}>
                    Light
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.themeButton, themeMode === 'dark' && styles.themeButtonActive]}
                  onPress={() => setTheme('dark')}
                >
                  <Text style={[styles.themeButtonText, themeMode === 'dark' && styles.themeButtonTextActive]}>
                    Dark
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.themeButton, themeMode === 'system' && styles.themeButtonActive]}
                  onPress={() => setTheme('system')}
                >
                  <Text style={[styles.themeButtonText, themeMode === 'system' && styles.themeButtonTextActive]}>
                    System
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.buttonBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textSecondary,
    lineHeight: 28,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  dangerItem: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.buttonBackground,
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
    color: colors.textPrimary,
    marginBottom: 4,
  },
  dangerText: {
    color: colors.error,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.buttonBackground,
    alignItems: 'center',
  },
  themeButtonActive: {
    backgroundColor: colors.primary,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  themeButtonTextActive: {
    color: colors.white,
  },
});
