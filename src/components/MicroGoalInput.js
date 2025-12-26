import { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
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
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    marginTop: SPACING.sm,
  },
  input: {
    ...TYPOGRAPHY.body,
    backgroundColor: colors.inputBackground,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
