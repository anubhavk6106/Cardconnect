import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BuyerDashboard from './pages/BuyerDashboard'
import CardOwnerDashboard from './pages/CardOwnerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProductBrowse from './pages/ProductBrowseEnhanced'
import BrowseProducts from './pages/BrowseProducts'
import TransactionHistory from './pages/TransactionHistory'
import ProfileSettings from './pages/ProfileSettings'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/buyer/dashboard" element={
                <PrivateRoute role="buyer">
                  <BuyerDashboard />
                </PrivateRoute>
              } />
              
              <Route path="/browse-cards" element={
                <PrivateRoute role="buyer">
                  <ProductBrowse />
                </PrivateRoute>
              } />
              
              <Route path="/browse-products" element={
                <PrivateRoute role="buyer">
                  <BrowseProducts />
                </PrivateRoute>
              } />
              
              <Route path="/card-owner/dashboard" element={
                <PrivateRoute role="card_owner">
                  <CardOwnerDashboard />
                </PrivateRoute>
              } />
              
              <Route path="/admin/dashboard" element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              } />
              
              <Route path="/transactions" element={
                <PrivateRoute>
                  <TransactionHistory />
                </PrivateRoute>
              } />
              
              <Route path="/profile" element={
                <PrivateRoute>
                  <ProfileSettings />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
