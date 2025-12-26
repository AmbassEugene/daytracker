import { useRef, useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoalImageCard from './GoalImageCard';
import useGoalSharing from '../hooks/useGoalSharing';

export default function ShareGoalModal({ visible, task, onClose }) {
  const { shareGoalAsImage } = useGoalSharing();
  const viewRef = useRef(null);

  // Auto-share when modal becomes visible
  useEffect(() => {
    if (visible && task && viewRef.current) {
      // Small delay to ensure the view is fully rendered
      const timer = setTimeout(async () => {
        await shareGoalAsImage(task, viewRef);
        onClose();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [visible, task, shareGoalAsImage, onClose]);

  if (!task) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
        <View style={styles.backdrop}>
          <TouchableOpacity style={styles.closeArea} onPress={onClose} activeOpacity={1} />

          {/* Hidden view that will be captured as image */}
          <View style={styles.hiddenContainer}>
            <View ref={viewRef} collapsable={false}>
              <GoalImageCard task={task} />
            </View>
          </View>

          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>Preparing your goal to share...</Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeArea: {
    ...StyleSheet.absoluteFillObject,
  },
  hiddenContainer: {
    position: 'absolute',
    left: -10000, // Off-screen but rendered
    top: 0,
  },
  messageContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  messageText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
  },
});
