import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Package, TrendingUp, Zap, Shield, BarChart3, Users, Clock } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import AIChatAssistant from '../components/AIChatAssistant';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -200]);
  const heroY = useTransform(scrollY, [0, 1000], [0, -100]);
  const featuresY = useTransform(scrollY, [0, 1000], [0, 50]);

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

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="relative overflow-hidden bg-gray-900">
      <motion.div style={{ y: backgroundY }}>
        <AnimatedBackground />
      </motion.div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-6xl mx-auto"
          style={{ y: heroY }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            style={{
              x: mousePosition.x,
              y: mousePosition.y,
            }}
            className="mb-8"
          >
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
              <motion.span 
                className="block"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                SMART
              </motion.span>
              <motion.span 
                className="block text-indigo-400 -mt-2"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                INVENTORY
              </motion.span>
              <motion.span 
                className="block text-purple-400 -mt-2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                SYSTEM
              </motion.span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Advanced inventory management with real-time analytics, intelligent forecasting, and seamless integration
          </motion.p>
          
          <motion.button
            onClick={handleGetStarted}
            className="group relative overflow-hidden bg-indigo-600 text-white font-bold text-xl sm:text-2xl px-12 sm:px-16 py-6 sm:py-8 border-2 border-indigo-500 hover:bg-indigo-700 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25 inline-flex items-center space-x-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>GET STARTED</span>
            <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8 relative"
        style={{ y: featuresY }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { number: '10K+', label: 'Active Users', icon: Users },
              { number: '99.9%', label: 'Uptime', icon: Clock },
              { number: '500M+', label: 'Items Tracked', icon: Package }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center bg-gray-800/50 backdrop-blur-sm p-8 border border-gray-700 hover:border-indigo-500 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <stat.icon className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
                <div className="text-4xl font-black text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30 relative">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-center mb-16 text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            POWERFUL FEATURES
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Package,
                title: 'Smart Tracking',
                description: 'AI-powered inventory tracking with predictive analytics and automated reordering',
                color: 'from-blue-600 to-blue-800',
                delay: 0
              },
              {
                icon: TrendingUp,
                title: 'Growth Analytics',
                description: 'Advanced reporting and insights to drive business growth and optimization',
                color: 'from-green-600 to-green-800',
                delay: 0.1
              },
              {
                icon: Zap,
                title: 'Real-time Sync',
                description: 'Instant synchronization across all devices and platforms with live updates',
                color: 'from-yellow-600 to-yellow-800',
                delay: 0.2
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Bank-level security with encryption, compliance, and audit trails',
                color: 'from-purple-600 to-purple-800',
                delay: 0.3
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${feature.color} p-8 border border-gray-600 hover:border-gray-400 transition-all duration-300 group cursor-pointer backdrop-blur-sm`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <feature.icon className="h-12 w-12 text-white mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-black text-xl mb-4 text-white">{feature.title}</h3>
                <p className="font-medium text-gray-200 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            READY TO TRANSFORM YOUR BUSINESS?
          </motion.h2>
          <motion.p 
            className="text-xl sm:text-2xl font-medium text-gray-300 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of businesses optimizing their inventory management
          </motion.p>
          <motion.button
            onClick={handleGetStarted}
            className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl sm:text-2xl px-12 sm:px-16 py-6 sm:py-8 border-2 border-indigo-500 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            START YOUR FREE TRIAL
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.8 }}
            />
          </motion.button>
        </div>
      </section>

      {/* AI Chat Assistant */}
      <AIChatAssistant />
    </div>
  );
};

export default LandingPage;