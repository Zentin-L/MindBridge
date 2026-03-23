import { motion } from 'framer-motion';

/**
 * SuggestionCards Component
 * Displays action suggestions from AI analysis
 */
const suggestionMap = {
  breathing: { emoji: '🫁', label: 'Box Breathing' },
  journaling: { emoji: '📓', label: 'Journal It Out' },
  walk: { emoji: '🚶', label: 'Gentle Movement' },
  movement: { emoji: '🚶', label: 'Gentle Movement' },
  talk: { emoji: '💬', label: 'Reach Out' },
  rest: { emoji: '😴', label: 'Rest & Restore' },
  grounding: { emoji: '🌿', label: 'Grounding Exercise' },
};

const getSuggestionCard = (suggestion) => {
  // Try to match suggestion to a category
  const text = suggestion.toLowerCase();
  let found = null;

  Object.keys(suggestionMap).forEach((key) => {
    if (text.includes(key)) {
      found = suggestionMap[key];
    }
  });

  if (found) {
    return {
      emoji: found.emoji,
      title: found.label,
      description: suggestion,
    };
  }

  // Default fallback
  return {
    emoji: '✨',
    title: 'Wellness Tip',
    description: suggestion,
  };
};

export const SuggestionCards = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) return null;

  const cards = suggestions.map((suggestion) => getSuggestionCard(suggestion));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4"
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className="glass rounded-2xl p-4 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
            {card.emoji}
          </div>
          <h4 className="font-serif font-bold text-ink mb-1">{card.title}</h4>
          <p className="text-sm text-ink-soft">{card.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};
