import { motion, AnimatePresence } from 'framer-motion';

/**
 * EmergencyBanner Component
 * Displays when urgency_flag is true with helpline information
 */
const helplines = [
  { country: 'India', name: 'iCall', number: '9152987821' },
  { country: 'India', name: 'Vandrevala', number: '1860-2662-345' },
  { country: 'US', name: 'Crisis Text Line', text: 'Text HOME to 741741' },
];

export const EmergencyBanner = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4 rounded-2xl bg-gradient-to-r from-rose/20 to-amber/20 border-2 border-rose/40 p-4 relative overflow-hidden"
        >
          {/* Pulsing border animation */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-rose/60"
            animate={{
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <div className="relative z-10">
            <h3 className="font-serif font-bold text-rose mb-2">
              💙 We hear you. You're not alone.
            </h3>

            <p className="text-sm text-ink-soft mb-3">
              If you're in crisis, please reach out to someone you trust or contact a helpline:
            </p>

            <div className="space-y-2 bg-white/40 rounded-lg p-3 mb-3">
              {helplines.map((helpline, index) => (
                <div key={index} className="text-sm text-ink font-medium">
                  <span className="font-semibold">{helpline.country}:</span>{' '}
                  <span className="text-rose">
                    {helpline.name} {helpline.number || helpline.text}
                  </span>
                </div>
              ))}
              <div className="text-sm text-ink-soft">
                🌍{' '}
                <a
                  href="https://www.befrienders.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose underline hover:no-underline"
                >
                  Befrienders Worldwide
                </a>
              </div>
            </div>

            <button
              className="text-xs text-ink-soft hover:text-ink transition-colors"
              onClick={() => {}}
            >
              ✕ Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
