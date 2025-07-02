import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Loader2,
  Minimize2,
  Maximize2,
  Sparkles
} from 'lucide-react';
import aiService from '../services/aiService';

const AIChatAssistant = ({ inventoryContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'ai',
        content: "👋 Hello! I'm your AI inventory assistant. I can help you analyze your inventory, provide insights, answer questions, and guide you through the system. What would you like to know?",
        timestamp: new Date(),
        suggestions: [
          "Analyze my inventory performance",
          "What items need attention?",
          "Show me growth opportunities",
          "Help me optimize stock levels"
        ]
      }]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message) => {
    const messageText = message || inputValue.trim();
    if (!messageText || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await aiService.getChatResponse(messageText, inventoryContext);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.response,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
        actions: aiResponse.actions
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action) => {
    switch (action) {
      case 'navigate_to_dashboard':
        window.location.href = '/dashboard';
        break;
      case 'add_item':
        window.location.href = '/add-item';
        break;
      case 'view_analytics':
        window.location.href = '/analytics';
        break;
      case 'refresh_data':
        window.location.reload();
        break;
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-indigo-500/25 z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <MessageCircle className="h-6 w-6" />
        <motion.div
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="h-3 w-3" />
        </motion.div>
      </motion.button>
    );
  }

  return (
    <motion.div
      className={`fixed ${isMinimized ? 'bottom-8 right-8' : 'bottom-8 right-8'} z-50`}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`bg-gray-900 border border-gray-600 shadow-2xl ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
      } flex flex-col transition-all duration-300`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold">AI Assistant</h3>
              <p className="text-xs opacity-90">Powered by Gemini AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`max-w-[80%] ${
                    message.type === 'user' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-700 text-gray-100'
                  } p-3 rounded-lg`}>
                    <div className="flex items-start space-x-2">
                      {message.type === 'ai' && <Bot className="h-4 w-4 mt-1 text-indigo-400" />}
                      {message.type === 'user' && <User className="h-4 w-4 mt-1" />}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendMessage(suggestion)}
                            className="block w-full text-left text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                          >
                            💡 {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {message.actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleActionClick(action.action)}
                            className="block w-full text-left text-xs bg-indigo-500 hover:bg-indigo-600 px-2 py-1 rounded transition-colors"
                          >
                            🚀 {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gray-700 text-gray-100 p-3 rounded-lg flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-indigo-400" />
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700 bg-gray-900">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me about your inventory..."
                  className="flex-1 bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:border-indigo-400 focus:outline-none"
                  disabled={isLoading}
                />
                <motion.button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AIChatAssistant;