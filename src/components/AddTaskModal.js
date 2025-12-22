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
import { PRIORITY_COLORS, COLORS, CATEGORIES } from '../constants';

export default function AddTaskModal({ visible, onClose, onSubmit, editingTask = null }) {
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isRepeating, setIsRepeating] = useState(false);
  const [category, setCategory] = useState('personal');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  // Helper to format date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calculate specific dates
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDate(tomorrow);
  };

  const getNextWeekDate = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return formatDate(nextWeek);
  };

  const getNextMonthDate = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return formatDate(nextMonth);
  };

  const getNextYearDate = () => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return formatDate(nextYear);
  };

  // Quick date setters
  const setTomorrow = () => setDueDate(getTomorrowDate());
  const setNextWeek = () => setDueDate(getNextWeekDate());
  const setNextMonth = () => setDueDate(getNextMonthDate());
  const setNextYear = () => setDueDate(getNextYearDate());

  // Pre-fill form when editing
  useEffect(() => {
    if (editingTask) {
      setDescription(editingTask.description || '');
      setPurpose(editingTask.purpose || '');
      setPriority(editingTask.priority || 'medium');
      setIsRepeating(editingTask.isRepeating || false);
      setCategory(editingTask.category || 'personal');
      setDueDate(editingTask.dueDate || '');
      setDueTime(editingTask.dueTime || '');
    }
  }, [editingTask]);

  const resetForm = () => {
    setDescription('');
    setPurpose('');
    setPriority('medium');
    setIsRepeating(false);
    setCategory('personal');
    setDueDate('');
    setDueTime('');
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
      category,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
    };

    // If editing, include the task ID
    if (editingTask) {
      taskData.id = editingTask.id;
    }

    onSubmit(taskData);
    resetForm();
  };

  const isEditing = !!editingTask;
  const modalTitle = isEditing ? 'Edit Goal' : 'Add New Goal';
  const submitButtonText = isEditing ? 'Save Changes' : 'Add Goal';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalOverlay} onTouchStart={handleClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContent}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.label}>Goal *</Text>
            <TextInput
              style={styles.input}
              placeholder="What do you want to achieve?"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text style={styles.label}>Purpose</Text>
            <TextInput
              style={styles.input}
              placeholder="Why does this matter to you?"
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

            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    { borderColor: cat.color },
                    category === cat.id && { backgroundColor: cat.color }
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    category === cat.id && styles.categoryButtonTextActive
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.repeatingContainer}>
              <Text style={styles.label}>Daily Goal</Text>
              <Switch
                value={isRepeating}
                onValueChange={setIsRepeating}
                trackColor={{ false: '#d1d5db', true: '#60a5fa' }}
                thumbColor={isRepeating ? COLORS.primary : '#f3f4f6'}
              />
            </View>

            <Text style={styles.label}>Due Date (Optional)</Text>
            <View style={styles.quickDateButtons}>
              <TouchableOpacity
                style={[styles.quickDateButton, dueDate === getTomorrowDate() && styles.quickDateButtonActive]}
                onPress={setTomorrow}
              >
                <Text style={[styles.quickDateButtonText, dueDate === getTomorrowDate() && styles.quickDateButtonTextActive]}>
                  Tomorrow
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickDateButton, dueDate === getNextWeekDate() && styles.quickDateButtonActive]}
                onPress={setNextWeek}
              >
                <Text style={[styles.quickDateButtonText, dueDate === getNextWeekDate() && styles.quickDateButtonTextActive]}>
                  Next Week
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickDateButton, dueDate === getNextMonthDate() && styles.quickDateButtonActive]}
                onPress={setNextMonth}
              >
                <Text style={[styles.quickDateButtonText, dueDate === getNextMonthDate() && styles.quickDateButtonTextActive]}>
                  Next Month
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickDateButton, dueDate === getNextYearDate() && styles.quickDateButtonActive]}
                onPress={setNextYear}
              >
                <Text style={[styles.quickDateButtonText, dueDate === getNextYearDate() && styles.quickDateButtonTextActive]}>
                  Next Year
                </Text>
              </TouchableOpacity>
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
        </KeyboardAvoidingView>
      </View>
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
    maxHeight: '60%',
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  scrollContent: {
    flexGrow: 1,
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryButtonTextActive: {
    color: COLORS.white,
  },
  repeatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  quickDateButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  quickDateButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  quickDateButtonActive: {
    backgroundColor: COLORS.primary,
  },
  quickDateButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  quickDateButtonTextActive: {
    color: COLORS.white,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 8,
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
