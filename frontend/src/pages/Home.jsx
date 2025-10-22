import { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Home = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      const dashboardPath = user.role === 'buyer' ? '/buyer/dashboard' : 
                            user.role === 'card_owner' ? '/card-owner/dashboard' : 
                            '/admin/dashboard'
      navigate(dashboardPath)
    }
  }, [user, navigate])

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to CardConnect</h1>
        <p className="hero-subtitle">
          Access exclusive bank card discounts without owning the card
        </p>
        <p className="hero-description">
          Connect with card owners to unlock amazing discounts on Amazon, Flipkart, Myntra, and more!
        </p>
        <div className="cta-buttons">
          <Link to="/register" className="btn btn-primary">Get Started</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </section>

      <section className="features">
        <h2>How It Works</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>For Buyers</h3>
            <ul>
              <li>Browse products from major e-commerce platforms</li>
              <li>See available bank card discounts</li>
              <li>Request to use a card owner's discount</li>
              <li>Save money on every purchase</li>
            </ul>
            <Link to="/register?role=buyer" className="feature-link">Register as Buyer →</Link>
          </div>

          <div className="feature-card">
            <h3>For Card Owners</h3>
            <ul>
              <li>List your bank cards and available discounts</li>
              <li>Approve or reject buyer requests</li>
              <li>Earn money from sharing your discounts</li>
              <li>Build your reputation and rating</li>
            </ul>
            <Link to="/register?role=card_owner" className="feature-link">Register as Card Owner →</Link>
          </div>

          <div className="feature-card">
            <h3>AI-Powered Matching</h3>
            <ul>
              <li>Smart algorithm matches buyers with card owners</li>
              <li>Personalized product recommendations</li>
              <li>Optimized discount maximization</li>
              <li>Trust and safety ratings</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="platforms">
        <h2>Supported E-Commerce Platforms</h2>
        <div className="platform-logos">
          <div className="platform">Amazon</div>
          <div className="platform">Flipkart</div>
          <div className="platform">Myntra</div>
          <div className="platform">And More...</div>
        </div>
      </section>
    </div>
  )
}

export default Home
