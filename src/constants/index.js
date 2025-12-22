// Priority colors for goal categorization
export const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

// AsyncStorage keys
export const STORAGE_KEYS = {
  TASKS: 'daytracker_goals',
  LAST_RESET: 'last_reset_date',
};

// Theme colors - Light mode
export const LIGHT_COLORS = {
  primary: '#3b82f6',
  background: '#f9fafb',
  white: '#ffffff',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  border: '#e5e7eb',
  error: '#dc2626',
  errorLight: '#fee2e2',
  cardBackground: '#ffffff',
  modalBackground: '#f9fafb',
};

// Theme colors - Dark mode
export const DARK_COLORS = {
  primary: '#60a5fa',
  background: '#111827',
  white: '#1f2937',
  textPrimary: '#f9fafb',
  textSecondary: '#d1d5db',
  textTertiary: '#9ca3af',
  border: '#374151',
  error: '#f87171',
  errorLight: '#7f1d1d',
  cardBackground: '#1f2937',
  modalBackground: '#111827',
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
