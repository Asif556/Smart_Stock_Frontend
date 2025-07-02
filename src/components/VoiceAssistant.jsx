import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  BadgeHelp as Help, 
  Zap, 
  Brain, 
  Headphones, 
  Play, 
  Square,
  MessageSquare,
  Wand2,
  Sparkles
} from 'lucide-react';
import voiceService from '../services/voiceService';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [volume, setVolume] = useState(1);
  const [speechRate, setSpeechRate] = useState(1);
  const [conversationHistory, setConversationHistory] = useState([]);

  useEffect(() => {
    setIsSupported(voiceService.isVoiceSupported());
    
    // Update states from voice service
    const checkListeningState = () => {
      setIsListening(voiceService.getListeningState());
      setLastCommand(voiceService.getLastCommand());
      setConversationHistory(voiceService.getConversationHistory());
    };

    const interval = setInterval(checkListeningState, 500);
    return () => clearInterval(interval);
  }, []);

  const toggleListening = () => {
    if (!isSupported || !isEnabled) return;

    if (isListening) {
      voiceService.stopListening();
    } else {
      const started = voiceService.startListening();
      if (!started) {
        alert('Failed to start voice recognition. Please check your microphone permissions.');
      }
    }
  };

  const startConversation = () => {
    if (isEnabled) {
      voiceService.speak('Hello! I\'m your voice assistant. I can help you navigate the app, check inventory, and much more. What would you like to do?');
      setTimeout(() => {
        toggleListening();
      }, 3000);
    }
  };

  const testVoice = () => {
    voiceService.speak('Voice assistant is working correctly', { 
      volume, 
      rate: speechRate 
    });
  };

  const showHelp = () => {
    voiceService.showHelp();
  };

  if (!isSupported) {
    return (
      <motion.div
        className="fixed bottom-8 left-8 bg-gray-800/90 backdrop-blur-sm border border-gray-600 p-4 text-white z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2">
          <MicOff className="h-5 w-5 text-red-400" />
          <span className="text-sm">Voice not supported</span>
        </div>
      </motion.div>
    );
  }

  const clearConversation = () => {
    voiceService.clearConversationHistory();
    setConversationHistory([]);
    setLastCommand('');
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Main Voice Button */}
      <motion.div
        className="fixed bottom-8 left-8 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3, duration: 0.5 }}
      >
        <motion.button
          onClick={toggleListening}
          disabled={!isEnabled}
          className={`p-4 shadow-2xl border-2 transition-all duration-300 relative ${
            isListening
              ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-500 animate-pulse'
              : isEnabled
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-500 hover:shadow-indigo-500/25'
              : 'bg-gray-600 border-gray-500 cursor-not-allowed'
          } text-white`}
          whileHover={isEnabled ? { scale: 1.1 } : {}}
          whileTap={{ scale: 0.9 }}
        >
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Mic className="h-6 w-6" />
            </motion.div>
          ) : (
            <MicOff className="h-6 w-6" />
          )}
          
          {/* AI Status Indicator */}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
            animate={{ 
              scale: isListening ? [1, 1.5, 1] : [1],
              opacity: isEnabled ? 1 : 0.5
            }}
            transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
          >
            <Sparkles className="h-2 w-2 text-white" />
          </motion.div>
        </motion.button>

        {/* Status Indicator */}
        <AnimatePresence>
          {lastCommand && (
            <motion.div
              className="absolute bottom-full left-0 mb-2 bg-gray-900/95 border border-gray-600 px-3 py-2 text-white text-sm max-w-80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start space-x-2">
                <Brain className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">Last: "{lastCommand}"</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control Panel */}
        <motion.div
          className="absolute bottom-full left-full ml-4 mb-0 flex items-center space-x-2 flex-wrap"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3.5, duration: 0.5 }}
        >
          {/* Conversation Button */}
          <motion.button
            onClick={() => setShowConversation(!showConversation)}
            className="p-2 bg-gray-800/90 backdrop-blur-sm border border-gray-600 text-white hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare className="h-4 w-4" />
          </motion.button>

          {/* Smart Conversation Starter */}
          <motion.button
            onClick={startConversation}
            className="p-2 bg-purple-600/90 backdrop-blur-sm border border-purple-500 text-white hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Wand2 className="h-4 w-4" />
          </motion.button>

          {/* Settings Button */}
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-gray-800/90 backdrop-blur-sm border border-gray-600 text-white hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="h-4 w-4" />
          </motion.button>

          {/* Help Button */}
          <motion.button
            onClick={showHelp}
            className="p-2 bg-gray-800/90 backdrop-blur-sm border border-gray-600 text-white hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Help className="h-4 w-4" />
          </motion.button>

          {/* Test Voice Button */}
          <motion.button
            onClick={testVoice}
            className="p-2 bg-gray-800/90 backdrop-blur-sm border border-gray-600 text-white hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="h-4 w-4" />
          </motion.button>

          {/* Enable/Disable Toggle */}
          <motion.button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`p-2 backdrop-blur-sm border transition-colors ${
              isEnabled 
                ? 'bg-green-600/90 border-green-500 text-white hover:bg-green-700' 
                : 'bg-red-600/90 border-red-500 text-white hover:bg-red-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="fixed bottom-32 left-8 bg-gray-900/95 backdrop-blur-sm border border-gray-600 p-6 text-white z-50 w-80"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <Headphones className="h-5 w-5 text-indigo-400" />
                <span>Voice Settings</span>
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                <Square className="h-4 w-4" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Speech Volume: {Math.round(volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Speech Rate: {speechRate}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Quick Commands */}
              <div>
                <h4 className="text-sm font-semibold mb-2 text-indigo-400">Quick Commands</h4>
                <div className="text-xs space-y-1 text-gray-300">
                  <div>"Go to dashboard"</div>
                  <div>"Add new item"</div>
                  <div>"Show analytics"</div>
                  <div>"Total items"</div>
                  <div>"Search for laptops"</div>
                  <div>"What can you do"</div>
                </div>
              </div>

              {/* Status */}
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span>Status:</span>
                  <span className={`font-semibold ${
                    isEnabled 
                      ? isListening 
                        ? 'text-red-400' 
                        : 'text-green-400'
                      : 'text-gray-400'
                  }`}>
                    {isEnabled 
                      ? isListening 
                        ? 'Listening...' 
                        : 'Ready'
                      : 'Disabled'
                    }
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conversation History Panel */}
      <AnimatePresence>
        {showConversation && (
          <motion.div
            className="fixed bottom-32 left-8 bg-gray-900/95 backdrop-blur-sm border border-gray-600 p-6 text-white z-50 w-96 max-h-96 overflow-y-auto"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                <span>AI Conversation</span>
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearConversation}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowConversation(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <Square className="h-4 w-4" />
                </button>
              </div>
            </div>

            {conversationHistory.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-sm">
                  No conversation yet. Click the microphone and start talking!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {conversationHistory.map((entry, index) => (
                  <motion.div
                    key={index}
                    className={`p-3 rounded-lg ${
                      entry.type === 'user' 
                        ? 'bg-indigo-600/20 border-l-4 border-indigo-400' 
                        : 'bg-purple-600/20 border-l-4 border-purple-400'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start space-x-2">
                      {entry.type === 'user' ? (
                        <Mic className="h-4 w-4 text-indigo-400 mt-0.5" />
                      ) : (
                        <Brain className="h-4 w-4 text-purple-400 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-white mb-1">{entry.message}</p>
                        <p className="text-xs text-gray-400">
                          {formatTime(entry.timestamp)}
                          {entry.confidence && ` • ${(entry.confidence * 100).toFixed(0)}% confidence`}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Visual Feedback */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            className="fixed bottom-8 left-8 pointer-events-none z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-20 h-20 border-2 border-red-500/30 rounded-full"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAssistant;