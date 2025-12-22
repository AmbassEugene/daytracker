import { useTheme } from '../contexts/ThemeContext';
import { LIGHT_COLORS, DARK_COLORS } from '../constants';

export default function useThemeColors() {
  const { isDark } = useTheme();
  return isDark ? DARK_COLORS : LIGHT_COLORS;
}
