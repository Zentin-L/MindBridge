import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SuggestionCards } from './SuggestionCards';
import { EmergencyBanner } from './EmergencyBanner';
import { PromptChips } from './PromptChips';

/**
 * ChatPanel Component
 * Main chat interface with message display and input
 */
export const ChatPanel = ({
  messages,
  onSendMessage,
  isLoading,
  onPromptSelect,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  const handleTextAreaChange = (e) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(e.target.scrollHeight, 120) + 'px';
    }
  };

  // Handle send
  const handleSend = () => {
    const text = inputValue.trim();
    if (text) {
      onSendMessage(text);
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // Enter to send, Shift+Enter for newline
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmptyChat = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {isEmptyChat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-5xl mb-4">🧠</div>
            <h1 className="font-serif text-3xl font-bold text-ink mb-2">
              MindBridge
            </h1>
            <p className="text-ink-soft max-w-md mx-auto">
              Mental Health First-Aid AI. A compassionate space to share how
              you're feeling. Remember: this is support, not a substitute for
              professional care.
            </p>
          </motion.div>
        )}

        {/* Messages */}
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {msg.role === 'user' ? (
              // User message
              <div className="flex justify-end">
                <div className="max-w-sm bg-gradient-to-br from-sage to-sage-light text-ink rounded-3xl px-5 py-3 shadow-3d hover:-translate-y-0.5 transition-transform duration-300 relative z-10">
                  {msg.content}
                </div>
              </div>
            ) : (
              // AI message
              <div className="flex gap-3 max-w-2xl">
                <div className="text-2xl flex-shrink-0 z-10 hover:scale-110 transition-transform cursor-default">💙</div>
                <div className="flex-1">
                  <div className="glass-3d rounded-2xl p-4">
                    <p className="text-ink-soft text-sm leading-relaxed mb-4">
                      {msg.analysis?.explanation}
                    </p>

                    {msg.analysis?.suggestions && (
                      <SuggestionCards
                        suggestions={msg.analysis.suggestions}
                      />
                    )}

                    {msg.analysis?.affirmation && (
                      <div className="mt-4 pt-4 border-t border-white/30 italic text-ink text-sm">
                        "{msg.analysis.affirmation}"
                      </div>
                    )}

                    <EmergencyBanner show={msg.analysis?.urgency_flag} />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {/* Loading state */}
        {isLoading && (
          <motion.div className="flex gap-3 max-w-2xl">
            <div className="text-2xl z-10">🧠</div>
            <div className="glass-3d rounded-2xl p-4 flex-1">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-sage"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-parchment bg-cream/50 p-6 space-y-4">
        {/* Prompt chips only show when chat is empty */}
        <PromptChips
          onSelect={(prompt) => {
            setInputValue(prompt);
            setTimeout(() => {
              textareaRef.current?.focus();
            }, 0);
          }}
          hidden={!isEmptyChat}
        />

        {/* Input field */}
        <div className="flex gap-3">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleTextAreaChange}
            onKeyDown={handleKeyDown}
            placeholder="Share how you're feeling..."
            className="flex-1 p-3 rounded-xl border-2 border-parchment bg-white text-ink placeholder-ink-soft shadow-inner-3d focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 resize-none max-h-32 transition-shadow"
            rows="1"
          />
          <motion.button
            onClick={handleSend}
            disabled={isLoading}
            className="px-5 py-3 bg-gradient-to-r from-sage to-sage-light text-ink font-semibold rounded-xl btn-3d disabled:opacity-50 self-end"
          >
            Send
          </motion.button>
        </div>

        {/* Character counter */}
        {inputValue?.length > 200 && (
          <p className="text-xs text-ink-soft text-right">
            {inputValue.length} / 1000
          </p>
        )}
      </div>
    </div>
  );
};
