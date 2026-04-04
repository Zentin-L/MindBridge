import { useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 200, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax transform layers
  const x1 = useTransform(smoothX, [0, 1920], [-40, 40]);
  const y1 = useTransform(smoothY, [0, 1080], [-40, 40]);

  const x2 = useTransform(smoothX, [0, 1920], [60, -60]);
  const y2 = useTransform(smoothY, [0, 1080], [60, -60]);

  const x3 = useTransform(smoothX, [0, 1920], [-30, 30]);
  const y3 = useTransform(smoothY, [0, 1080], [30, -30]);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('mindbridge_chat_messages');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [currentAnalysis, setCurrentAnalysis] = useState(() => {
    const saved = localStorage.getItem('mindbridge_current_analysis');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const { analyzeMessage, isLoading, error } = useAnalysis();

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mindbridge_chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Persist currentAnalysis to localStorage whenever it changes
  useEffect(() => {
    if (currentAnalysis) {
      localStorage.setItem('mindbridge_current_analysis', JSON.stringify(currentAnalysis));
    } else {
      localStorage.removeItem('mindbridge_current_analysis');
    }
  }, [currentAnalysis]);

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
    <div 
      className="flex h-screen bg-cream bg-grid-pattern overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {/* Parallax reactive background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          style={{ x: x1, y: y1 }}
          className="absolute top-[5%] left-[5%] w-[40vw] h-[40vw] bg-sage/20 rounded-full blur-[90px]" 
        />
        <motion.div 
          style={{ x: x2, y: y2 }}
          className="absolute bottom-[-10%] right-[5%] w-[50vw] h-[50vw] bg-dusk/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          style={{ x: x3, y: y3 }}
          className="absolute top-[30%] right-[30%] w-[35vw] h-[35vw] bg-rose/10 rounded-full blur-[80px]" 
        />
      </div>

      {/* Left Sidebar */}
      <div className="hidden md:flex flex-col w-80 bg-white/40 glass-3d border-r border-parchment/30 p-6 overflow-y-auto relative z-10">
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
