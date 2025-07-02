import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  ArrowLeft, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  X,
  Eye,
  RotateCcw,
  Zap,
  Brain,
  Apple,
  TrendingUp,
  Clock,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import fruitFreshnessService from '../services/fruitFreshnessService';
import AIChatAssistant from '../components/AIChatAssistant';

const FruitFreshnessPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  
  // State management
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [modelHealth, setModelHealth] = useState(null);
  const [error, setError] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);

  useEffect(() => {
    checkModelHealth();
    loadAnalysisHistory();
  }, []);

  const checkModelHealth = async () => {
    try {
      const health = await fruitFreshnessService.checkModelHealth();
      setModelHealth(health);
    } catch (error) {
      setModelHealth({
        isHealthy: false,
        modelLoaded: false,
        message: 'Failed to check model status'
      });
    }
  };

  const loadAnalysisHistory = () => {
    try {
      const history = JSON.parse(localStorage.getItem('fruitAnalysisHistory') || '[]');
      setAnalysisHistory(history.slice(-10)); // Keep last 10 analyses
    } catch (error) {
      console.error('Error loading analysis history:', error);
    }
  };

  const saveToHistory = (result, imageName) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      imageName,
      prediction: result.prediction,
      confidence: result.confidence,
      recommendation: result.recommendation
    };

    const updatedHistory = [newEntry, ...analysisHistory].slice(0, 10);
    setAnalysisHistory(updatedHistory);
    localStorage.setItem('fruitAnalysisHistory', JSON.stringify(updatedHistory));
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
        
        // Reset previous results
        setAnalysisResult(null);
        setError(null);
      } else {
        setError('Please select a valid image file (JPG, PNG, etc.)');
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const fakeEvent = {
        target: { files: [file] }
      };
      handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const analyzeFruit = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await fruitFreshnessService.predictFreshness(selectedImage);
      
      if (result.success) {
        setAnalysisResult(result);
        saveToHistory(result, selectedImage.name);
      } else {
        setError(result.error || 'Analysis failed');
      }
    } catch (error) {
      setError('Failed to analyze image: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusColor = (prediction) => {
    switch (prediction) {
      case 'Fresh': return 'from-green-500 to-green-700';
      case 'Good': return 'from-yellow-500 to-yellow-700';
      case 'Fair': return 'from-orange-500 to-orange-700';
      case 'Bad': return 'from-red-500 to-red-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getStatusIcon = (prediction) => {
    switch (prediction) {
      case 'Fresh': return <CheckCircle className="h-6 w-6" />;
      case 'Good': return <CheckCircle className="h-6 w-6" />;
      case 'Fair': return <AlertTriangle className="h-6 w-6" />;
      case 'Bad': return <X className="h-6 w-6" />;
      default: return <Eye className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
            
            <motion.button
              onClick={checkModelHealth}
              className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 border border-purple-500 font-semibold transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shield className="h-5 w-5" />
              <span>Check AI Status</span>
            </motion.button>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-none">
            <motion.span
              className="block"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              AI FRUIT
            </motion.span>
            <motion.span
              className="block text-green-400 -mt-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              FRESHNESS
            </motion.span>
            <motion.span
              className="block text-purple-400 -mt-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              DETECTOR
            </motion.span>
          </h1>
          
          <motion.p 
            className="text-xl font-medium text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Upload fruit images for instant AI-powered freshness analysis
          </motion.p>
        </motion.div>

        {/* Model Status */}
        {modelHealth && (
          <motion.div
            className={`mb-8 p-4 border ${
              modelHealth.isHealthy 
                ? 'bg-green-600/20 border-green-500 text-green-300' 
                : 'bg-red-600/20 border-red-500 text-red-300'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <div className="flex items-center space-x-2">
              {modelHealth.isHealthy ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
              <span className="font-semibold">AI Model Status:</span>
              <span>{modelHealth.message}</span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analysis Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upload Area */}
            <motion.div
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 p-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <Brain className="h-6 w-6 text-purple-400" />
                <span>AI Fruit Analysis</span>
              </h3>

              {!imagePreview ? (
                <div
                  className="border-2 border-dashed border-gray-600 p-12 text-center hover:border-purple-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center space-y-4"
                  >
                    <Camera className="h-16 w-16 text-gray-500" />
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">
                        Upload Fruit Image
                      </h4>
                      <p className="text-gray-400">
                        Drag and drop an image or click to browse
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Supports JPG, PNG, WebP formats
                      </p>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Image Preview */}
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Fruit to analyze"
                      className="w-full max-w-md mx-auto border border-gray-600 object-cover"
                    />
                    <button
                      onClick={resetAnalysis}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Analysis Button */}
                  <div className="flex justify-center">
                    <motion.button
                      onClick={analyzeFruit}
                      disabled={isAnalyzing || !modelHealth?.isHealthy}
                      className="bg-gradient-to-r from-purple-600 to-green-600 text-white font-bold text-lg px-8 py-4 border border-purple-500 hover:from-purple-700 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isAnalyzing ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <Zap className="h-6 w-6" />
                      )}
                      <span>
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Freshness'}
                      </span>
                    </motion.button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </motion.div>

            {/* Error Display */}
            {error && (
              <motion.div
                className="bg-red-600/20 border border-red-500 p-4 text-red-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">Analysis Error:</span>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}

            {/* Analysis Results */}
            <AnimatePresence>
              {analysisResult && (
                <motion.div
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 p-8"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                    <Eye className="h-6 w-6 text-green-400" />
                    <span>Analysis Results</span>
                  </h3>

                  {/* Main Result */}
                  <div className={`bg-gradient-to-r ${getStatusColor(analysisResult.prediction)} p-6 mb-6`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(analysisResult.prediction)}
                        <div>
                          <h4 className="text-2xl font-bold text-white">
                            {analysisResult.prediction}
                          </h4>
                          <p className="text-white/80">
                            Confidence: {(analysisResult.confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-white">
                          {analysisResult.prediction}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-gray-700/50 p-6 border border-gray-600">
                    <h5 className="text-lg font-bold text-white mb-4">AI Recommendations</h5>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-400">Assessment:</span>
                        <p className="text-white font-medium">{analysisResult.recommendation.message}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Recommended Action:</span>
                        <p className="text-white font-medium">{analysisResult.recommendation.action}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Storage Advice:</span>
                        <p className="text-white font-medium">{analysisResult.recommendation.storageAdvice}</p>
                      </div>
                    </div>
                  </div>

                  {/* All Predictions */}
                  {analysisResult.allPredictions && (
                    <div className="mt-6">
                      <h5 className="text-lg font-bold text-white mb-4">Detailed Analysis</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisResult.allPredictions.map((pred, index) => (
                          <div key={index} className="bg-gray-700/30 p-4 border border-gray-600">
                            <div className="flex justify-between items-center">
                              <span className="text-white font-medium">{pred.label}</span>
                              <span className="text-gray-300">{pred.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-600 h-2 mt-2">
                              <div 
                                className="bg-purple-500 h-2" 
                                style={{ width: `${pred.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Model Info */}
            <motion.div
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 p-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Apple className="h-5 w-5 text-green-400" />
                <span>AI Model Info</span>
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Model:</span>
                  <span className="text-white">Fruit Classifier</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Input Size:</span>
                  <span className="text-white">224×224</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Classes:</span>
                  <span className="text-white">Healthy, Rotten</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Framework:</span>
                  <span className="text-white">TensorFlow.js</span>
                </div>
              </div>
            </motion.div>

            {/* Analysis History */}
            <motion.div
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 p-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span>Recent Analysis</span>
              </h4>
              
              {analysisHistory.length === 0 ? (
                <p className="text-gray-400 text-sm">No analysis history yet</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {analysisHistory.map((entry) => (
                    <div key={entry.id} className="bg-gray-700/30 p-3 border border-gray-600">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r ${getStatusColor(entry.prediction)}`}>
                          {entry.prediction}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 truncate">{entry.imageName}</p>
                      <p className="text-xs text-gray-400">
                        {(entry.confidence * 100).toFixed(1)}% confidence
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Tips */}
            <motion.div
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 p-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
                <span>Tips for Better Results</span>
              </h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div>• Use well-lit, clear images</div>
                <div>• Focus on the fruit (minimal background)</div>
                <div>• Ensure fruit fills most of the frame</div>
                <div>• Avoid blurry or low-quality images</div>
                <div>• Multiple angles can provide better insights</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* AI Chat Assistant */}
        <AIChatAssistant inventoryContext={{ 
          fruitAnalysis: analysisResult,
          modelHealth,
          analysisHistory: analysisHistory.slice(0, 3)
        }} />
      </div>
    </div>
  );
};

export default FruitFreshnessPage;