import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Gemini API key not found - AI features will be limited');
      this.genAI = null;
      this.model = null;
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }
  }

  // Smart item suggestions based on name
  async getItemSuggestions(itemName) {
    try {
      if (!this.model) {
        return this.getFallbackSuggestions(itemName);
      }
      
      const prompt = `
        Based on the item name "${itemName}", provide intelligent suggestions for an inventory management system.
        Return a JSON object with the following structure:
        {
          "suggestedDescription": "A detailed, professional description for this item",
          "suggestedCategory": "An appropriate category",
          "suggestedPrice": "A reasonable price estimate (number only)",
          "suggestedTags": ["tag1", "tag2", "tag3"],
          "storageRecommendations": "Best storage practices",
          "shelfLife": "Expected shelf life or durability",
          "demandForecast": "High/Medium/Low demand prediction"
        }
        
        Only return valid JSON, no additional text.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        // Fallback if JSON parsing fails
        return {
          suggestedDescription: `Professional quality ${itemName} suitable for commercial use`,
          suggestedCategory: 'General',
          suggestedPrice: 10,
          suggestedTags: ['inventory', 'stock'],
          storageRecommendations: 'Store in cool, dry place',
          shelfLife: '6 months',
          demandForecast: 'Medium'
        };
      }
    } catch (error) {
      console.error('AI suggestion error:', error);
      return null;
    }
  }

  // Generate inventory insights
  async generateInventoryInsights(inventoryData) {
    try {
      if (!this.model) {
        return this.getFallbackInsights();
      }
      
      const prompt = `
        Analyze this inventory data and provide intelligent business insights:
        ${JSON.stringify(inventoryData)}
        
        Return a JSON object with:
        {
          "insights": [
            {
              "type": "success|warning|info|danger",
              "title": "Insight title",
              "description": "Detailed insight description",
              "actionable": "Recommended action to take"
            }
          ],
          "predictions": {
            "demandForecast": "Analysis of future demand trends",
            "stockOptimization": "Recommendations for stock levels",
            "profitability": "Profitability analysis and suggestions"
          },
          "alerts": [
            {
              "priority": "high|medium|low",
              "message": "Alert message",
              "recommendation": "What to do about it"
            }
          ]
        }
        
        Only return valid JSON, no additional text.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        // Fallback insights
        return {
          insights: [
            {
              type: 'info',
              title: 'Inventory Analysis',
              description: 'Your inventory is performing well with good diversity.',
              actionable: 'Continue monitoring stock levels and freshness status.'
            }
          ],
          predictions: {
            demandForecast: 'Steady demand expected with seasonal variations',
            stockOptimization: 'Current stock levels appear optimal',
            profitability: 'Good profit margins maintained across product range'
          },
          alerts: []
        };
      }
    } catch (error) {
      console.error('AI insights error:', error);
      return this.getFallbackInsights();
    }
  }

  // AI Chat Assistant
  async getChatResponse(message, context) {
    try {
      if (!this.model) {
        return this.getFallbackChatResponse(message);
      }
      
      const prompt = `
        You are an intelligent inventory management assistant. The user asked: "${message}"
        
        ${context ? `Context about their inventory: ${JSON.stringify(context)}` : ''}
        
        Provide a helpful, professional response about inventory management, analytics, or business optimization.
        Keep responses concise but informative. If they ask about their specific data, use the context provided.
        
        Format your response as a JSON object:
        {
          "response": "Your helpful response here",
          "suggestions": ["suggestion1", "suggestion2"],
          "actions": [
            {
              "label": "Action button text",
              "action": "navigate_to_dashboard|add_item|view_analytics|refresh_data"
            }
          ]
        }
        
        Only return valid JSON, no additional text.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return {
          response: "I'm here to help with your inventory management. What would you like to know?",
          suggestions: ["View your dashboard", "Add new items", "Check analytics"],
          actions: [
            { label: "Go to Dashboard", action: "navigate_to_dashboard" }
          ]
        };
      }
    } catch (error) {
      console.error('AI chat error:', error);
      return this.getFallbackChatResponse(message);
    }
  }

  // Smart categorization
  async categorizeItem(itemName, description) {
    try {
      const prompt = `
        Categorize this inventory item:
        Name: "${itemName}"
        Description: "${description}"
        
        Return ONLY one of these categories:
        Food & Beverages
        Electronics
        Clothing & Apparel
        Health & Beauty
        Home & Garden
        Sports & Recreation
        Books & Media
        Automotive
        Office Supplies
        Toys & Games
        Industrial
        Other
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('AI categorization error:', error);
      return 'Other';
    }
  }

  // Enhanced voice command processing
  async processVoiceCommand(transcript, context = {}) {
    try {
      const prompt = `
        You are an advanced AI voice assistant for a Smart Inventory Management System.
        
        User voice input: "${transcript}"
        
        Current context:
        ${JSON.stringify(context)}
        
        Process this voice command and return a structured response that includes:
        1. Intent recognition (what the user wants to do)
        2. Entity extraction (specific items, numbers, dates, etc.)
        3. Action to execute
        4. Natural language response
        5. Any follow-up questions or clarifications needed
        
        Return JSON format:
        {
          "intent": "navigation|query|action|calculation|help|conversation",
          "confidence": 0.95,
          "entities": {
            "items": [],
            "numbers": [],
            "dates": [],
            "locations": []
          },
          "action": {
            "type": "navigate|search|calculate|add|retrieve|export|analyze",
            "target": "specific_target",
            "parameters": {}
          },
          "response": "Natural language response to user",
          "needsMoreInfo": false,
          "followUpQuestions": [],
          "suggestedActions": []
        }
        
        Be conversational, intelligent, and context-aware. Handle complex, multi-part requests.
        
        ONLY return valid JSON, no additional text.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return {
          intent: 'conversation',
          confidence: 0.5,
          entities: {},
          action: { type: 'respond', target: 'user', parameters: {} },
          response: "I understand you're trying to tell me something, but I need more clarity. Could you please rephrase your request?",
          needsMoreInfo: true,
          followUpQuestions: ['What specifically would you like me to help you with?'],
          suggestedActions: ['Navigate to dashboard', 'Check inventory', 'Add new item']
        };
      }
    } catch (error) {
      console.error('Voice command processing error:', error);
      return {
        intent: 'error',
        confidence: 0,
        entities: {},
        action: { type: 'error', target: 'system', parameters: { error: error.message } },
        response: "I'm having trouble processing your request right now. Please try again.",
        needsMoreInfo: false,
        followUpQuestions: [],
        suggestedActions: ['Try again', 'Use manual navigation']
      };
    }
  }

  // Generate contextual responses based on conversation history
  async generateContextualResponse(message, conversationHistory, appContext) {
    try {
      const prompt = `
        You are an intelligent inventory management assistant. Generate a contextual response.
        
        Current message: "${message}"
        
        Conversation history:
        ${JSON.stringify(conversationHistory.slice(-5))}
        
        App context:
        ${JSON.stringify(appContext)}
        
        Generate a helpful, contextual response that:
        1. References previous conversation if relevant
        2. Provides specific help based on current app state
        3. Offers actionable suggestions
        4. Maintains conversation flow
        
        Return JSON:
        {
          "response": "Natural conversational response",
          "actions": [
            {"label": "Action name", "action": "action_type", "params": {}}
          ],
          "suggestions": ["suggestion1", "suggestion2"],
          "followUp": "Optional follow-up question"
        }
        
        ONLY return valid JSON, no additional text.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return {
          response: "I'm here to help with your inventory management. What would you like to know?",
          actions: [{ label: "View Dashboard", action: "navigate", params: { page: "/dashboard" } }],
          suggestions: ["Check inventory status", "Add new items", "View analytics"],
          followUp: null
        };
      }
    } catch (error) {
      console.error('Contextual response error:', error);
      return {
        response: "I'm experiencing some technical difficulties. How can I assist you with your inventory?",
        actions: [],
        suggestions: [],
        followUp: null
      };
    }
  }

  // Predict optimal stock levels
  async predictOptimalStock(itemData, historicalData) {
    try {
      const prompt = `
        Based on this item data, predict optimal stock levels:
        ${JSON.stringify(itemData)}
        
        ${historicalData ? `Historical data: ${JSON.stringify(historicalData)}` : ''}
        
        Return a JSON object:
        {
          "recommendedStock": "number",
          "reorderPoint": "number",
          "reasoning": "explanation for the recommendation",
          "confidence": "high|medium|low"
        }
        
        Only return valid JSON, no additional text.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return {
          recommendedStock: Math.max(50, itemData.quantity * 1.2),
          reorderPoint: Math.max(10, itemData.quantity * 0.3),
          reasoning: 'Based on current stock levels and standard inventory practices',
          confidence: 'medium'
        };
      }
    } catch (error) {
      console.error('AI stock prediction error:', error);
      return null;
    }
  }

  // Fallback methods for when API key is not available
  getFallbackSuggestions(itemName) {
    const categories = ['Electronics', 'Food & Beverages', 'Clothing', 'Home & Garden', 'Office Supplies'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    return {
      suggestedDescription: `Professional quality ${itemName} suitable for commercial use`,
      suggestedCategory: randomCategory,
      suggestedPrice: Math.floor(Math.random() * 100) + 10,
      suggestedTags: ['inventory', 'stock', itemName.toLowerCase()],
      storageRecommendations: 'Store in cool, dry place away from direct sunlight',
      shelfLife: '6-12 months',
      demandForecast: 'Medium'
    };
  }

  getFallbackInsights() {
    return {
      insights: [
        {
          type: 'info',
          title: 'System Status',
          description: 'Your inventory system is running smoothly. AI features are currently limited.',
          actionable: 'Consider adding an AI API key for enhanced insights.'
        },
        {
          type: 'success',
          title: 'Data Health',
          description: 'Your inventory data is well-organized and accessible.',
          actionable: 'Continue maintaining good data hygiene practices.'
        }
      ],
      predictions: {
        demandForecast: 'Historical data suggests steady demand patterns',
        stockOptimization: 'Current stock levels appear balanced',
        profitability: 'Maintain current pricing strategy for optimal returns'
      },
      alerts: [
        {
          priority: 'low',
          message: 'AI features are running in limited mode',
          recommendation: 'Add a Gemini API key to unlock full AI capabilities'
        }
      ]
    };
  }

  getFallbackChatResponse(message) {
    const responses = {
      dashboard: "Navigate to your dashboard to see an overview of your inventory.",
      items: "Check the items page to view and manage your inventory.",
      analytics: "Visit the analytics section for detailed reports and insights.",
      help: "I can help you navigate the system, manage inventory, and provide basic guidance."
    };

    // Simple keyword matching
    const lowerMessage = message.toLowerCase();
    let response = "I'm here to help with your inventory management system.";
    
    if (lowerMessage.includes('dashboard')) response = responses.dashboard;
    else if (lowerMessage.includes('items') || lowerMessage.includes('inventory')) response = responses.items;
    else if (lowerMessage.includes('analytics') || lowerMessage.includes('reports')) response = responses.analytics;
    else if (lowerMessage.includes('help')) response = responses.help;

    return {
      response: response + " (AI features are currently limited - add an API key for enhanced capabilities)",
      suggestions: ["View Dashboard", "Check Items", "See Analytics", "Get Help"],
      actions: [
        { label: "Go to Dashboard", action: "navigate_to_dashboard" }
      ]
    };
  }
}

export default new AIService();