import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles,
  Shield,
  Zap,
  Star,
  Package2,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, signup, resetPassword, authError, clearError } = useAuth();
  
  // Form state
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  
  // Validation state
  const [formErrors, setFormErrors] = useState({});
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  // Refs for auto-focus
  const emailRef = useRef();
  const passwordRef = useRef();
  
  // Floating elements for background
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    clearError();
    setFormErrors({});
  }, [isLogin, clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Sign up specific validations
    if (!isLogin) {
      if (!formData.firstName) {
        errors.firstName = 'First name is required';
      }
      
      if (!formData.lastName) {
        errors.lastName = 'Last name is required';
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        const displayName = `${formData.firstName} ${formData.lastName}`;
        await signup(formData.email, formData.password, displayName);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!resetEmail) {
      setFormErrors({ resetEmail: 'Email is required' });
      return;
    }
    
    try {
      setIsLoading(true);
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:border-white/40 focus:outline-none transition-all duration-300 font-medium";

  // Background floating elements
  const FloatingElement = ({ delay = 0, duration = 10, size = 'w-64 h-64' }) => (
    <motion.div
      className={`absolute ${size} bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-xl`}
      animate={{
        x: [0, 100, 0],
        y: [0, -100, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    />
  );

  if (showResetForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 relative overflow-hidden flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <FloatingElement delay={0} duration={15} size="w-96 h-96" />
          <FloatingElement delay={2} duration={12} size="w-64 h-64" />
          <FloatingElement delay={4} duration={18} size="w-80 h-80" />
        </div>

        <motion.div
          className="relative z-10 w-full max-w-md mx-auto px-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Mail className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-black text-white mb-2">Reset Password</h2>
              <p className="text-white/80">Enter your email to reset your password</p>
            </div>

            {resetSent ? (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Email Sent!</h3>
                <p className="text-white/80 mb-6">
                  Check your email for password reset instructions.
                </p>
                <button
                  onClick={() => {
                    setShowResetForm(false);
                    setResetSent(false);
                    setResetEmail('');
                  }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Back to Login
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-white/60" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={inputClasses}
                    required
                  />
                  {formErrors.resetEmail && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.resetEmail}</p>
                  )}
                </div>

                {authError && (
                  <motion.div
                    className="bg-red-500/20 border border-red-500/50 p-4 text-red-200 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <AlertCircle className="h-4 w-4 inline mr-2" />
                    {authError}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span>Send Reset Email</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={() => setShowResetForm(false)}
                  className="w-full text-white/80 hover:text-white transition-colors"
                >
                  ← Back to Login
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <FloatingElement delay={0} duration={15} size="w-96 h-96" />
        <FloatingElement delay={2} duration={12} size="w-64 h-64" />
        <FloatingElement delay={4} duration={18} size="w-80 h-80" />
        <FloatingElement delay={6} duration={20} size="w-72 h-72" />
      </div>

      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-30" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <motion.div 
          className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12"
          style={{
            x: mousePosition.x * 0.5,
            y: mousePosition.y * 0.5,
          }}
        >
          <div className="max-w-lg">
            <motion.div
              className="flex items-center space-x-4 mb-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 shadow-lg shadow-indigo-500/25">
                <Package2 className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-black text-white">SMART STOCK</h1>
            </motion.div>

            <motion.h2 
              className="text-5xl font-black text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Welcome to the Future of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Inventory Management
              </span>
            </motion.h2>

            <motion.p 
              className="text-xl text-white/80 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Experience next-generation inventory control with AI-powered insights, 
              real-time analytics, and seamless automation.
            </motion.p>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { icon: Shield, text: 'Enterprise-grade security' },
                { icon: Zap, text: 'Lightning-fast performance' },
                { icon: Star, text: 'AI-powered predictions' }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center space-x-3 text-white/90"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <feature.icon className="h-6 w-6 text-indigo-400" />
                  <span className="font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Back to Landing Button */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
            </motion.div>

            {/* Auth Form Card */}
            <motion.div
              className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 shadow-2xl relative overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Sparkles Animation */}
              <motion.div
                className="absolute top-4 right-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-indigo-400" />
              </motion.div>

              {/* Form Header */}
              <div className="text-center mb-8">
                <motion.h2 
                  className="text-3xl font-black text-white mb-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </motion.h2>
                <motion.p 
                  className="text-white/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {isLogin ? 'Sign in to your account' : 'Join the Smart Stock community'}
                </motion.p>
              </div>

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      className="grid grid-cols-2 gap-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative">
                        <User className="absolute left-4 top-4 h-5 w-5 text-white/60" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="First Name"
                          className={inputClasses}
                          required={!isLogin}
                        />
                        {formErrors.firstName && (
                          <p className="text-red-400 text-sm mt-1">{formErrors.firstName}</p>
                        )}
                      </div>
                      <div className="relative">
                        <User className="absolute left-4 top-4 h-5 w-5 text-white/60" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Last Name"
                          className={inputClasses}
                          required={!isLogin}
                        />
                        {formErrors.lastName && (
                          <p className="text-red-400 text-sm mt-1">{formErrors.lastName}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-white/60" />
                  <input
                    ref={emailRef}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    className={inputClasses}
                    required
                  />
                  {formErrors.email && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-white/60" />
                  <input
                    ref={passwordRef}
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className={inputClasses}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {formErrors.password && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.password}</p>
                  )}
                </div>

                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      className="relative"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-white/60" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm Password"
                        className={inputClasses}
                        required={!isLogin}
                      />
                      {formErrors.confirmPassword && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.confirmPassword}</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Forgot Password Link */}
                {isLogin && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowResetForm(true)}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}

                {/* Auth Error */}
                {authError && (
                  <motion.div
                    className="bg-red-500/20 border border-red-500/50 p-4 text-red-200 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="h-4 w-4 inline mr-2" />
                    {authError}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>

                {/* Toggle Auth Mode */}
                <div className="text-center pt-4 border-t border-white/20">
                  <p className="text-white/80 mb-2">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                  </p>
                  <motion.button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setFormData({
                        email: '',
                        password: '',
                        confirmPassword: '',
                        firstName: '',
                        lastName: ''
                      });
                      setFormErrors({});
                      clearError();
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLogin ? 'Create Account' : 'Sign In'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;