import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, Calendar, FileText, Hash, Thermometer, ArrowLeft, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import inventoryService from '../services/inventoryService';

const AddItemPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    freshnessStatus: 'fresh',
    date: '',
    description: ''
  });

  const [focusedField, setFocusedField] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('loading');
    setErrorMessage('');
    
    try {
      // Prepare data for API (ensure correct data types)
      const apiData = {
        name: formData.name.trim(),
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        freshnessStatus: formData.freshnessStatus,
        date: formData.date,
        description: formData.description.trim()
      };

      // Validate required fields
      if (!apiData.name || !apiData.quantity || !apiData.price || !apiData.date) {
        throw new Error('Please fill in all required fields');
      }

      if (isNaN(apiData.quantity) || apiData.quantity <= 0) {
        throw new Error('Quantity must be a positive number');
      }

      if (isNaN(apiData.price) || apiData.price <= 0) {
        throw new Error('Price must be a positive number');
      }

      // Submit to local storage
      const response = await inventoryService.addItem(apiData);
      
      setSubmissionStatus('success');
      
      // Reset form after successful submission
      setFormData({
        name: '',
        quantity: '',
        price: '',
        freshnessStatus: 'fresh',
        date: '',
        description: ''
      });
      
      // Show success message for 3 seconds then reset
      setTimeout(() => {
        setSubmissionStatus('idle');
      }, 3000);
      
    } catch (error) {
      setSubmissionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to connect to database. Please ensure your Spring Boot server is running.');
      
      // Reset error after 5 seconds
      setTimeout(() => {
        setSubmissionStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  const inputClasses = `w-full p-4 border-2 border-gray-600 font-semibold text-lg bg-gray-800 text-white focus:bg-gray-700 focus:border-indigo-400 focus:outline-none transition-all duration-300 placeholder-gray-400`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </button>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-none">
            <motion.span 
              className="block"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              ADD NEW
            </motion.span>
            <motion.span 
              className="block text-indigo-400 -mt-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              INVENTORY ITEM
            </motion.span>
          </h1>
          <motion.p 
            className="text-xl font-medium text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Professional inventory management made simple
          </motion.p>
        </motion.div>

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 border border-gray-600 shadow-2xl">
            
            {/* Item Name */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <label className="flex items-center space-x-3 font-bold text-xl mb-4 text-white">
                <Package className="h-6 w-6 text-indigo-400" />
                <span>Item Name</span>
              </label>
              <motion.input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter item name..."
                className={inputClasses}
                required
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.div>

            {/* Quantity and Price Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <label className="flex items-center space-x-3 font-bold text-xl mb-4 text-white">
                  <Hash className="h-6 w-6 text-green-400" />
                  <span>Quantity</span>
                </label>
                <motion.input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('quantity')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="0"
                  className={inputClasses}
                  required
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <label className="flex items-center space-x-3 font-bold text-xl mb-4 text-white">
                  <DollarSign className="h-6 w-6 text-yellow-400" />
                  <span>Price</span>
                </label>
                <motion.input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('price')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="0.00"
                  className={inputClasses}
                  required
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </motion.div>
            </div>

            {/* Freshness Status */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <label className="flex items-center space-x-3 font-bold text-xl mb-4 text-white">
                <Thermometer className="h-6 w-6 text-red-400" />
                <span>Status</span>
              </label>
              <motion.select
                name="freshnessStatus"
                value={formData.freshnessStatus}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('freshness')}
                onBlur={() => setFocusedField(null)}
                className={inputClasses}
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <option value="fresh">🟢 Fresh</option>
                <option value="good">🟡 Good</option>
                <option value="fair">🟠 Fair</option>
                <option value="expired">🔴 Expired</option>
              </motion.select>
            </motion.div>

            {/* Date */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <label className="flex items-center space-x-3 font-bold text-xl mb-4 text-white">
                <Calendar className="h-6 w-6 text-purple-400" />
                <span>Date</span>
              </label>
              <motion.input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('date')}
                onBlur={() => setFocusedField(null)}
                className={inputClasses}
                required
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.div>

            {/* Description */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <label className="flex items-center space-x-3 font-bold text-xl mb-4 text-white">
                <FileText className="h-6 w-6 text-blue-400" />
                <span>Description</span>
              </label>
              <motion.textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                placeholder="Additional details about this item..."
                rows={4}
                className={`${inputClasses} resize-none`}
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={submissionStatus === 'loading'}
              className={`w-full font-bold text-2xl py-6 border-2 transition-all duration-300 shadow-2xl relative overflow-hidden ${
                submissionStatus === 'loading' 
                  ? 'bg-gray-600 border-gray-500 cursor-not-allowed' 
                  : submissionStatus === 'success'
                  ? 'bg-green-600 border-green-500 hover:bg-green-700'
                  : submissionStatus === 'error'
                  ? 'bg-red-600 border-red-500 hover:bg-red-700'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-500 hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/25'
              } text-white`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={submissionStatus === 'idle' ? { scale: 1.02 } : {}}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center space-x-3">
                {submissionStatus === 'loading' && (
                  <Loader2 className="h-6 w-6 animate-spin" />
                )}
                {submissionStatus === 'success' && (
                  <CheckCircle className="h-6 w-6" />
                )}
                {submissionStatus === 'error' && (
                  <AlertCircle className="h-6 w-6" />
                )}
                <span>
                  {submissionStatus === 'loading' && 'ADDING ITEM...'}
                  {submissionStatus === 'success' && 'ITEM ADDED SUCCESSFULLY!'}
                  {submissionStatus === 'error' && 'FAILED TO ADD ITEM'}
                  {submissionStatus === 'idle' && 'ADD TO INVENTORY'}
                </span>
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={submissionStatus === 'idle' ? { x: '100%' } : {}}
                transition={{ duration: 0.8 }}
              />
            </motion.button>

            {/* Error Message */}
            {submissionStatus === 'error' && errorMessage && (
              <motion.div
                className="mt-4 p-4 bg-red-600/20 border border-red-500 text-red-300 text-center font-semibold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {errorMessage}
              </motion.div>
            )}

            {/* Success Message */}
            {submissionStatus === 'success' && (
              <motion.div
                className="mt-4 p-4 bg-green-600/20 border border-green-500 text-green-300 text-center font-semibold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                Item has been successfully added to your inventory!
              </motion.div>
            )}
          </div>
        </motion.form>

        {/* Stats Dashboard */}
        <motion.div 
          className="mt-12 bg-gray-800/30 backdrop-blur-sm border border-gray-600 p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <h3 className="font-bold text-2xl mb-6 text-center text-white">Inventory Overview</h3>
          <div className="grid grid-cols-3 gap-6 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-3xl font-black text-indigo-400">1,847</div>
              <div className="font-medium text-gray-400">Total Items</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-3xl font-black text-green-400">$89,432</div>
              <div className="font-medium text-gray-400">Total Value</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-3xl font-black text-purple-400">94%</div>
              <div className="font-medium text-gray-400">Active Stock</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddItemPage;