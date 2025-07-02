import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, 
  ArrowLeft, 
  Search, 
  Filter,
  Calendar,
  User,
  ExternalLink,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Globe,
  Star,
  Eye,
  Bookmark,
  Share
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import newsService from '../services/newsService';
import AIChatAssistant from '../components/AIChatAssistant';

const NewsPage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('publishedAt');
  
  // News sources state
  const [activeTab, setActiveTab] = useState('headlines');

  useEffect(() => {
    fetchNews();
  }, [activeTab]);

  useEffect(() => {
    filterAndSortArticles();
  }, [articles, searchQuery, selectedCategory, sortBy]);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let response;
      
      switch (activeTab) {
        case 'headlines':
          response = await newsService.getTopHeadlines('business');
          break;
        case 'technology':
          response = await newsService.getTechnologyNews();
          break;
        case 'inventory':
          response = await newsService.getInventoryNews();
          break;
        default:
          response = await newsService.getTopHeadlines('business');
      }
      
      if (response.success) {
        const formattedArticles = response.data
          .filter(article => article.title && article.title !== '[Removed]')
          .map(article => newsService.formatArticle(article));
        setArticles(formattedArticles);
      } else {
        throw new Error(response.error || 'Failed to fetch news');
      }
    } catch (err) {
      setError(err.message);
      // Use fallback data
      const fallbackData = newsService.getFallbackNews();
      setArticles(fallbackData.data);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortArticles = () => {
    let filtered = [...articles];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) ||
        (article.description && article.description.toLowerCase().includes(query)) ||
        article.source.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'publishedAt':
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'source':
          return a.source.localeCompare(b.source);
        default:
          return new Date(b.publishedAt) - new Date(a.publishedAt);
      }
    });

    setFilteredArticles(filtered);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'inventory': return 'from-green-500 to-green-700';
      case 'technology': return 'from-blue-500 to-blue-700';
      case 'business': return 'from-purple-500 to-purple-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'inventory': return <TrendingUp className="h-4 w-4" />;
      case 'technology': return <Globe className="h-4 w-4" />;
      case 'business': return <Star className="h-4 w-4" />;
      default: return <Newspaper className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleArticleClick = (url) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading && articles.length === 0) {
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
            <Newspaper className="h-16 w-16 text-indigo-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading News</h2>
          <p className="text-gray-400">Fetching the latest headlines...</p>
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
              onClick={fetchNews}
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
              BUSINESS
            </motion.span>
            <motion.span
              className="block text-indigo-400 -mt-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              NEWS
            </motion.span>
          </h1>
          
          <motion.p 
            className="text-xl font-medium text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Stay updated with the latest business and technology news
          </motion.p>
        </motion.div>

        {/* News Category Tabs */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex flex-wrap gap-4 mb-6">
            {[
              { id: 'headlines', label: 'Top Headlines', icon: Star },
              { id: 'technology', label: 'Technology', icon: Globe },
              { id: 'inventory', label: 'Supply Chain', icon: TrendingUp }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white'
                } border-2`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 p-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white px-4 py-3 focus:border-indigo-400 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="inventory">Inventory</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="general">General</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white px-4 py-3 focus:border-indigo-400 focus:outline-none"
              >
                <option value="publishedAt">Latest</option>
                <option value="title">Title</option>
                <option value="source">Source</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-8 p-4 bg-yellow-600/20 border border-yellow-500 text-yellow-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">API Limit Reached:</span>
              <span>Showing sample news data. {error}</span>
            </div>
          </motion.div>
        )}

        {/* Articles Grid */}
        <AnimatePresence>
          {filteredArticles.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Newspaper className="h-24 w-24 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                {searchQuery ? 'No matching articles found' : 'No articles available'}
              </h3>
              <p className="text-gray-400">
                {searchQuery ? 'Try adjusting your search or filters' : 'Please try refreshing or check back later'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 hover:border-indigo-400 transition-all duration-300 group cursor-pointer overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => handleArticleClick(article.url)}
                >
                  {/* Article Image */}
                  {article.urlToImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Category Badge */}
                      <div className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(article.category)} flex items-center space-x-1`}>
                        {getCategoryIcon(article.category)}
                        <span className="capitalize">{article.category}</span>
                      </div>
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="p-6">
                    <h2 className="font-bold text-lg text-white mb-3 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                      {article.title}
                    </h2>
                    
                    {article.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {article.description}
                      </p>
                    )}
                    
                    {/* Article Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        {article.author && (
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span className="truncate max-w-20">{article.author}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Globe className="h-3 w-3" />
                          <span>{article.source}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(article.publishedAt)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          className="text-gray-400 hover:text-indigo-400 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add bookmark functionality
                          }}
                        >
                          <Bookmark className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          className="text-gray-400 hover:text-indigo-400 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add share functionality
                          }}
                        >
                          <Share className="h-4 w-4" />
                        </motion.button>
                      </div>
                      
                      {article.url !== '#' && (
                        <div className="flex items-center space-x-1 text-indigo-400 font-semibold">
                          <span className="text-xs">Read More</span>
                          <ExternalLink className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Loading More */}
        {isLoading && articles.length > 0 && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400 mx-auto mb-4" />
            <p className="text-gray-400">Loading more articles...</p>
          </motion.div>
        )}

        {/* Summary Stats */}
        <motion.div
          className="mt-12 bg-gray-800/30 backdrop-blur-sm border border-gray-600 p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">News Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-black text-indigo-400">{filteredArticles.length}</div>
              <div className="text-gray-400 font-medium">Articles Shown</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-green-400">
                {new Set(filteredArticles.map(a => a.source)).size}
              </div>
              <div className="text-gray-400 font-medium">News Sources</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-400">
                {new Set(filteredArticles.map(a => a.category)).size}
              </div>
              <div className="text-gray-400 font-medium">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-purple-400">
                {filteredArticles.filter(a => 
                  (new Date() - a.publishedAt) < 24 * 60 * 60 * 1000
                ).length}
              </div>
              <div className="text-gray-400 font-medium">Today's News</div>
            </div>
          </div>
        </motion.div>

        {/* AI Chat Assistant */}
        <AIChatAssistant inventoryContext={{ 
          newsData: filteredArticles.slice(0, 5),
          activeCategory: activeTab,
          searchQuery 
        }} />
      </div>
    </div>
  );
};

export default NewsPage;