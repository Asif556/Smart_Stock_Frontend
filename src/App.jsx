import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AddItemPage from './pages/AddItemPage';
import DashboardPage from './pages/DashboardPage';
import ItemsPage from './pages/ItemsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import RetrieveItemsPage from './pages/RetrieveItemsPage';
import NewsPage from './pages/NewsPage';
import FinancialReportsPage from './pages/FinancialReportsPage';
import FruitFreshnessPage from './pages/FruitFreshnessPage';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/add-item" element={
            <ProtectedRoute>
              <Layout>
                <AddItemPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/items" element={
            <ProtectedRoute>
              <Layout>
                <ItemsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Layout>
                <AnalyticsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/retrieve" element={
            <ProtectedRoute>
              <Layout>
                <RetrieveItemsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/news" element={
            <ProtectedRoute>
              <Layout>
                <NewsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/financial" element={
            <ProtectedRoute>
              <Layout>
                <FinancialReportsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/fruit-freshness" element={
            <ProtectedRoute>
              <Layout>
                <FruitFreshnessPage />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
