import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Switch,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { PRIORITY_COLORS, COLORS } from '../constants';

export default function AddTaskModal({ visible, onClose, onSubmit, editingTask = null }) {
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isRepeating, setIsRepeating] = useState(false);

  // Pre-fill form when editing
  useEffect(() => {
    if (editingTask) {
      setDescription(editingTask.description || '');
      setPurpose(editingTask.purpose || '');
      setPriority(editingTask.priority || 'medium');
      setIsRepeating(editingTask.isRepeating || false);
    }
  }, [editingTask]);

  const resetForm = () => {
    setDescription('');
    setPurpose('');
    setPriority('medium');
    setIsRepeating(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    const taskData = {
      description: description.trim(),
      purpose: purpose.trim(),
      priority,
      isRepeating,
    };

    // If editing, include the task ID
    if (editingTask) {
      taskData.id = editingTask.id;
    }

    onSubmit(taskData);
    resetForm();
  };

  const isEditing = !!editingTask;
  const modalTitle = isEditing ? 'Edit Task' : 'Add New Task';
  const submitButtonText = isEditing ? 'Save Changes' : 'Add Task';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalOverlay} onTouchStart={handleClose} />
        <View style={styles.modalContent}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.modalTitle}>{modalTitle}</Text>

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={styles.input}
              placeholder="What do you need to do?"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text style={styles.label}>Purpose</Text>
            <TextInput
              style={styles.input}
              placeholder="Why is this important?"
              value={purpose}
              onChangeText={setPurpose}
              multiline
            />

            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityButtons}>
              {['high', 'medium', 'low'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityButton,
                    { borderColor: PRIORITY_COLORS[p] },
                    priority === p && { backgroundColor: PRIORITY_COLORS[p] }
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    priority === p && styles.priorityButtonTextActive
                  ]}>
                    {p.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.repeatingContainer}>
              <Text style={styles.label}>Daily Repeating Task</Text>
              <Switch
                value={isRepeating}
                onValueChange={setIsRepeating}
                trackColor={{ false: '#d1d5db', true: '#60a5fa' }}
                thumbColor={isRepeating ? COLORS.primary : '#f3f4f6'}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.saveButtonText}>{submitButtonText}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    minHeight: 50,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  priorityButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  priorityButtonTextActive: {
    color: COLORS.white,
  },
  repeatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
