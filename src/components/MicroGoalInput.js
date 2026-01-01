import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import useThemeColors from '../hooks/useThemeColors';
import { SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../constants';

export default function MicroGoalInput({ onAdd, placeholder = "+ Add micro goal" }) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      const success = onAdd(text.trim());
      if (success !== false) {
        setText('');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
        blurOnSubmit={false}
      />
      {text.trim().length > 0 && (
        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    marginTop: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  input: {
    ...TYPOGRAPHY.body,
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 36,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    minHeight: 36,
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
