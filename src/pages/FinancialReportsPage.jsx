import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  ArrowLeft,
  Download,
  Plus,
  Calculator,
  Receipt,
  ShoppingCart,
  PieChart,
  BarChart3,
  RefreshCw,
  Filter,
  Calendar,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import financialService from '../services/financialService';
import exportService from '../services/exportService';
import inventoryService from '../services/inventoryService';
import AIChatAssistant from '../components/AIChatAssistant';

const FinancialReportsPage = () => {
  const navigate = useNavigate();
  
  // Data states
  const [inventory, setInventory] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI states
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [showNewPO, setShowNewPO] = useState(false);
  const [costAnalysis, setCostAnalysis] = useState(null);
  
  // Form states
  const [invoiceForm, setInvoiceForm] = useState({
    customerInfo: { name: '', email: '', address: '' },
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    dueDate: '',
    taxRate: 8.25,
    discountRate: 0
  });
  
  const [poForm, setPOForm] = useState({
    vendorInfo: { name: '', email: '', address: '' },
    items: [{ description: '', quantity: 1, unitCost: 0 }],
    expectedDelivery: '',
    terms: 'Net 30'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch inventory data
      const inventoryResponse = await inventoryService.getItems();
      if (inventoryResponse.success) {
        setInventory(inventoryResponse.data);
        
        // Generate cost analysis
        const analysis = financialService.generateCostAnalysis(inventoryResponse.data);
        setCostAnalysis(analysis);
      }
      
      // Load saved invoices and POs from localStorage
      const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      const savedPOs = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
      
      setInvoices(savedInvoices);
      setPurchaseOrders(savedPOs);
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching financial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInvoice = () => {
    try {
      const invoiceNumber = `INV-${Date.now()}`;
      const dueDate = new Date(invoiceForm.dueDate);
      
      const invoice = financialService.generateInvoice({
        invoiceNumber,
        customerInfo: invoiceForm.customerInfo,
        items: invoiceForm.items,
        dueDate,
        taxRate: invoiceForm.taxRate / 100,
        discountRate: invoiceForm.discountRate
      });
      
      // Save invoice
      const updatedInvoices = [...invoices, { ...invoice, id: invoiceNumber, status: 'Draft' }];
      setInvoices(updatedInvoices);
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
      
      // Reset form
      setInvoiceForm({
        customerInfo: { name: '', email: '', address: '' },
        items: [{ description: '', quantity: 1, unitPrice: 0 }],
        dueDate: '',
        taxRate: 8.25,
        discountRate: 0
      });
      
      setShowNewInvoice(false);
      
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  };

  const generatePurchaseOrder = () => {
    try {
      const poNumber = `PO-${Date.now()}`;
      const expectedDelivery = new Date(poForm.expectedDelivery);
      
      const po = financialService.generatePurchaseOrder({
        poNumber,
        vendorInfo: poForm.vendorInfo,
        items: poForm.items,
        expectedDelivery,
        terms: poForm.terms
      });
      
      // Save PO
      const updatedPOs = [...purchaseOrders, { ...po, id: poNumber, status: 'Pending' }];
      setPurchaseOrders(updatedPOs);
      localStorage.setItem('purchaseOrders', JSON.stringify(updatedPOs));
      
      // Reset form
      setPOForm({
        vendorInfo: { name: '', email: '', address: '' },
        items: [{ description: '', quantity: 1, unitCost: 0 }],
        expectedDelivery: '',
        terms: 'Net 30'
      });
      
      setShowNewPO(false);
      
    } catch (error) {
      console.error('Error generating purchase order:', error);
    }
  };

  const exportFinancialReport = (type) => {
    try {
      let reportData;
      
      switch (type) {
        case 'cost-analysis':
          reportData = {
            summary: {
              'Total Inventory Value': financialService.formatCurrency(costAnalysis?.overall.totalRetailValue || 0),
              'Total Cost Value': financialService.formatCurrency(costAnalysis?.overall.totalCostValue || 0),
              'Profit Potential': financialService.formatCurrency(costAnalysis?.overall.totalProfitPotential || 0),
              'Average Profit Margin': financialService.formatPercentage(costAnalysis?.overall.avgProfitMargin || 0)
            },
            tableData: Object.entries(costAnalysis?.categories || {}).map(([category, data]) => ({
              Category: category,
              'Item Count': data.itemCount,
              'Retail Value': financialService.formatCurrency(data.retailValue),
              'Cost Value': financialService.formatCurrency(data.costValue),
              'Profit Margin': financialService.formatPercentage(data.profitMargin)
            }))
          };
          break;
          
        case 'invoices':
          reportData = {
            summary: {
              'Total Invoices': invoices.length,
              'Total Amount': financialService.formatCurrency(
                invoices.reduce((sum, inv) => sum + (inv.calculations?.total || 0), 0)
              ),
              'Pending Invoices': invoices.filter(inv => inv.status === 'Pending').length
            },
            tableData: invoices.map(inv => ({
              'Invoice Number': inv.invoiceNumber,
              'Customer': inv.customerInfo.name,
              'Amount': financialService.formatCurrency(inv.calculations?.total || 0),
              'Status': inv.status,
              'Date': new Date(inv.issueDate).toLocaleDateString()
            }))
          };
          break;
          
        case 'purchase-orders':
          reportData = {
            summary: {
              'Total Purchase Orders': purchaseOrders.length,
              'Total Amount': financialService.formatCurrency(
                purchaseOrders.reduce((sum, po) => sum + (po.total || 0), 0)
              ),
              'Pending Orders': purchaseOrders.filter(po => po.status === 'Pending').length
            },
            tableData: purchaseOrders.map(po => ({
              'PO Number': po.poNumber,
              'Vendor': po.vendorInfo.name,
              'Amount': financialService.formatCurrency(po.total || 0),
              'Status': po.status,
              'Order Date': new Date(po.orderDate).toLocaleDateString()
            }))
          };
          break;
      }
      
      exportService.exportFinancialReportPDF(reportData, `${type.replace('-', ' ')} Report`);
      
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const addInvoiceItem = () => {
    setInvoiceForm(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeInvoiceItem = (index) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const addPOItem = () => {
    setPOForm(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitCost: 0 }]
    }));
  };

  const removePOItem = (index) => {
    setPOForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
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
            <Calculator className="h-16 w-16 text-green-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Financial Data</h2>
          <p className="text-gray-400">Calculating reports and analytics...</p>
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
            
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={fetchData}
                disabled={isLoading}
                className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 border border-green-500 font-semibold transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </motion.button>
              
              <motion.button
                onClick={() => setShowNewInvoice(true)}
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 border border-blue-500 font-semibold transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="h-5 w-5" />
                <span>New Invoice</span>
              </motion.button>
              
              <motion.button
                onClick={() => setShowNewPO(true)}
                className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 border border-purple-500 font-semibold transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="h-5 w-5" />
                <span>New PO</span>
              </motion.button>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-none">
            <motion.span
              className="block"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              FINANCIAL
            </motion.span>
            <motion.span
              className="block text-green-400 -mt-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              REPORTS
            </motion.span>
          </h1>
          
          <motion.p 
            className="text-xl font-medium text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Comprehensive financial management and reporting tools
          </motion.p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex flex-wrap gap-4">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'invoices', label: 'Invoices', icon: Receipt },
              { id: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
              { id: 'cost-analysis', label: 'Cost Analysis', icon: PieChart },
              { id: 'tax-reports', label: 'Tax Reports', icon: Calculator }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white border-green-500'
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

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && costAnalysis && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Total Inventory Value',
                    value: financialService.formatCurrency(costAnalysis.overall.totalRetailValue),
                    icon: DollarSign,
                    color: 'from-green-500 to-green-700',
                    change: '+12.5%'
                  },
                  {
                    title: 'Profit Potential',
                    value: financialService.formatCurrency(costAnalysis.overall.totalProfitPotential),
                    icon: TrendingUp,
                    color: 'from-blue-500 to-blue-700',
                    change: '+8.3%'
                  },
                  {
                    title: 'Average Margin',
                    value: financialService.formatPercentage(costAnalysis.overall.avgProfitMargin),
                    icon: Target,
                    color: 'from-purple-500 to-purple-700',
                    change: '+2.1%'
                  },
                  {
                    title: 'Total Items',
                    value: costAnalysis.overall.itemCount.toString(),
                    icon: FileText,
                    color: 'from-orange-500 to-orange-700',
                    change: '+15 items'
                  }
                ].map((metric, index) => (
                  <motion.div
                    key={index}
                    className={`bg-gradient-to-br ${metric.color} p-6 border border-gray-600 shadow-2xl hover:shadow-xl transition-all duration-300 group`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <metric.icon className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                      <div className="text-sm font-semibold text-white/80 bg-white/20 px-2 py-1">
                        {metric.change}
                      </div>
                    </div>
                    <div className="text-2xl font-black text-white mb-2">
                      {metric.value}
                    </div>
                    <div className="text-white/80 font-medium">{metric.title}</div>
                  </motion.div>
                ))}
              </div>

              {/* Export Buttons */}
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => exportFinancialReport('cost-analysis')}
                  className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 border border-green-500 font-semibold transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="h-5 w-5" />
                  <span>Export Cost Analysis</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === 'invoices' && (
            <motion.div
              key="invoices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Invoices List */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Generated Invoices</h3>
                  <motion.button
                    onClick={() => exportFinancialReport('invoices')}
                    className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 border border-blue-500 font-semibold transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="h-4 w-4" />
                    <span>Export Report</span>
                  </motion.button>
                </div>
                
                {invoices.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No invoices generated yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoices.map((invoice, index) => (
                      <motion.div
                        key={invoice.id}
                        className="bg-gray-700/50 p-4 border border-gray-600 hover:border-blue-400 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-white">{invoice.invoiceNumber}</h4>
                            <p className="text-gray-300">{invoice.customerInfo.name}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-white">
                              {financialService.formatCurrency(invoice.calculations.total)}
                            </div>
                            <div className="text-sm text-gray-400">
                              {new Date(invoice.issueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'cost-analysis' && costAnalysis && (
            <motion.div
              key="cost-analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Category Analysis */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 p-6">
                <h3 className="text-2xl font-bold text-white mb-6">Category Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(costAnalysis.categories).map(([category, data], index) => (
                    <motion.div
                      key={category}
                      className="bg-gray-700/50 p-4 border border-gray-600"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <h4 className="font-bold text-white mb-3">{category}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Items:</span>
                          <span className="text-white font-semibold">{data.itemCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Value:</span>
                          <span className="text-white font-semibold">
                            {financialService.formatCurrency(data.retailValue)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Margin:</span>
                          <span className={`font-semibold ${
                            parseFloat(data.profitMargin) > 20 ? 'text-green-400' : 
                            parseFloat(data.profitMargin) > 10 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {financialService.formatPercentage(data.profitMargin)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {costAnalysis.recommendations && costAnalysis.recommendations.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 p-6">
                  <h3 className="text-2xl font-bold text-white mb-6">Recommendations</h3>
                  <div className="space-y-4">
                    {costAnalysis.recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        className={`p-4 border-l-4 ${
                          rec.type === 'success' ? 'border-green-500 bg-green-600/20' :
                          rec.type === 'warning' ? 'border-yellow-500 bg-yellow-600/20' :
                          rec.type === 'info' ? 'border-blue-500 bg-blue-600/20' :
                          'border-red-500 bg-red-600/20'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <h4 className="font-bold text-white mb-2">{rec.title}</h4>
                        <p className="text-gray-300 mb-2">{rec.description}</p>
                        <p className="text-sm text-gray-400 italic">{rec.action}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Invoice Modal */}
        <AnimatePresence>
          {showNewInvoice && (
            <motion.div
              className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gray-800 border border-gray-600 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Create Invoice</h3>
                  <button
                    onClick={() => setShowNewInvoice(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Customer Name"
                      value={invoiceForm.customerInfo.name}
                      onChange={(e) => setInvoiceForm(prev => ({
                        ...prev,
                        customerInfo: { ...prev.customerInfo, name: e.target.value }
                      }))}
                      className="p-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Customer Email"
                      value={invoiceForm.customerInfo.email}
                      onChange={(e) => setInvoiceForm(prev => ({
                        ...prev,
                        customerInfo: { ...prev.customerInfo, email: e.target.value }
                      }))}
                      className="p-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  {/* Items */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">Items</h4>
                      <button
                        onClick={addInvoiceItem}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm"
                      >
                        Add Item
                      </button>
                    </div>
                    {invoiceForm.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-4 gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => {
                            const newItems = [...invoiceForm.items];
                            newItems[index].description = e.target.value;
                            setInvoiceForm(prev => ({ ...prev, items: newItems }));
                          }}
                          className="col-span-2 p-2 bg-gray-700 border border-gray-600 text-white text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...invoiceForm.items];
                            newItems[index].quantity = parseInt(e.target.value) || 0;
                            setInvoiceForm(prev => ({ ...prev, items: newItems }));
                          }}
                          className="p-2 bg-gray-700 border border-gray-600 text-white text-sm"
                        />
                        <div className="flex">
                          <input
                            type="number"
                            placeholder="Price"
                            value={item.unitPrice}
                            onChange={(e) => {
                              const newItems = [...invoiceForm.items];
                              newItems[index].unitPrice = parseFloat(e.target.value) || 0;
                              setInvoiceForm(prev => ({ ...prev, items: newItems }));
                            }}
                            className="flex-1 p-2 bg-gray-700 border border-gray-600 text-white text-sm"
                          />
                          {invoiceForm.items.length > 1 && (
                            <button
                              onClick={() => removeInvoiceItem(index)}
                              className="bg-red-600 hover:bg-red-700 text-white px-2 text-sm"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Due Date and Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="date"
                      value={invoiceForm.dueDate}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="p-3 bg-gray-700 border border-gray-600 text-white focus:border-blue-400 focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Tax Rate %"
                      value={invoiceForm.taxRate}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                      className="p-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Discount %"
                      value={invoiceForm.discountRate}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, discountRate: parseFloat(e.target.value) || 0 }))}
                      className="p-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowNewInvoice(false)}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={generateInvoice}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                    >
                      Generate Invoice
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Chat Assistant */}
        <AIChatAssistant inventoryContext={{ 
          financialData: costAnalysis,
          invoices,
          purchaseOrders 
        }} />
      </div>
    </div>
  );
};

export default FinancialReportsPage;