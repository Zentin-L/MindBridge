import { motion } from 'framer-motion';

/**
 * PromptChips Component
 * Displays clickable prompt suggestions when chat is empty
 */
export const PromptChips = ({ onSelect, hidden }) => {
  const prompts = [
    'I feel tired all the time',
    "I can't stop overthinking",
    'I feel anxious before exams',
    "I don't want to talk to anyone",
    "Nothing feels exciting anymore",
    "I'm feeling overwhelmed at work",
  ];

  if (hidden) return null;

  return (
    <div className="mb-4 overflow-x-auto">
      <div className="flex gap-2 pb-4">
        {prompts.map((prompt, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(prompt)}
            className="whitespace-nowrap px-4 py-2 rounded-full bg-gradient-to-r from-sage-light to-dusk-light text-ink text-sm font-medium hover:shadow-md transition-shadow flex-shrink-0"
          >
            {prompt}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
