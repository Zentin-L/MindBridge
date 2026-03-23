// Storage utilities for MindBridge
// Handle localStorage operations for mood history and check-ins

const MOOD_HISTORY_KEY = 'mindbridge_mood_history';
const LAST_CHECKIN_KEY = 'mindbridge_last_checkin';

/**
 * Save a mood entry to localStorage
 * @param {Object} entry - { timestamp, stress_level, emotional_state, note }
 */
export const saveMoodEntry = (entry) => {
  try {
    const history = getMoodHistory();
    // Prepend new entry
    history.unshift(entry);
    // Keep only last 30 entries
    const limited = history.slice(0, 30);
    localStorage.setItem(MOOD_HISTORY_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error saving mood entry:', error);
  }
};

/**
 * Get mood history from localStorage
 * @returns {Array} Array of mood entries
 */
export const getMoodHistory = () => {
  try {
    const data = localStorage.getItem(MOOD_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading mood history:', error);
    return [];
  }
};

/**
 * Clear all mood history
 */
export const clearMoodHistory = () => {
  try {
    localStorage.removeItem(MOOD_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing mood history:', error);
  }
};

/**
 * Save last check-in timestamp
 */
export const saveLastCheckIn = () => {
  try {
    const now = new Date().toISOString();
    localStorage.setItem(LAST_CHECKIN_KEY, now);
  } catch (error) {
    console.error('Error saving check-in timestamp:', error);
  }
};

/**
 * Get formatted last check-in time
 * @returns {String} Formatted time string like "Today 9:41 AM" or "Yesterday 2:30 PM"
 */
export const getLastCheckIn = () => {
  try {
    const timestamp = localStorage.getItem(LAST_CHECKIN_KEY);
    if (!timestamp) return 'Never';

    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const formatTime = (d) => {
      return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    };

    const sameDay = (d1, d2) => {
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    };

    if (sameDay(date, today)) {
      return `Today ${formatTime(date)}`;
    } else if (sameDay(date, yesterday)) {
      return `Yesterday ${formatTime(date)}`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  } catch (error) {
    console.error('Error getting last check-in:', error);
    return 'Never';
  }
};
