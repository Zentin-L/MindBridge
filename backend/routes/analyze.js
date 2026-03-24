const express = require('express');
const { Anthropic } = require('@anthropic-ai/sdk');

const router = express.Router();

// Initialize Anthropic client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Validation helper
const validateAnalysisRequest = (message) => {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message must be a non-empty string' };
  }
  if (message.trim().length < 3) {
    return { valid: false, error: 'Message must be at least 3 characters long' };
  }
  if (message.length > 1000) {
    return { valid: false, error: 'Message must not exceed 1000 characters' };
  }
  return { valid: true };
};

// System prompt for Claude
const SYSTEM_PROMPT = `You are MindBridge, a compassionate mental health first-aid support assistant. 

STRICT RULES:
- You NEVER diagnose any mental health condition
- You NEVER make clinical or medical claims  
- You always say things like "it sounds like", "you might be feeling", "many people experience this"
- You always encourage professional help for serious concerns
- You escalate urgency_flag to true ONLY if user mentions: self-harm, suicidal thoughts, wanting to hurt themselves/others, or expresses complete hopelessness

Respond ONLY with valid JSON, no markdown, no extra text:
{
  "emotional_state": "brief label like: anxious, burnt out, overwhelmed, lonely, sad, stressed",
  "stress_level": "Low" or "Medium" or "High",
  "confidence": <integer 50-95>,
  "explanation": "<2-3 warm empathetic sentences. Acknowledge feelings without diagnosing. Sound human, not clinical.>",
  "suggestions": ["<specific actionable tip>", "<specific actionable tip>", "<specific actionable tip>"],
  "urgency_flag": <true or false>,
  "affirmation": "<one short genuine uplifting sentence, not cheesy>"
}`;

// POST /api/analyze
router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // Validate input
    const validation = validateAnalysisRequest(message);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('WARNING: ANTHROPIC_API_KEY not set, returning mock response');
      return res.json({
        emotional_state: 'processing',
        stress_level: 'Medium',
        confidence: 60,
        explanation: 'Mock response: API key not configured. Please set ANTHROPIC_API_KEY in .env',
        suggestions: [
          'Check that .env file is configured',
          'Verify ANTHROPIC_API_KEY environment variable',
          'Restart the server after setting the key'
        ],
        urgency_flag: false,
        affirmation: 'You reached out - thats the first step.'
      });
    }

    // Build conversation history for context
    let conversationHistory = [];
    if (Array.isArray(history) && history.length > 0) {
      // Only include the last 10 messages to avoid token overflow
      const recentHistory = history.slice(-10);
      conversationHistory = recentHistory.map((msg) => ({
        role: msg.role || 'user', // Ensure role is set
        content: msg.content,
      }));
    }

    // Add the current message
    conversationHistory.push({
      role: 'user',
      content: message,
    });

    // Call Anthropic API
    let response;
    try {
      response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: conversationHistory,
      });
    } catch (apiError) {
      console.warn('Anthropic API Error:', apiError.message);
      // Return mock response if API fails (e.g., no credits, rate limit, etc.)
      return res.json({
        emotional_state: 'acknowledged',
        stress_level: message.toLowerCase().includes('overwhelm') || message.toLowerCase().includes('anxious') ? 'High' : 'Medium',
        confidence: 75,
        explanation: `I hear you saying: "${message}". Your feelings are valid and understandable. Take a moment to breathe - there are things you can do right now to help.`,
        suggestions: [
          'Try a 5-minute breathing exercise: breathe in for 4, hold for 4, exhale for 4',
          'Go for a short walk or stretch to release physical tension',
          'Write down what you\'re feeling to process your emotions'
        ],
        urgency_flag: message.toLowerCase().includes('hurt') || message.toLowerCase().includes('harm'),
        affirmation: 'You\'re stronger than you think, and reaching out for support is brave.'
      });
    }

    // Extract text content
    const responseText = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    // Parse JSON response
    let analysisData;
    try {
      // Extract JSON from response (in case there's any extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      analysisData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message);
      return res.status(500).json({
        error: 'Failed to parse AI response',
        details: parseError.message,
      });
    }

    // Validate response structure
    const requiredFields = [
      'emotional_state',
      'stress_level',
      'confidence',
      'explanation',
      'suggestions',
      'urgency_flag',
      'affirmation',
    ];
    const missingFields = requiredFields.filter((field) => !(field in analysisData));
    if (missingFields.length > 0) {
      return res.status(500).json({
        error: 'Incomplete response from AI',
        missingFields,
      });
    }

    // Return the parsed analysis
    res.json(analysisData);
  } catch (error) {
    console.error('Analyze endpoint error:', error);
    res.status(500).json({
      error: 'An error occurred during analysis',
      details: error.message,
    });
  }
});

module.exports = router;
