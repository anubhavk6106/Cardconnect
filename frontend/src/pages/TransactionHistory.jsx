import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import PaymentModal from '../components/PaymentModal'
import api from '../api/axios'

const TransactionHistory = () => {
  const { user } = useContext(AuthContext)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/api/transactions')
      setTransactions(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setLoading(false)
    }
  }

  const handlePayNow = (transaction) => {
    setSelectedTransaction(transaction)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (updatedTransaction) => {
    setShowPaymentModal(false)
    setSelectedTransaction(null)
    fetchTransactions() // Refresh transactions
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page-container">
      <h1>Transaction History</h1>
      
      <div className="transaction-list full">
        {transactions.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          transactions.map(trans => (
            <div key={trans._id} className="transaction-card">
              <div className="transaction-header">
                <h3>{trans.product.name}</h3>
                <span className={`status status-${trans.status}`}>{trans.status}</span>
              </div>
              <div className="transaction-details">
                <p><strong>Platform:</strong> {trans.product.platform}</p>
                <p><strong>Original Price:</strong> ₹{trans.product.originalPrice}</p>
                <p><strong>Discounted Price:</strong> ₹{trans.product.discountedPrice}</p>
                <p><strong>Discount Amount:</strong> ₹{trans.discountAmount}</p>
                {user.role === 'buyer' && (
                  <p><strong>Card Owner:</strong> {trans.cardOwner?.name}</p>
                )}
                {user.role === 'card_owner' && (
                  <>
                    <p><strong>Buyer:</strong> {trans.buyer?.name}</p>
                    <p><strong>Your Earnings:</strong> ₹{trans.ownerEarnings?.toFixed(2)}</p>
                  </>
                )}
                <p><strong>Requested:</strong> {new Date(trans.requestedAt).toLocaleDateString()}</p>
              </div>
              <div className="transaction-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                {trans.product.url && (
                  <a href={trans.product.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                    View Product
                  </a>
                )}
                {user.role === 'buyer' && trans.status === 'approved' && trans.paymentStatus !== 'paid' && (
                  <button onClick={() => handlePayNow(trans)} className="btn btn-primary btn-sm">
                    💳 Pay Now (₹{trans.serviceFee?.toFixed(2)})
                  </button>
                )}
                {trans.paymentStatus === 'paid' && (
                  <span className="status status-completed">✓ Paid</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showPaymentModal && selectedTransaction && (
        <PaymentModal
          transaction={selectedTransaction}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}

export default TransactionHistory
