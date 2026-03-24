import { useState, useCallback, useEffect } from 'react';
import { ChatPanel } from './components/ChatPanel';
import { StressMeter } from './components/StressMeter';
import { MoodHistory } from './components/MoodHistory';
import { DailyCheckIn } from './components/DailyCheckIn';
import { useAnalysis } from './hooks/useAnalysis';

/**
 * App Component
 * Main layout with sidebar + chat panel split
 */
function App() {
  const [messages, setMessages] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const { analyzeMessage, isLoading, error } = useAnalysis();

  // Handle new message
  const handleSendMessage = useCallback(
    async (text) => {
      // Add user message
      const userMessage = { role: 'user', content: text };
      setMessages((prev) => [...prev, userMessage]);

      // Prepare history for API
      const messageHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call AI
      const analysis = await analyzeMessage(text, messageHistory);

      // Add AI message with analysis
      if (analysis) {
        setCurrentAnalysis(analysis);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: analysis.explanation,
            analysis,
          },
        ]);
      }
    },
    [messages, analyzeMessage]
  );

  // Handle quick check-in
  const handleQuickCheckIn = useCallback((prompt) => {
    handleSendMessage(prompt);
  }, [handleSendMessage]);

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      {/* Radial gradient background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-sage/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-dusk/10 rounded-full blur-3xl" />
        <div className="absolute top-60 right-40 w-72 h-72 bg-rose/5 rounded-full blur-3xl" />
      </div>

      {/* Left Sidebar */}
      <div className="hidden md:flex flex-col w-80 bg-white/40 glass border-r border-parchment/30 p-6 overflow-y-auto relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🧠</div>
          <h1 className="font-serif text-2xl font-bold text-ink">MindBridge</h1>
          <p className="text-xs text-ink-soft mt-1">First-Aid Support</p>
        </div>

        {/* Stress Meter */}
        <div className="mb-8">
          <StressMeter
            stress={currentAnalysis?.stress_level}
            confidence={currentAnalysis?.confidence}
          />
        </div>

        {/* Daily Check-In */}
        <DailyCheckIn onCheckIn={handleQuickCheckIn} />

        {/* Mood History */}
        <MoodHistory />

        {/* Disclaimer */}
        <div className="mt-auto pt-6 border-t border-parchment/30">
          <p className="text-xs text-ink-soft leading-relaxed">
            ⚠️ <strong>Disclaimer:</strong> MindBridge is a support tool only.
            It does not diagnose or replace professional care. If you're in
            crisis, contact a helpline immediately.
          </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col md:w-auto relative z-10">
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onPromptSelect={handleQuickCheckIn}
        />
      </div>

      {/* Mobile overlay sidebar trigger */}
      <button className="md:hidden fixed bottom-6 left-6 w-12 h-12 bg-sage rounded-full shadow-lg text-white font-bold z-20">
        ≡
      </button>
    </div>
  );
}

export default App;
