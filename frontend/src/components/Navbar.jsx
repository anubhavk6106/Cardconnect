import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false); // Close menu on logout
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Function to close the menu, used by links
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img src={logo} alt="CardConnect Logo" className="logo-img" />
        </Link>

        {/* Hamburger */}
        <div
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Menu */}
        <ul className={`nav-menu ${menuOpen ? 'show' : ''}`}>
          {user ? (
            <>
              <li className="nav-item">
                <Link
                  to={
                    user.role === 'buyer'
                      ? '/buyer/dashboard'
                      : user.role === 'card_owner'
                      ? '/card-owner/dashboard'
                      : '/admin/dashboard'
                  }
                  className="nav-link"
                  onClick={closeMenu}
                >
                  <span className="nav-icon">📊</span>
                  <span>Dashboard</span>
                </Link>
              </li>

              {user.role === 'buyer' && (
                <>
                  <li className="nav-item">
                    <Link
                      to="/browse-products"
                      className="nav-link"
                      onClick={closeMenu}
                    >
                      <span className="nav-icon">🛍️</span>
                      <span>Products</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/browse-cards"
                      className="nav-link"
                      onClick={closeMenu}
                    >
                      <span className="nav-icon">💳</span>
                      <span>Cards</span>
                    </Link>
                  </li>
                </>
              )}

              <li className="nav-item">
                <Link
                  to="/transactions"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  <span className="nav-icon">📋</span>
                  <span>Transactions</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/chat" className="nav-link" onClick={closeMenu}>
                  <span className="nav-icon">💬</span>
                  <span>Chat</span>
                </Link>
              </li>

              {(user.role === 'buyer' || user.role === 'card_owner') && (
                <li className="nav-item">
                  <Link
                    to="/kyc/verify"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    <span className="nav-icon">🔐</span>
                    <span>KYC</span>
                  </Link>
                </li>
              )}

              {user.role === 'admin' && (
                <li className="nav-item">
                  <Link
                    to="/admin/kyc"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    <span className="nav-icon">🔐</span>
                    <span>KYC Review</span>
                  </Link>
                </li>
              )}

              <li className="nav-item">
                <NotificationBell />
              </li>

              <li className="nav-item nav-divider"></li>

              <li className="nav-item">
                <Link
                  to="/profile"
                  className="nav-link nav-profile"
                  onClick={closeMenu}
                >
                  <span className="profile-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="profile-name">{user.name || 'User'}</span>
                </Link>
              </li>

              <li className="nav-item">
                <button onClick={handleLogout} className="nav-button nav-logout">
                  <span>Logout</span>
                  <span className="logout-icon">→</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={closeMenu}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-button" onClick={closeMenu}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;