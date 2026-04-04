import { motion } from 'framer-motion';
import { getLastCheckIn, saveLastCheckIn } from '../utils/storage';

/**
 * DailyCheckIn Component
 * Quick button to start a daily mood check-in
 */
export const DailyCheckIn = ({ onCheckIn }) => {
  const lastCheckIn = getLastCheckIn();

  const handleClick = () => {
    saveLastCheckIn();
    onCheckIn("Today's check-in: How am I feeling right now?");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-3d rounded-2xl p-4 mb-6"
    >
      <button
        onClick={handleClick}
        className="w-full py-3 bg-gradient-to-r from-sage to-sage-light text-ink font-semibold rounded-xl btn-3d font-serif"
      >
        Daily Check-In 🌤️
      </button>
      <p className="text-xs text-ink-soft mt-3 text-center">
        Last check-in: {lastCheckIn}
      </p>
    </motion.div>
  );
};
