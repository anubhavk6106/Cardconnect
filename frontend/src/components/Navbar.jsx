import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import NotificationBell from './NotificationBell'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          CardConnect
        </Link>

        <ul className="nav-menu">
          {user ? (
            <>
              <li className="nav-item">
                <Link 
                  to={user.role === 'buyer' ? '/buyer/dashboard' : 
                      user.role === 'card_owner' ? '/card-owner/dashboard' : 
                      '/admin/dashboard'} 
                  className="nav-link"
                >
                  Dashboard
                </Link>
              </li>
              
              {user.role === 'buyer' && (
                <>
                  <li className="nav-item">
                    <Link to="/browse-products" className="nav-link">Browse Products</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/browse-cards" className="nav-link">Browse Cards</Link>
                  </li>
                </>
              )}
              
              <li className="nav-item">
                <Link to="/transactions" className="nav-link">Transactions</Link>
              </li>
              
              <li className="nav-item">
                <NotificationBell />
              </li>
              
              <li className="nav-item">
                <Link to="/profile" className="nav-link">Profile</Link>
              </li>
              
              <li className="nav-item">
                <span className="nav-username">Hello, {user.name}</span>
              </li>
              
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-button">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-button">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
