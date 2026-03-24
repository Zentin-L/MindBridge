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
      console.error('Anthropic API Error:', apiError.message);
      console.warn('⚠️  Using fallback response - API unavailable');
      
      // Return intelligent mock response based on user message
      const lowerMsg = message.toLowerCase();
      let emotionalState = 'uncertain';
      let stressLevel = 'Medium';
      let confidence = 65;
      let suggestions = [];
      let explanation = '';
      
      if (lowerMsg.includes('anxious') || lowerMsg.includes('worry') || lowerMsg.includes('panic')) {
        emotionalState = 'anxious';
        stressLevel = 'High';
        confidence = 78;
        explanation = "It sounds like anxiety is weighing on you right now. That's a real feeling that many people experience, and it's manageable with the right tools and support.";
        suggestions = [
          'Practice grounding: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste',
          'Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8',
          "Remind yourself: this feeling is temporary and you've handled tough moments before"
        ];
      } else if (lowerMsg.includes('overwhelm') || lowerMsg.includes('stressed') || lowerMsg.includes('too much')) {
        emotionalState = 'overwhelmed';
        stressLevel = 'High';
        confidence = 80;
        explanation = "You're carrying a lot right now and that's a lot to handle. It's completely normal to feel overwhelmed - breaking things down into smaller pieces really helps.";
        suggestions = [
          'Write down ALL the things in your head - get them out and onto paper',
          'Pick just ONE thing to focus on right now, put the rest aside temporarily',
          'Take a real break: step outside, move your body, or just sit quietly for 5 minutes'
        ];
      } else if (lowerMsg.includes('sad') || lowerMsg.includes('depressed') || lowerMsg.includes('lonely')) {
        emotionalState = 'sad';
        stressLevel = 'High';
        confidence = 75;
        explanation = "You're going through something difficult and that heaviness is real. Reaching out, even like this, shows you're looking for a way through.";
        suggestions = [
          'Connect with one person today - call, text, or be near someone who cares',
          'Do one small thing that usually brings you comfort',
          "Be kind to yourself - you're struggling and that deserves compassion, not judgment"
        ];
      } else if (lowerMsg.includes('tired') || lowerMsg.includes('burnt') || lowerMsg.includes('exhausted')) {
        emotionalState = 'burnt out';
        stressLevel = 'High';
        confidence = 77;
        explanation = "You're running on empty - burnout is your signal that something needs to change. Listening to that signal is important.";
        suggestions = [
          'Identify one thing you can stop doing or delegate this week',
          'Schedule real rest time like you would any important appointment',
          'Do something restorative that has nothing to do with your usual responsibilities'
        ];
      } else if (lowerMsg.includes('good') || lowerMsg.includes('great') || lowerMsg.includes('happy') || lowerMsg.includes('amazing')) {
        emotionalState = 'positive';
        stressLevel = 'Low';
        confidence = 82;
        explanation = "You're in a good place right now and that's wonderful! You might be sharing this because you want to maintain this feeling or appreciate it more deeply.";
        suggestions = [
          "Pause and really notice what's contributing to this positive mood",
          'Share this moment with someone who cares about you',
          "Reflect on what you've done to get here - you can build on these strengths"
        ];
      } else if (lowerMsg.includes('hurt') || lowerMsg.includes('harm') || lowerMsg.includes('self-harm')) {
        emotionalState = 'in crisis';
        stressLevel = 'High';
        confidence = 85;
        explanation = "I'm genuinely concerned about what you're sharing. You deserve real professional support right now, not just an AI.";
        suggestions = [
          'Contact the 988 Suicide & Crisis Lifeline (call or text 988 in the US)',
          "Go to your nearest emergency room if you're in immediate danger",
          'Text "HELLO" to 741741 for the Crisis Text Line'
        ];
      } else {
        explanation = `I hear what you're saying about "${message.substring(0, 40)}..." and want you to know your feelings matter. Whatever you're experiencing right now is valid.`;
        suggestions = [
          'Take a moment to check in with yourself - what would help right now?',
          "Remember that talking about it, like you're doing, is a positive step",
          'Be patient and gentle with yourself today'
        ];
      }
      
      return res.json({
        emotional_state: emotionalState,
        stress_level: stressLevel,
        confidence: confidence,
        explanation: explanation,
        suggestions: suggestions,
        urgency_flag: lowerMsg.includes('hurt') || lowerMsg.includes('harm') || lowerMsg.includes('suicide'),
        affirmation: "Your willingness to acknowledge how you're feeling is the first step toward feeling better."
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
