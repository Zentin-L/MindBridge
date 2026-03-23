import { motion } from 'framer-motion';

/**
 * MoodHistory Component
 * Displays past 7 days of mood data as a timeline
 */
import { getMoodHistory, clearMoodHistory } from '../utils/storage';

export const MoodHistory = () => {
  const history = getMoodHistory();
  const last7Days = history.slice(0, 7);

  const getStressColor = (stressLevel) => {
    switch (stressLevel) {
      case 'Low':
        return '#7a9e7e'; // sage
      case 'High':
        return '#c9837a'; // rose
      default:
        return '#d4935a'; // amber
    }
  };

  const handleClear = () => {
    if (
      window.confirm(
        'Clear all mood history? This cannot be undone.'
      )
    ) {
      clearMoodHistory();
      window.location.reload();
    }
  };

  if (last7Days.length === 0) {
    return (
      <div className="glass rounded-2xl p-4 mb-6">
        <h3 className="font-serif font-bold text-ink mb-3">Mood Timeline</h3>
        <p className="text-sm text-ink-soft">Start sharing to see your mood history</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-4 mb-6">
      <h3 className="font-serif font-bold text-ink mb-3">Mood Timeline</h3>

      <div className="flex gap-2 justify-center mb-4">
        {last7Days.map((entry, index) => {
          const date = new Date(entry.timestamp);
          const color = getStressColor(entry.stress_level);

          return (
            <motion.div
              key={index}
              className="group cursor-pointer flex flex-col items-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className="w-3 h-3 rounded-full transition-transform group-hover:scale-150"
                style={{ backgroundColor: color }}
              />
              <div className="opacity-0 group-hover:opacity-100 absolute bg-ink text-cream text-xs rounded px-2 py-1 mt-8 whitespace-nowrap transition-opacity z-10">
                {date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                — {entry.emotional_state}
              </div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={handleClear}
        className="text-xs text-ink-soft hover:text-rose transition-colors underline"
      >
        Clear history
      </button>
    </div>
  );
};
