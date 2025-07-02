import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package2, 
  Search, 
  Filter, 
  Grid, 
  List, 
  ArrowLeft,
  SortAsc,
  SortDesc,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  Hash,
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  Download,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import inventoryService from '../services/inventoryService';
import AIChatAssistant from '../components/AIChatAssistant';
import ExportImportControls from '../components/ExportImportControls';

const ItemsPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI State
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [items, searchQuery, statusFilter, sortField, sortOrder]);

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

  const filterAndSortItems = () => {
    let filtered = [...items];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => 
        item.freshnessStatus.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredItems(filtered);
  };

  const handleItemSelect = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.size > 0 && confirm(`Are you sure you want to delete ${selectedItems.size} items?`)) {
      const newItems = items.filter(item => !selectedItems.has(item.id));
      setItems(newItems);
      setSelectedItems(new Set());
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
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
      case 'fair': return <Clock className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package2 className="h-4 w-4" />;
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? 
      <SortAsc className="h-4 w-4 ml-1" /> : 
      <SortDesc className="h-4 w-4 ml-1" />;
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
            <Package2 className="h-16 w-16 text-indigo-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Items</h2>
          <p className="text-gray-400">Fetching your inventory data...</p>
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
              INVENTORY
            </motion.span>
            <motion.span
              className="block text-indigo-400 -mt-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              ITEMS
            </motion.span>
          </h1>
          
          <motion.p 
            className="text-xl font-medium text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Browse, search, and manage your inventory items
          </motion.p>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 p-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white px-4 py-3 focus:border-indigo-400 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="fresh">Fresh</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="expired">Expired</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-700 border border-gray-600">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Selection and Bulk Actions */}
          {selectedItems.size > 0 && (
            <motion.div
              className="mt-4 flex items-center justify-between bg-indigo-600/20 border border-indigo-500/50 p-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-4">
                <span className="text-white font-semibold">
                  {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => setSelectedItems(new Set())}
                  className="text-gray-300 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 border border-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <ExportImportControls 
                  data={filteredItems} 
                  onImport={(importedData) => {
                    // Handle imported data
                    console.log('Imported data:', importedData);
                  }}
                  filename="inventory_items"
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Sort Bar */}
        <motion.div
          className="flex items-center space-x-4 mb-6 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <span className="text-gray-400">Sort by:</span>
          {(['name', 'date', 'price', 'quantity']).map((field) => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={`flex items-center capitalize font-medium transition-colors ${
                sortField === field ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {field}
              <SortIcon field={field} />
            </button>
          ))}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-8 p-4 bg-red-600/20 border border-red-500 text-red-300"
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

        {/* Items Display */}
        <AnimatePresence mode="wait">
          {filteredItems.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Package2 className="h-24 w-24 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                {searchQuery || statusFilter !== 'all' ? 'No matching items found' : 'No items in inventory'}
              </h3>
              <p className="text-gray-400 mb-8">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start by adding items to your inventory'
                }
              </p>
              {(!searchQuery && statusFilter === 'all') && (
                <button
                  onClick={() => navigate('/add-item')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 border border-indigo-500 transition-all"
                >
                  Add Your First Item
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className={`bg-gray-800/50 backdrop-blur-sm border-2 transition-all duration-300 cursor-pointer group ${
                        selectedItems.has(item.id) 
                          ? 'border-indigo-500 ring-2 ring-indigo-500/50' 
                          : 'border-gray-600 hover:border-indigo-400'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => handleItemSelect(item.id)}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors truncate">
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
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2 text-gray-300">
                            <Hash className="h-4 w-4" />
                            <span>{item.quantity}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-300">
                            <DollarSign className="h-4 w-4" />
                            <span>${item.price.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-300 col-span-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="text-center">
                            <div className="text-xl font-bold text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-400">Total Value</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {/* Select All Header */}
                  <div className="bg-gray-700/50 p-4 border border-gray-600 flex items-center">
                    <input
                      type="checkbox"
                      checked={filteredItems.length > 0 && selectedItems.size === filteredItems.length}
                      onChange={handleSelectAll}
                      className="h-5 w-5 text-indigo-600 border-gray-600 bg-gray-700 focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-gray-300 font-semibold">
                      Select All ({filteredItems.length} items)
                    </span>
                  </div>

                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className={`bg-gray-800/50 backdrop-blur-sm border-2 p-6 transition-all duration-300 ${
                        selectedItems.has(item.id) 
                          ? 'border-indigo-500 ring-2 ring-indigo-500/50' 
                          : 'border-gray-600 hover:border-indigo-400'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.03 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={() => handleItemSelect(item.id)}
                            className="h-5 w-5 text-indigo-600 border-gray-600 bg-gray-700 focus:ring-indigo-500"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-bold text-lg text-white truncate">{item.name}</h3>
                              <div className={`px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r ${getFreshnessColor(item.freshnessStatus)} flex items-center space-x-1`}>
                                {getFreshnessIcon(item.freshnessStatus)}
                                <span>{item.freshnessStatus}</span>
                              </div>
                            </div>
                            <p className="text-gray-400 mb-3">{item.description}</p>
                            <div className="flex items-center space-x-6 text-sm text-gray-300">
                              <div className="flex items-center space-x-2">
                                <Hash className="h-4 w-4" />
                                <span>Qty: {item.quantity}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4" />
                                <span>Price: ${item.price.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(item.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-400">Total Value</div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-indigo-400 transition-colors">
                              <Edit className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Stats */}
        <motion.div
          className="mt-12 bg-gray-800/30 backdrop-blur-sm border border-gray-600 p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-black text-indigo-400">{filteredItems.length}</div>
              <div className="text-gray-400 font-medium">Displayed Items</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-green-400">
                {filteredItems.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
              <div className="text-gray-400 font-medium">Total Quantity</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-400">
                ${filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
              </div>
              <div className="text-gray-400 font-medium">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-purple-400">{selectedItems.size}</div>
              <div className="text-gray-400 font-medium">Selected Items</div>
            </div>
          </div>
        </motion.div>

        {/* AI Chat Assistant */}
        <AIChatAssistant inventoryContext={{ items: filteredItems, selectedItems: Array.from(selectedItems) }} />
      </div>
    </div>
  );
};

export default ItemsPage;