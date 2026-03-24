import { useState } from 'react';
import axios from 'axios';
import { saveMoodEntry } from '../utils/storage';

// Configure axios base URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const api = axios.create({
  baseURL: API_URL,
});

/**
 * Custom hook for analyzing user messages with AI
 * @returns {Object} { analyzeMessage, isLoading, error }
 */
export const useAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Analyze a user message
   * @param {string} message - User message to analyze
   * @param {Array} history - Previous messages for context
   * @returns {Promise<Object>} Analysis result or fallback
   */
  const analyzeMessage = async (message, history = []) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/analyze', {
        message,
        history,
      });

      const analysis = response.data;

      // Save mood entry to localStorage
      try {
        const stressLevelNum = analysis.stress_level === 'Low' ? 1 : analysis.stress_level === 'High' ? 3 : 2;
        saveMoodEntry({
          timestamp: new Date().toISOString(),
          stress_level: analysis.stress_level,
          emotional_state: analysis.emotional_state,
          note: message.substring(0, 100),
        });
      } catch (storageError) {
        console.warn('Could not save mood entry:', storageError);
      }

      setIsLoading(false);
      return analysis;
    } catch (err) {
      console.error('Error details:', err);
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
      setIsLoading(false);

      // Return intelligent fallback response based on message
      const lowerMsg = message.toLowerCase();
      let emotionalState = 'uncertain';
      let stressLevel = 'Medium';
      let confidence = 50;
      let explanation = "I'm having trouble connecting to the service right now. Here's what I can tell you:";
      let suggestions = [
        "Take a few deep breaths",
        "Try again in a moment",
        "Check your internet connection"
      ];

      if (lowerMsg.includes('anxious') || lowerMsg.includes('worry') || lowerMsg.includes('panic')) {
        emotionalState = 'anxious';
        stressLevel = 'High';
        confidence = 65;
        explanation = "It sounds like you're experiencing anxiety. While I'm having connection issues, please know this is real and manageable.";
        suggestions = [
          "Practice grounding: 5-4-3-2-1 technique (5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste)",
          "Slow breathing: inhale for 4, hold for 4, exhale for 4",
          "Ground yourself physically - feel your feet on the floor"
        ];
      } else if (lowerMsg.includes('overwhelm') || lowerMsg.includes('stressed') || lowerMsg.includes('too much')) {
        emotionalState = 'overwhelmed';
        stressLevel = 'High';
        confidence = 68;
        explanation = "You're carrying a lot. Breaking things down helps when everything feels like too much.";
        suggestions = [
          "List everything on your mind - get it all out",
          "Pick one small thing to focus on right now",
          "Give yourself permission to pause and rest"
        ];
      } else if (lowerMsg.includes('tired') || lowerMsg.includes('burnt') || lowerMsg.includes('exhausted')) {
        emotionalState = 'burnt out';
        stressLevel = 'High';
        confidence = 70;
        explanation = "You sound exhausted. Burnout is telling you something important needs to change.";
        suggestions = [
          "Identify one thing you can stop or delegate",
          "Schedule rest like it's a critical appointment",
          "Do something restorative today"
        ];
      }

      return {
        emotional_state: emotionalState,
        stress_level: stressLevel,
        confidence: confidence,
        explanation: explanation,
        suggestions: suggestions,
        urgency_flag: false,
        affirmation: "You're doing your best by reaching out."
      };
    }
  };

  return { analyzeMessage, isLoading, error };
};
