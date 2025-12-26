import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Alert, Platform } from 'react-native';
import { STORAGE_KEYS } from '../constants';

export default function useDataManager() {
  // Export data to JSON file
  const exportData = useCallback(async () => {
    try {
      // Get all data from AsyncStorage
      const goalsData = await AsyncStorage.getItem(STORAGE_KEYS.GOALS);
      const lastResetData = await AsyncStorage.getItem(STORAGE_KEYS.LAST_RESET);

      const exportObject = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        data: {
          goals: goalsData ? JSON.parse(tasksData) : [],
          lastReset: lastResetData,
        },
      };

      const jsonString = JSON.stringify(exportObject, null, 2);
      const fileName = `daytracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Write file
      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      // Share file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export DayTracker Data',
        });
        Alert.alert('Success', 'Data exported successfully!');
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    }
  }, []);

  // Import data from JSON file
  const importData = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const importedData = JSON.parse(fileContent);

      // Validate import data structure
      if (!importedData.version || !importedData.data) {
        Alert.alert('Error', 'Invalid backup file format');
        return;
      }

      // Ask for confirmation
      Alert.alert(
        'Import Data',
        'This will replace all existing data. Are you sure you want to continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Import',
            style: 'destructive',
            onPress: async () => {
              try {
                // Import tasks
                if (importedData.data.goals) {
                  await AsyncStorage.setItem(
                    STORAGE_KEYS.GOALS,
                    JSON.stringify(importedData.data.goals)
                  );
                }

                // Import last reset date
                if (importedData.data.lastReset) {
                  await AsyncStorage.setItem(
                    STORAGE_KEYS.LAST_RESET,
                    importedData.data.lastReset
                  );
                }

                Alert.alert(
                  'Success',
                  'Data imported successfully! Please restart the app to see the changes.',
                  [{ text: 'OK' }]
                );
              } catch (error) {
                console.error('Import error:', error);
                Alert.alert('Error', 'Failed to import data');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert('Error', 'Failed to import data. Please try again.');
    }
  }, []);

  // Share specific tasks with others
  const shareGoals = useCallback(async (goalsToShare) => {
    try {
      if (!goalsToShare || goalsToShare.length === 0) {
        Alert.alert('Error', 'No goals selected to share');
        return;
      }

      const shareObject = {
        version: '1.0',
        shareDate: new Date().toISOString(),
        tasks: goalsToShare,
      };

      const jsonString = JSON.stringify(shareObject, null, 2);
      const fileName = `daytracker-goals-${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Write file
      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      // Share file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Share Tasks',
        });
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share goals. Please try again.');
    }
  }, []);

  // Clear all data
  const clearAllData = useCallback(async () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your goals and data. This action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEYS.GOALS);
              await AsyncStorage.removeItem(STORAGE_KEYS.LAST_RESET);
              Alert.alert('Success', 'All data cleared successfully!');
            } catch (error) {
              console.error('Clear error:', error);
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  }, []);

  return {
    exportData,
    importData,
    shareGoals,
    clearAllData,
  };
}
