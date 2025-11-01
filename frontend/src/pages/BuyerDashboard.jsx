import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'

const BuyerDashboard = () => {
  const { user } = useContext(AuthContext)
  const [cards, setCards] = useState([])
  const [transactions, setTransactions] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    platform: '',
    bankName: ''
  })
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [productDetails, setProductDetails] = useState({
    name: '',
    platform: 'Amazon',
    url: '',
    originalPrice: ''
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [cardsRes, transactionsRes, recsRes] = await Promise.all([
        axios.get('/api/cards'),
        axios.get('/api/transactions'),
        axios.get('/api/ai/recommendations')
      ])
      
      setCards(cardsRes.data)
      setTransactions(transactionsRes.data.slice(0, 5))
      setRecommendations(recsRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    })
  }

  const filteredCards = cards.filter(card => {
    return (!filter.platform || card.availableDiscounts?.some(d => d.platform === filter.platform)) &&
           (!filter.bankName || card.bankName.toLowerCase().includes(filter.bankName.toLowerCase()))
  })

  const handleRequestTransaction = (card) => {
    setSelectedCard(card)
    setShowTransactionModal(true)
  }

  const handleSubmitTransaction = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/transactions', {
        cardId: selectedCard._id,
        product: {
          ...productDetails,
          originalPrice: parseFloat(productDetails.originalPrice)
        }
      })
      alert('Transaction request sent successfully!')
      setShowTransactionModal(false)
      setProductDetails({ name: '', platform: 'Amazon', url: '', originalPrice: '' })
      fetchDashboardData()
    } catch (error) {
      alert(error.response?.data?.message || 'Transaction request failed')
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Buyer Dashboard</h1>
        <p>Welcome back, {user.name}!</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Available Cards</h3>
          <p className="stat-number">{cards.length}</p>
        </div>
        <div className="stat-card">
          <h3>My Transactions</h3>
          <p className="stat-number">{transactions.length}</p>
        </div>
        <div className="stat-card">
          <h3>AI Recommendations</h3>
          <p className="stat-number">{recommendations.length}</p>
        </div>
      </div>

      <section className="dashboard-section">
        <h2>Browse Available Cards</h2>
        
        <div className="filter-bar">
          <select name="platform" value={filter.platform} onChange={handleFilterChange}>
            <option value="">All Platforms</option>
            <option value="Amazon">Amazon</option>
            <option value="Flipkart">Flipkart</option>
            <option value="Myntra">Myntra</option>
            <option value="Swiggy">Swiggy</option>
            <option value="Zomato">Zomato</option>
            <option value="BookMyShow">BookMyShow</option>
          </select>
          
          <input
            type="text"
            name="bankName"
            placeholder="Search by bank name"
            value={filter.bankName}
            onChange={handleFilterChange}
          />
        </div>

        <div className="card-grid">
          {filteredCards.map(card => (
            <div key={card._id} className="card-item">
              {card.cardImage && (
                <div className="card-image">
                  <img 
                    src={card.cardImage.startsWith('http') ? card.cardImage : `http://localhost:5000${card.cardImage}`} 
                    alt={card.bankName}
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px 8px 0 0', marginBottom: '10px' }}
                  />
                </div>
              )}
              <div className="card-header">
                <h3>{card.bankName}</h3>
                <span className="card-type">{card.cardType}</span>
              </div>
              <p className="card-network">{card.cardNetwork} •••• {card.lastFourDigits}</p>
              <p className="card-expiry">Exp: {card.expiryDate}</p>
              <div className="card-owner">
                <strong>Owner:</strong> {card.owner?.name} 
                <span className="rating">★ {card.rating}/5</span>
              </div>
              <div className="discounts">
                <strong>Available Discounts:</strong>
                {card.availableDiscounts?.map((discount, idx) => (
                  <div key={idx} className="discount-item">
                    {discount.platform}: {discount.discountPercentage}% off (Max: ₹{discount.maxDiscount})
                  </div>
                ))}
              </div>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => handleRequestTransaction(card)}
              >
                Request Transaction
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Recent Transactions</h2>
        <div className="transaction-list">
          {transactions.length === 0 ? (
            <p>No transactions yet</p>
          ) : (
            transactions.map(trans => (
              <div key={trans._id} className="transaction-item">
                <div>
                  <strong>{trans.product.name}</strong>
                  <p>{trans.product.platform} - ₹{trans.product.discountedPrice}</p>
                </div>
                <span className={`status status-${trans.status}`}>{trans.status}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {showTransactionModal && (
        <div className="modal-overlay" onClick={() => setShowTransactionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Request Transaction</h2>
            <form onSubmit={handleSubmitTransaction}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={productDetails.name}
                  onChange={(e) => setProductDetails({...productDetails, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Platform</label>
                <select
                  value={productDetails.platform}
                  onChange={(e) => setProductDetails({...productDetails, platform: e.target.value})}
                >
                  <option>Amazon</option>
                  <option>Flipkart</option>
                  <option>Myntra</option>
                </select>
              </div>
              <div className="form-group">
                <label>Product URL</label>
                <input
                  type="url"
                  value={productDetails.url}
                  onChange={(e) => setProductDetails({...productDetails, url: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Original Price (₹)</label>
                <input
                  type="number"
                  value={productDetails.originalPrice}
                  onChange={(e) => setProductDetails({...productDetails, originalPrice: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTransactionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BuyerDashboard
