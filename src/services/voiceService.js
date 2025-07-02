class VoiceService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.commands = new Map();
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    this.conversationHistory = [];
    this.lastCommand = '';
    
    if (this.isSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }

    this.setupCommands();
  }

  setupRecognition() {
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('🎤 Voice recognition started');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('🔇 Voice recognition ended');
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      const confidence = event.results[0][0].confidence;
      
      console.log('🗣️ Voice input:', transcript, `(confidence: ${confidence.toFixed(2)})`);
      this.lastCommand = transcript;
      
      // Add to conversation history
      this.conversationHistory.push({
        type: 'user',
        message: transcript,
        timestamp: new Date(),
        confidence: confidence
      });

      this.processCommand(transcript);
    };

    this.recognition.onerror = (event) => {
      console.error('🚨 Voice recognition error:', event.error);
      this.isListening = false;
      
      switch (event.error) {
        case 'no-speech':
          this.speak('I didn\'t hear anything. Please try again.');
          break;
        case 'audio-capture':
          this.speak('Microphone access denied. Please check your permissions.');
          break;
        case 'not-allowed':
          this.speak('Voice recognition not allowed. Please enable microphone permissions.');
          break;
        default:
          this.speak('Voice recognition error occurred. Please try again.');
      }
    };
  }

  setupCommands() {
    // Navigation commands
    this.addCommand(['dashboard', 'go to dashboard', 'show dashboard'], () => {
      window.location.href = '/dashboard';
      this.speak('Navigating to dashboard');
    });

    this.addCommand(['items', 'show items', 'display items', 'view items'], () => {
      window.location.href = '/items';
      this.speak('Opening items page');
    });

    this.addCommand(['add item', 'new item', 'add new item', 'create item'], () => {
      window.location.href = '/add-item';
      this.speak('Opening add item page');
    });

    this.addCommand(['analytics', 'show analytics', 'view analytics', 'reports'], () => {
      window.location.href = '/analytics';
      this.speak('Opening analytics page');
    });

    this.addCommand(['retrieve', 'retrieve items', 'get items'], () => {
      window.location.href = '/retrieve';
      this.speak('Opening retrieve items page');
    });

    this.addCommand(['financial', 'financial reports', 'finances'], () => {
      window.location.href = '/financial';
      this.speak('Opening financial reports');
    });

    this.addCommand(['fruit', 'fruit freshness', 'check freshness'], () => {
      window.location.href = '/fruit-freshness';
      this.speak('Opening fruit freshness detector');
    });

    this.addCommand(['news', 'show news', 'business news'], () => {
      window.location.href = '/news';
      this.speak('Opening news page');
    });

    this.addCommand(['home', 'go home', 'main page'], () => {
      window.location.href = '/';
      this.speak('Going to home page');
    });

    // System commands
    this.addCommand(['refresh', 'refresh page', 'reload'], () => {
      window.location.reload();
      this.speak('Refreshing page');
    });

    this.addCommand(['back', 'go back'], () => {
      window.history.back();
      this.speak('Going back');
    });

    // Data commands
    this.addCommand(['total items', 'how many items', 'item count'], () => {
      this.speakInventoryStats('items');
    });

    this.addCommand(['total value', 'inventory value', 'how much worth'], () => {
      this.speakInventoryStats('value');
    });

    this.addCommand(['inventory status', 'status', 'overview'], () => {
      this.speakInventoryStats('overview');
    });

    // Search commands
    this.addCommand(['search'], (transcript) => {
      const searchMatch = transcript.match(/search (?:for )?(.+)/);
      if (searchMatch) {
        const searchTerm = searchMatch[1];
        this.speak(`Searching for ${searchTerm}`);
        this.triggerSearch(searchTerm);
      }
    });

    // Help commands
    this.addCommand(['help', 'what can you do', 'commands', 'show help'], () => {
      this.showHelp();
    });

    this.addCommand(['stop', 'stop listening', 'quit'], () => {
      this.stopListening();
      this.speak('Voice assistant stopped');
    });

    // Greetings and conversational
    this.addCommand(['hello', 'hi', 'hey'], () => {
      const greetings = [
        'Hello! How can I help you with your inventory?',
        'Hi there! What would you like me to do?',
        'Hey! I\'m ready to assist you.',
        'Hello! Ask me anything about your inventory system.'
      ];
      this.speak(greetings[Math.floor(Math.random() * greetings.length)]);
    });

    this.addCommand(['thank you', 'thanks'], () => {
      this.speak('You\'re welcome! Happy to help.');
    });

    this.addCommand(['goodbye', 'bye'], () => {
      this.speak('Goodbye! Talk to you later.');
    });
  }

  addCommand(triggers, callback) {
    if (Array.isArray(triggers)) {
      triggers.forEach(trigger => {
        this.commands.set(trigger, callback);
      });
    } else {
      this.commands.set(triggers, callback);
    }
  }

  processCommand(transcript) {
    let commandExecuted = false;

    // First check exact matches
    for (let [trigger, callback] of this.commands) {
      if (transcript === trigger || transcript.includes(trigger)) {
        try {
          callback(transcript);
          commandExecuted = true;
          
          // Add response to history
          this.conversationHistory.push({
            type: 'assistant',
            message: `Executed: ${trigger}`,
            timestamp: new Date()
          });
          break;
        } catch (error) {
          console.error('Command execution error:', error);
        }
      }
    }

    // If no exact match, try partial matches for more complex commands
    if (!commandExecuted) {
      if (transcript.includes('search')) {
        const searchMatch = transcript.match(/search (?:for )?(.+)/);
        if (searchMatch) {
          const searchTerm = searchMatch[1];
          this.speak(`Searching for ${searchTerm}`);
          this.triggerSearch(searchTerm);
          commandExecuted = true;
        }
      }
    }

    if (!commandExecuted) {
      // Try to provide helpful suggestions
      const suggestions = this.getSuggestions(transcript);
      if (suggestions.length > 0) {
        this.speak(`I didn't understand "${transcript}". Did you mean: ${suggestions.join(', or ')}?`);
      } else {
        this.speak('I didn\'t understand that command. Say "help" to see what I can do.');
      }
    }
  }

  getSuggestions(transcript) {
    const words = transcript.split(' ');
    const suggestions = [];

    // Look for similar commands
    for (let [trigger] of this.commands) {
      const triggerWords = trigger.split(' ');
      const commonWords = words.filter(word => triggerWords.includes(word));
      
      if (commonWords.length > 0) {
        suggestions.push(trigger);
      }
    }

    return suggestions.slice(0, 3); // Return top 3 suggestions
  }

  async speakInventoryStats(type = 'overview') {
    try {
      const stats = await this.getInventoryStats();
      
      if (!stats) {
        this.speak('Unable to retrieve inventory statistics at the moment.');
        return;
      }

      let message = '';
      
      switch (type) {
        case 'items':
          message = `You have ${stats.totalItems || 0} total items in your inventory.`;
          break;
        case 'value':
          message = `Your total inventory value is $${(stats.totalValue || 0).toFixed(2)}.`;
          break;
        case 'overview':
        default:
          const freshCount = stats.freshnessStatusCount?.Fresh || 0;
          message = `You have ${stats.totalItems || 0} items worth $${(stats.totalValue || 0).toFixed(2)}. ${freshCount} items are fresh.`;
          break;
      }
      
      this.speak(message);
    } catch (error) {
      this.speak('Error accessing inventory data.');
    }
  }

  async getInventoryStats() {
    try {
      // Try to get stats from localStorage first
      const dashboardStats = localStorage.getItem('dashboardStats');
      if (dashboardStats) {
        return JSON.parse(dashboardStats);
      }
      
      // Try to get from recent API call
      const recentItems = localStorage.getItem('recentItems');
      if (recentItems) {
        const items = JSON.parse(recentItems);
        return {
          totalItems: items.length,
          totalValue: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0)
        };
      }
      
      // Fallback stats
      return {
        totalItems: 0,
        totalValue: 0,
        totalQuantity: 0,
        freshnessStatusCount: { Fresh: 0 }
      };
    } catch (error) {
      console.error('Error getting inventory stats:', error);
      return null;
    }
  }

  triggerSearch(searchTerm) {
    // Dispatch a custom event that components can listen to
    window.dispatchEvent(new CustomEvent('voiceSearch', { 
      detail: { searchTerm } 
    }));
  }

  showHelp() {
    const helpMessage = `I can help you navigate and manage your inventory. Here are some commands you can try:

Navigation: "go to dashboard", "show items", "add item", "analytics", "financial reports"

Data: "total items", "inventory value", "inventory status"

Search: "search for laptops"

System: "refresh page", "go back"

Just speak naturally and I'll understand!`;

    this.speak(helpMessage);
  }

  startListening() {
    if (!this.isSupported) {
      console.warn('Speech recognition not supported');
      return false;
    }

    if (this.isListening) {
      return false;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  speak(text, options = {}) {
    if (!this.synthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    utterance.voice = options.voice || this.getPreferredVoice();

    utterance.onend = () => {
      console.log('🔊 Speech finished');
    };

    utterance.onerror = (event) => {
      console.error('🚨 Speech error:', event.error);
    };

    this.synthesis.speak(utterance);

    // Add to conversation history
    this.conversationHistory.push({
      type: 'assistant',
      message: text,
      timestamp: new Date()
    });
  }

  getPreferredVoice() {
    const voices = this.synthesis.getVoices();
    // Prefer English voices
    return voices.find(voice => voice.lang.startsWith('en-')) || voices[0];
  }

  // Check if voice features are supported
  isVoiceSupported() {
    return this.isSupported && !!this.synthesis;
  }

  // Get current listening state
  getListeningState() {
    return this.isListening;
  }

  // Get conversation history
  getConversationHistory() {
    return this.conversationHistory.slice(-10); // Keep last 10 entries
  }

  // Clear conversation history
  clearConversationHistory() {
    this.conversationHistory = [];
  }

  // Get last command
  getLastCommand() {
    return this.lastCommand;
  }

  // Set language for recognition
  setLanguage(language) {
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  // Get available voices
  getAvailableVoices() {
    return this.synthesis ? this.synthesis.getVoices() : [];
  }

  // Test voice functionality
  testVoice() {
    this.speak('Voice assistant is working correctly! I can understand commands like "go to dashboard", "total items", or "search for products". Try talking to me!');
  }
}

export default new VoiceService();