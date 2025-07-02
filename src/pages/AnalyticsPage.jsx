import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  Clock,
  Activity,
  CheckCircle,
  DollarSign,
  PieChart,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  Pie
} from 'recharts';
import inventoryService from '../services/inventoryService';
import AIChatAssistant from '../components/AIChatAssistant';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await inventoryService.getDashboardStats();
      
      if (response.success) {
        setDashboardData(response.data);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      // Use fallback data on error
      const fallback = inventoryService.getFallbackStats();
      setDashboardData(fallback.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Generate analytics data
  const generateAnalyticsData = () => {
    if (!dashboardData) return { trendData: [], categoryData: [], performanceData: [], growthData: [] };

    // Trend data (simulated historical data)
    const trendData = [
      { month: 'Jan', items: Math.max(0, (dashboardData.totalItems || 0) - 150), value: Math.max(0, (dashboardData.totalValue || 0) - 2000) },
      { month: 'Feb', items: Math.max(0, (dashboardData.totalItems || 0) - 120), value: Math.max(0, (dashboardData.totalValue || 0) - 1500) },
      { month: 'Mar', items: Math.max(0, (dashboardData.totalItems || 0) - 90), value: Math.max(0, (dashboardData.totalValue || 0) - 1200) },
      { month: 'Apr', items: Math.max(0, (dashboardData.totalItems || 0) - 60), value: Math.max(0, (dashboardData.totalValue || 0) - 800) },
      { month: 'May', items: Math.max(0, (dashboardData.totalItems || 0) - 30), value: Math.max(0, (dashboardData.totalValue || 0) - 400) },
      { month: 'Jun', items: dashboardData.totalItems || 0, value: dashboardData.totalValue || 0 }
    ];

    // Category data based on freshness status
    const categoryData = Object.entries(dashboardData.freshnessStatusCount || {}).map(([status, count]) => ({
      name: status,
      value: count,
      color: getFreshnessColorHex(status)
    }));

    // Performance data (items vs value)
    const performanceData = (dashboardData.recentItems || []).map((item, index) => ({
      name: item.name.substring(0, 10) + (item.name.length > 10 ? '...' : ''),
      quantity: item.quantity,
      value: item.price * item.quantity,
      price: item.price
    })).slice(0, 8);

    // Growth data (simulated weekly growth)
    const growthData = [
      { week: 'Week 1', growth: 12, efficiency: 85 },
      { week: 'Week 2', growth: 18, efficiency: 88 },
      { week: 'Week 3', growth: 15, efficiency: 92 },
      { week: 'Week 4', growth: 22, efficiency: 95 }
    ];

    return { trendData, categoryData, performanceData, growthData };
  };

  const { trendData, categoryData, performanceData, growthData } = generateAnalyticsData();

  const getFreshnessColorHex = (status) => {
    switch (status.toLowerCase()) {
      case 'fresh': return '#10b981';
      case 'good': return '#f59e0b';
      case 'fair': return '#f97316';
      case 'expired': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-4 border border-gray-600 shadow-2xl">
          <p className="text-white font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-indigo-400">
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const AnimatedCounter = ({ value, prefix = '', suffix = '', decimals = 0 }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      const startValue = displayValue;
      const endValue = value;
      const duration = 2000; // 2 seconds
      const startTime = Date.now();

      const updateValue = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (endValue - startValue) * easeOutCubic;
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(updateValue);
        }
      };

      updateValue();
    }, [value]);

    return (
      <span>
        {prefix}{displayValue.toFixed(decimals)}{suffix}
      </span>
    );
  };

  if (isLoading && !dashboardData) {
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
            <BarChart3 className="h-16 w-16 text-purple-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Analytics</h2>
          <p className="text-gray-400">Fetching real-time analytics data...</p>
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
              onClick={fetchDashboardData}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 border border-purple-500 font-semibold transition-all"
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
              ADVANCED
            </motion.span>
            <motion.span
              className="block text-purple-400 -mt-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              ANALYTICS
            </motion.span>
          </h1>
          
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-xl text-gray-300">Data-driven insights for your inventory management</p>
            <div className="flex items-center space-x-4 text-gray-400">
              <Clock className="h-5 w-5" />
              <span>Last updated: {lastUpdated || 'Loading...'}</span>
              {error && (
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm">Offline Mode</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Error Banner */}
        {error && (
          <motion.div
            className="mb-8 p-4 bg-red-600/20 border border-red-500 text-red-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">Connection Error:</span>
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Inventory Trend Chart */}
          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm p-8 border border-gray-600 shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-purple-400" />
              <span>Inventory Growth Trend</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorItems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="items" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorItems)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Freshness Distribution Pie Chart */}
          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm p-8 border border-gray-600 shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
              <PieChart className="h-6 w-6 text-purple-400" />
              <span>Freshness Distribution</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  dataKey="value"
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Performance Bar Chart */}
          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm p-8 border border-gray-600 shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
              <BarChart3 className="h-6 w-6 text-purple-400" />
              <span>Item Performance</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis yAxisId="left" stroke="#9ca3af" />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="quantity" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Growth Analytics */}
          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm p-8 border border-gray-600 shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
              <Target className="h-6 w-6 text-purple-400" />
              <span>Growth & Efficiency</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={growthData}>
                <RadialBar 
                  dataKey="efficiency" 
                  cornerRadius={10} 
                  fill="#8b5cf6" 
                  label={{ position: 'insideStart', fill: '#fff' }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Analytics Summary Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {[
            {
              title: 'Average Item Value',
              value: dashboardData?.totalItems ? (dashboardData.totalValue / dashboardData.totalItems).toFixed(2) : '0.00',
              prefix: '$',
              icon: DollarSign,
              color: 'from-emerald-500 to-emerald-700',
              trend: '+8.2%'
            },
            {
              title: 'Inventory Turnover',
              value: '24.5',
              suffix: ' days',
              icon: Clock,
              color: 'from-blue-500 to-blue-700',
              trend: '-2.1%'
            },
            {
              title: 'Stock Utilization',
              value: '87',
              suffix: '%',
              icon: Activity,
              color: 'from-purple-500 to-purple-700',
              trend: '+5.4%'
            },
            {
              title: 'Fresh Items Ratio',
              value: dashboardData?.freshnessStatusCount ? 
                Math.round((dashboardData.freshnessStatusCount['Fresh'] || 0) / 
                Object.values(dashboardData.freshnessStatusCount).reduce((a, b) => a + b, 0) * 100) : 0,
              suffix: '%',
              icon: CheckCircle,
              color: 'from-green-500 to-green-700',
              trend: '+3.8%'
            }
          ].map((metric, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${metric.color} p-6 border border-gray-600 shadow-2xl hover:shadow-xl transition-all duration-300 group`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <metric.icon className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                <div className="text-sm font-semibold text-white/80 bg-white/20 px-2 py-1">
                  {metric.trend}
                </div>
              </div>
              <div className="text-2xl font-black text-white mb-2">
                <AnimatedCounter 
                  value={typeof metric.value === 'string' ? parseFloat(metric.value) : metric.value} 
                  prefix={metric.prefix} 
                  suffix={metric.suffix}
                  decimals={metric.prefix === '$' ? 2 : 0}
                />
              </div>
              <div className="text-white/80 font-medium text-sm">{metric.title}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Chat Assistant */}
        <AIChatAssistant inventoryContext={dashboardData} />

        {/* Insights and Recommendations */}
        <motion.div
          className="bg-gray-800/30 backdrop-blur-sm border border-gray-600 p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">AI-Powered Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="bg-green-600/20 border border-green-500/50 p-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <h4 className="font-bold text-white">Optimization Opportunity</h4>
              </div>
              <p className="text-green-100">
                Your fresh item ratio is excellent at 65%. Consider expanding fresh inventory during peak seasons.
              </p>
            </motion.div>
            
            <motion.div
              className="bg-yellow-600/20 border border-yellow-500/50 p-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
                <h4 className="font-bold text-white">Stock Alert</h4>
              </div>
              <p className="text-yellow-100">
                3 items are approaching expiration. Consider promotional pricing to move inventory.
              </p>
            </motion.div>
            
            <motion.div
              className="bg-purple-600/20 border border-purple-500/50 p-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="h-6 w-6 text-purple-400" />
                <h4 className="font-bold text-white">Growth Trend</h4>
              </div>
              <p className="text-purple-100">
                Inventory value increased 15% this month. Strong performance indicates healthy business growth.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;