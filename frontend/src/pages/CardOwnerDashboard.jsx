import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import ImageUpload from '../components/ImageUpload'
import api from '../api/axios'

const CardOwnerDashboard = () => {
  const { user } = useContext(AuthContext)
  const [myCards, setMyCards] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddCard, setShowAddCard] = useState(false)
  const [newCard, setNewCard] = useState({
    bankName: '',
    cardType: 'credit',
    cardNetwork: 'Visa',
    lastFourDigits: '',
    expiryDate: '',
    usageLimit: 5,
    cardImage: '',
    availableDiscounts: [{
      platform: 'Amazon',
      discountPercentage: '',
      maxDiscount: '',
      minPurchase: 0,
      validUntil: ''
    }]
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [cardsRes, transactionsRes] = await Promise.all([
        api.get('/api/cards/myCards'),
        api.get('/api/transactions')
      ])
      
      setMyCards(cardsRes.data)
      setTransactions(transactionsRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  const handleAddCard = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/cards', newCard)
      alert('Card added successfully!')
      setShowAddCard(false)
      setNewCard({
        bankName: '',
        cardType: 'credit',
        cardNetwork: 'Visa',
        lastFourDigits: '',
        expiryDate: '',
        usageLimit: 5,
        cardImage: '',
        availableDiscounts: [{
          platform: 'Amazon',
          discountPercentage: '',
          maxDiscount: '',
          minPurchase: 0,
          validUntil: ''
        }]
      })
      fetchDashboardData()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add card')
    }
  }

  const handleRespondToTransaction = async (transactionId, status) => {
    try {
      await api.put(`/api/transactions/${transactionId}/respond`, { status })
      alert(`Transaction ${status}!`)
      fetchDashboardData()
    } catch (error) {
      alert(error.response?.data?.message || 'Action failed')
    }
  }

  const pendingTransactions = transactions.filter(t => t.status === 'pending')
  const totalEarnings = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.ownerEarnings, 0)

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Card Owner Dashboard</h1>
        <p>Welcome back, {user.name}!</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>My Cards</h3>
          <p className="stat-number">{myCards.length}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Requests</h3>
          <p className="stat-number">{pendingTransactions.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Earnings</h3>
          <p className="stat-number">₹{totalEarnings.toFixed(2)}</p>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>My Cards</h2>
          <button className="btn btn-primary" onClick={() => setShowAddCard(true)}>
            + Add Card
          </button>
        </div>

        <div className="card-grid">
          {myCards.map(card => (
            <div key={card._id} className="card-item">
              {card.cardImage && (
                <div className="card-image">
                  <img 
                    src={card.cardImage.startsWith('http') ? card.cardImage : `${import.meta.env.VITE_API_URL}${card.cardImage}`} 
                    alt={card.bankName}
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                  />
                </div>
              )}
              <div className="card-header">
                <h3>{card.bankName}</h3>
                <span className={`status ${card.isAvailable ? 'status-approved' : 'status-rejected'}`}>
                  {card.isAvailable ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p>{card.cardType} - {card.cardNetwork} •••• {card.lastFourDigits}</p>
              <p>Expiry: {card.expiryDate}</p>
              <p>Usage: {card.currentUsage}/{card.usageLimit}</p>
              <p>Rating: ★ {card.rating}/5 ({card.totalTransactions} transactions)</p>
              <div className="discounts">
                {card.availableDiscounts?.map((discount, idx) => (
                  <div key={idx} className="discount-item">
                    {discount.platform}: {discount.discountPercentage}%
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Pending Transaction Requests</h2>
        <div className="transaction-list">
          {pendingTransactions.length === 0 ? (
            <p>No pending requests</p>
          ) : (
            pendingTransactions.map(trans => (
              <div key={trans._id} className="transaction-item">
                <div>
                  <strong>{trans.product.name}</strong>
                  <p>Buyer: {trans.buyer?.name}</p>
                  <p>{trans.product.platform} - ₹{trans.product.originalPrice}</p>
                  <p>Your Earnings: ₹{trans.ownerEarnings.toFixed(2)}</p>
                </div>
                <div className="transaction-actions">
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => handleRespondToTransaction(trans._id, 'approved')}
                  >
                    Approve
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRespondToTransaction(trans._id, 'rejected')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {showAddCard && (
        <div className="modal-overlay" onClick={() => setShowAddCard(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Card</h2>
            <form onSubmit={handleAddCard}>
              <div className="form-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  value={newCard.bankName}
                  onChange={(e) => setNewCard({...newCard, bankName: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Card Type</label>
                  <select
                    value={newCard.cardType}
                    onChange={(e) => setNewCard({...newCard, cardType: e.target.value})}
                  >
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Card Network</label>
                  <select
                    value={newCard.cardNetwork}
                    onChange={(e) => setNewCard({...newCard, cardNetwork: e.target.value})}
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="RuPay">RuPay</option>
                    <option value="American Express">American Express</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Last 4 Digits</label>
                <input
                  type="text"
                  maxLength="4"
                  value={newCard.lastFourDigits}
                  onChange={(e) => setNewCard({...newCard, lastFourDigits: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Expiry Date (MM/YY)</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={newCard.expiryDate}
                  onChange={(e) => setNewCard({...newCard, expiryDate: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Card Image (Optional)</label>
                <ImageUpload 
                  type="card" 
                  onUploadSuccess={(imageUrl) => setNewCard({...newCard, cardImage: imageUrl})} 
                />
                {newCard.cardImage && (
                  <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <small style={{ color: 'green' }}>✓ Image uploaded</small>
                  </div>
                )}
              </div>

              <h3 style={{ marginTop: '20px' }}>Discount Details</h3>
              <div className="form-group">
                <label>Platform</label>
                <select
                  value={newCard.availableDiscounts[0].platform}
                  onChange={(e) => setNewCard({
                    ...newCard,
                    availableDiscounts: [{...newCard.availableDiscounts[0], platform: e.target.value}]
                  })}
                >
                  <option>Amazon</option>
                  <option>Flipkart</option>
                  <option>Myntra</option>
                  <option>Swiggy</option>
                  <option>Zomato</option>
                  <option>BookMyShow</option>
                  <option>MakeMyTrip</option>
                  <option>Nykaa</option>
                  <option>BigBasket</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Discount %</label>
                  <input
                    type="number"
                    value={newCard.availableDiscounts[0].discountPercentage}
                    onChange={(e) => setNewCard({
                      ...newCard,
                      availableDiscounts: [{...newCard.availableDiscounts[0], discountPercentage: e.target.value}]
                    })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Max Discount (₹)</label>
                  <input
                    type="number"
                    value={newCard.availableDiscounts[0].maxDiscount}
                    onChange={(e) => setNewCard({
                      ...newCard,
                      availableDiscounts: [{...newCard.availableDiscounts[0], maxDiscount: e.target.value}]
                    })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Min Purchase (₹)</label>
                <input
                  type="number"
                  value={newCard.availableDiscounts[0].minPurchase}
                  onChange={(e) => setNewCard({
                    ...newCard,
                    availableDiscounts: [{...newCard.availableDiscounts[0], minPurchase: e.target.value}]
                  })}
                />
              </div>
              <div className="form-group">
                <label>Valid Until</label>
                <input
                  type="date"
                  value={newCard.availableDiscounts[0].validUntil}
                  onChange={(e) => setNewCard({
                    ...newCard,
                    availableDiscounts: [{...newCard.availableDiscounts[0], validUntil: e.target.value}]
                  })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddCard(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CardOwnerDashboard
