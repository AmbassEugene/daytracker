import { useCallback, useRef } from 'react';
import { Alert, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function useGoalSharing() {
  const viewShotRef = useRef(null);

  const shareGoalAsImage = useCallback(async (task, viewRef) => {
    try {
      if (!viewRef || !viewRef.current) {
        Alert.alert('Error', 'Unable to capture goal image');
        return;
      }

      // Capture the view as an image
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      // Share the image
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share Goal',
        });
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }

      // Clean up the temp file after a delay
      setTimeout(async () => {
        try {
          await FileSystem.deleteAsync(uri, { idempotent: true });
        } catch (error) {
          // Ignore cleanup errors
        }
      }, 5000);
    } catch (error) {
      console.error('Share goal error:', error);
      Alert.alert('Error', 'Failed to share goal. Please try again.');
    }
  }, []);

  return {
    viewShotRef,
    shareGoalAsImage,
  };
}
