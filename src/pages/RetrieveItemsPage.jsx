import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  ArrowLeft, 
  Search, 
  Minus, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  RefreshCw,
  ShoppingCart,
  Hash,
  DollarSign,
  Calendar,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import inventoryService from '../services/inventoryService';
import AIChatAssistant from '../components/AIChatAssistant';

const RetrieveItemsPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Retrieve state
  const [selectedItem, setSelectedItem] = useState(null);
  const [retrieveQuantity, setRetrieveQuantity] = useState('');
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [retrieveStatus, setRetrieveStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');
  
  // UI state
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchQuery]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await inventoryService.getItems();
      
      if (response.success) {
        setItems(response.data);
      } else {
        throw new Error('Failed to fetch items');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
      console.error('Error fetching items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    if (!searchQuery) {
      setFilteredItems(items);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setRetrieveQuantity('');
    setRetrieveStatus('idle');
    setStatusMessage('');
  };

  const handleRetrieve = async () => {
    if (!selectedItem || !retrieveQuantity) return;

    const quantity = parseInt(retrieveQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      setRetrieveStatus('error');
      setStatusMessage('Please enter a valid quantity');
      return;
    }

    if (quantity > selectedItem.quantity) {
      setRetrieveStatus('error');
      setStatusMessage(`Insufficient stock. Available: ${selectedItem.quantity}`);
      return;
    }

    try {
      setIsRetrieving(true);
      setRetrieveStatus('loading');
      setStatusMessage('Processing retrieval...');
      
      const response = await inventoryService.retrieveItems(selectedItem.id, quantity);
      
      if (response.success) {
        setRetrieveStatus('success');
        setStatusMessage(response.message);
        
        // Update local state
        const updatedItems = items.map(item => 
          item.id === selectedItem.id 
            ? { ...item, quantity: item.quantity - quantity }
            : item
        );
        setItems(updatedItems);
        
        // Update selected item
        setSelectedItem({
          ...selectedItem,
          quantity: selectedItem.quantity - quantity
        });
        
        setRetrieveQuantity('');
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setRetrieveStatus('idle');
          setStatusMessage('');
        }, 3000);
      }
    } catch (error) {
      setRetrieveStatus('error');
      setStatusMessage(error.message);
      
      setTimeout(() => {
        setRetrieveStatus('idle');
        setStatusMessage('');
      }, 5000);
    } finally {
      setIsRetrieving(false);
    }
  };

  const getFreshnessColor = (status) => {
    switch (status.toLowerCase()) {
      case 'fresh': return 'from-green-500 to-green-700';
      case 'good': return 'from-yellow-500 to-yellow-700';
      case 'fair': return 'from-orange-500 to-orange-700';
      case 'expired': return 'from-red-500 to-red-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getFreshnessIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'fresh': return <CheckCircle className="h-4 w-4" />;
      case 'good': return <Activity className="h-4 w-4" />;
      case 'fair': return <AlertTriangle className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-6"
          >
            <ShoppingCart className="h-16 w-16 text-indigo-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Inventory</h2>
          <p className="text-gray-400">Fetching available items...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
              onClick={fetchItems}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 border border-indigo-500 font-semibold transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </motion.button>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-none">
            <motion.span
              className="block"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              RETRIEVE
            </motion.span>
            <motion.span
              className="block text-orange-400 -mt-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              INVENTORY
            </motion.span>
          </h1>
          
          <motion.p 
            className="text-xl font-medium text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Select items and quantities to retrieve from your inventory
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2">
            {/* Search Bar */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none transition-colors"
                />
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="mb-6 p-4 bg-red-600/20 border border-red-500 text-red-300"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">Error:</span>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}

            {/* Items Grid */}
            <AnimatePresence>
              {filteredItems.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Package className="h-24 w-24 text-gray-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {searchQuery ? 'No matching items found' : 'No items available'}
                  </h3>
                  <p className="text-gray-400">
                    {searchQuery ? 'Try adjusting your search' : 'Add items to your inventory first'}
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className={`bg-gray-800/50 backdrop-blur-sm border-2 transition-all duration-300 cursor-pointer ${
                        selectedItem?.id === item.id 
                          ? 'border-orange-500 ring-2 ring-orange-500/50' 
                          : 'border-gray-600 hover:border-orange-400'
                      } ${item.quantity === 0 ? 'opacity-50' : ''}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => item.quantity > 0 && handleItemSelect(item)}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-bold text-lg text-white truncate">
                            {item.name}
                          </h3>
                          <div className={`px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r ${getFreshnessColor(item.freshnessStatus)} flex items-center space-x-1`}>
                            {getFreshnessIcon(item.freshnessStatus)}
                            <span>{item.freshnessStatus}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {item.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div className="flex items-center space-x-2 text-gray-300">
                            <Hash className="h-4 w-4" />
                            <span>Available: {item.quantity}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-300">
                            <DollarSign className="h-4 w-4" />
                            <span>${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        {item.quantity === 0 && (
                          <div className="text-center py-2 bg-red-600/20 border border-red-500/50 text-red-300 text-sm font-semibold">
                            Out of Stock
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Retrieve Panel */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 p-6 sticky top-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <ShoppingCart className="h-6 w-6 text-orange-400" />
                <span>Retrieve Items</span>
              </h3>

              {!selectedItem ? (
                <div className="text-center py-12">
                  <Minus className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Select an item to retrieve</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Selected Item */}
                  <div className="bg-gray-700/50 p-4 border border-gray-600">
                    <h4 className="font-bold text-white mb-2">{selectedItem.name}</h4>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div className="flex justify-between">
                        <span>Available:</span>
                        <span className="font-semibold">{selectedItem.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-semibold">${selectedItem.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={`font-semibold ${
                          selectedItem.freshnessStatus.toLowerCase() === 'fresh' ? 'text-green-400' :
                          selectedItem.freshnessStatus.toLowerCase() === 'good' ? 'text-yellow-400' :
                          selectedItem.freshnessStatus.toLowerCase() === 'fair' ? 'text-orange-400' :
                          'text-red-400'
                        }`}>
                          {selectedItem.freshnessStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Input */}
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Quantity to Retrieve
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedItem.quantity}
                      value={retrieveQuantity}
                      onChange={(e) => setRetrieveQuantity(e.target.value)}
                      placeholder="Enter quantity"
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none transition-colors"
                    />
                    {retrieveQuantity && (
                      <div className="mt-2 text-sm text-gray-300">
                        <div className="flex justify-between">
                          <span>Total Value:</span>
                          <span className="font-semibold">
                            ${(parseFloat(retrieveQuantity) * selectedItem.price).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remaining:</span>
                          <span className="font-semibold">
                            {selectedItem.quantity - (parseInt(retrieveQuantity) || 0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Retrieve Button */}
                  <motion.button
                    onClick={handleRetrieve}
                    disabled={!retrieveQuantity || isRetrieving || parseInt(retrieveQuantity) > selectedItem.quantity}
                    className={`w-full font-bold text-lg py-4 border-2 transition-all duration-300 ${
                      retrieveStatus === 'loading' 
                        ? 'bg-gray-600 border-gray-500 cursor-not-allowed' 
                        : retrieveStatus === 'success'
                        ? 'bg-green-600 border-green-500 hover:bg-green-700'
                        : retrieveStatus === 'error'
                        ? 'bg-red-600 border-red-500 hover:bg-red-700'
                        : 'bg-orange-600 border-orange-500 hover:bg-orange-700 hover:shadow-orange-500/25'
                    } text-white`}
                    whileHover={retrieveStatus === 'idle' ? { scale: 1.02 } : {}}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      {retrieveStatus === 'loading' && (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      )}
                      {retrieveStatus === 'success' && (
                        <CheckCircle className="h-5 w-5" />
                      )}
                      {retrieveStatus === 'error' && (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                      <span>
                        {retrieveStatus === 'loading' && 'RETRIEVING...'}
                        {retrieveStatus === 'success' && 'RETRIEVED SUCCESSFULLY!'}
                        {retrieveStatus === 'error' && 'RETRIEVAL FAILED'}
                        {retrieveStatus === 'idle' && 'RETRIEVE ITEMS'}
                      </span>
                    </div>
                  </motion.button>

                  {/* Status Message */}
                  {statusMessage && (
                    <motion.div
                      className={`p-4 border text-center font-semibold ${
                        retrieveStatus === 'success' 
                          ? 'bg-green-600/20 border-green-500 text-green-300'
                          : 'bg-red-600/20 border-red-500 text-red-300'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {statusMessage}
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* AI Chat Assistant */}
        <AIChatAssistant inventoryContext={{ 
          availableItems: filteredItems, 
          selectedItem, 
          retrieveQuantity 
        }} />
      </div>
    </div>
  );
};

export default RetrieveItemsPage;