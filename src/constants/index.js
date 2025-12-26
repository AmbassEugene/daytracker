// Priority colors for goal categorization
export const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

// Priority background colors (light tints for card backgrounds)
export const PRIORITY_BACKGROUNDS = {
  light: {
    high: '#fef2f2',      // Very light red
    medium: '#fffbeb',    // Very light amber
    low: '#f0fdf4',       // Very light green
  },
  dark: {
    high: '#7f1d1d',      // Dark red
    medium: '#78350f',    // Dark amber
    low: '#064e3b',       // Dark green
  },
};

// AsyncStorage keys
export const STORAGE_KEYS = {
  GOALS: 'daytracker_goals',
  LAST_RESET: 'last_reset_date',
  SCHEMA_VERSION: 'schema_version',
  SUBTASKS_EXPANDED_DEFAULT: 'subtasks_expanded_default',
};

// Design System - Spacing Scale
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

// Design System - Border Radius Scale
export const BORDER_RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 20,
};

// Design System - Typography Scale
export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '700' },
  h2: { fontSize: 24, fontWeight: '700' },
  h3: { fontSize: 18, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400' },
  bodyMedium: { fontSize: 16, fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '600' },
  caption: { fontSize: 13, fontWeight: '400' },
  small: { fontSize: 12, fontWeight: '400' },
  tiny: { fontSize: 11, fontWeight: '600' },
};

// Design System - Button Sizes (Accessibility compliant)
export const BUTTON_SIZES = {
  compact: { width: 36, height: 36 },  // For card action buttons
  small: { width: 44, height: 44 },    // Minimum accessible size
  medium: { width: 56, height: 56 },
  large: { width: 60, height: 60 },
};

// Theme colors - Light mode
export const LIGHT_COLORS = {
  // Core colors
  primary: '#3b82f6',
  primaryLight: '#dbeafe',
  background: '#f9fafb',
  white: '#ffffff',

  // Text colors
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',

  // UI element colors
  border: '#e5e7eb',
  divider: '#e5e7eb',
  inputBackground: '#f3f4f6',
  buttonBackground: '#f3f4f6',
  cardBackground: '#ffffff',
  modalBackground: '#f9fafb',
  modalOverlay: 'rgba(0, 0, 0, 0.5)',

  // Status colors
  error: '#dc2626',
  errorLight: '#fee2e2',
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',

  // Badge colors
  badgeBlue: '#dbeafe',
  badgeBlueText: '#1e40af',
  badgeCyan: '#e0f2fe',
  badgeCyanText: '#0369a1',
  badgeOrange: '#fff7ed',
  badgeOrangeText: '#ea580c',
  badgeOrangeBorder: '#fed7aa',

  // Alert colors
  alertBackground: '#fef2f2',
  alertBorder: '#dc2626',
  alertText: '#991b1b',

  // Progress colors
  progressBackground: '#e5e7eb',
  progressFill: '#3b82f6',

  // Action button colors
  editButtonBg: '#dbeafe',
  deleteButtonBg: '#fee2e2',
  statsButtonBg: '#8b5cf6',
  settingsButtonBg: '#64748b',
};

// Theme colors - Dark mode
export const DARK_COLORS = {
  // Core colors
  primary: '#60a5fa',
  primaryLight: '#1e3a8a',
  background: '#111827',
  white: '#1f2937',

  // Text colors
  textPrimary: '#f9fafb',
  textSecondary: '#d1d5db',
  textTertiary: '#9ca3af',

  // UI element colors
  border: '#374151',
  divider: '#374151',
  inputBackground: '#374151',
  buttonBackground: '#374151',
  cardBackground: '#1f2937',
  modalBackground: '#111827',
  modalOverlay: 'rgba(0, 0, 0, 0.7)',

  // Status colors
  error: '#f87171',
  errorLight: '#7f1d1d',
  success: '#34d399',
  successLight: '#064e3b',
  warning: '#fbbf24',
  warningLight: '#78350f',

  // Badge colors (darker versions for dark mode)
  badgeBlue: '#1e3a8a',
  badgeBlueText: '#93c5fd',
  badgeCyan: '#164e63',
  badgeCyanText: '#67e8f9',
  badgeOrange: '#7c2d12',
  badgeOrangeText: '#fdba74',
  badgeOrangeBorder: '#c2410c',

  // Alert colors
  alertBackground: '#7f1d1d',
  alertBorder: '#f87171',
  alertText: '#fecaca',

  // Progress colors
  progressBackground: '#374151',
  progressFill: '#60a5fa',

  // Action button colors
  editButtonBg: '#1e3a8a',
  deleteButtonBg: '#7f1d1d',
  statsButtonBg: '#6d28d9',
  settingsButtonBg: '#475569',
};

// Default to light colors (will be overridden by theme context)
export const COLORS = LIGHT_COLORS;

// Priority order for sorting
export const PRIORITY_ORDER = {
  high: 0,
  medium: 1,
  low: 2,
};

// Categories with colors
export const CATEGORIES = [
  { id: 'work', label: 'Work', color: '#3b82f6' },
  { id: 'personal', label: 'Personal', color: '#8b5cf6' },
  { id: 'health', label: 'Health', color: '#10b981' },
  { id: 'finance', label: 'Finance', color: '#f59e0b' },
  { id: 'learning', label: 'Learning', color: '#06b6d4' },
  { id: 'social', label: 'Social', color: '#ec4899' },
  { id: 'other', label: 'Other', color: '#6b7280' },
];

export const CATEGORY_MAP = CATEGORIES.reduce((acc, cat) => {
  acc[cat.id] = cat;
  return acc;
}, {});
