import { motion } from 'framer-motion';

/**
 * StressMeter Component
 * SVG-based stress level gauge with smooth animations
 */
export const StressMeter = ({ stress = null, confidence = 0 }) => {
  // Map stress level to values
  const stressValues = {
    Low: 25,
    Medium: 50,
    High: 75,
  };

  const stressNum = stressValues[stress] ?? 0;

  // Color based on stress level
  const getColor = () => {
    if (!stress) return '#7a9e7e'; // sage when no data
    if (stress === 'Low') return '#7a9e7e'; // sage
    if (stress === 'Medium') return '#d4935a'; // amber
    if (stress === 'High') return '#c9837a'; // rose
  };

  const color = getColor();
  const circumference = Math.PI * 80; // 180° arc
  const strokeDashoffset = ((100 - stressNum) / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <h3 className="font-serif text-xl font-bold text-ink mb-4">Stress Level</h3>

      {/* SVG Gauge */}
      <div className="relative w-48 h-24 flex items-center justify-center">
        <svg width="200" height="120" viewBox="0 0 200 120">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Animated fill arc */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute text-center">
          <div className="font-serif text-3xl font-bold text-ink">
            {stress || '—'}
          </div>
          <div className="text-sm text-ink-soft mt-1">
            {confidence}% confident
          </div>
        </div>
      </div>

      {/* Pulsing ring when High */}
      {stress === 'High' && (
        <motion.div
          className="mt-4 w-20 h-20 border-2 border-rose rounded-full"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(201, 131, 122, 0.7)',
              '0 0 0 15px rgba(201, 131, 122, 0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Status text */}
      <p className="text-xs text-ink-soft mt-4">
        {!stress
          ? 'Share how you are feeling to start'
          : "You're in good hands"}
      </p>
    </div>
  );
};
