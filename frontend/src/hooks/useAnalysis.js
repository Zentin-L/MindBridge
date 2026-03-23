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
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
      setIsLoading(false);

      // Return fallback response
      return {
        emotional_state: 'uncertain',
        stress_level: 'Medium',
        confidence: 30,
        explanation: "I'm having trouble connecting to the service right now. Please try again in a moment.",
        suggestions: [
          'Take a few deep breaths',
          'Try again in a moment',
          'Check your connection',
        ],
        urgency_flag: false,
        affirmation: "You're doing your best by reaching out.",
      };
    }
  };

  return { analyzeMessage, isLoading, error };
};
