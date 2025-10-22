import { useState, useEffect } from 'react'
import axios from 'axios'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, transactionsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/transactions')
      ])
      
      setStats(statsRes.data)
      setUsers(usersRes.data)
      setTransactions(transactionsRes.data.slice(0, 10))
      setLoading(false)
    } catch (error) {
      console.error('Error fetching admin data:', error)
      setLoading(false)
    }
  }

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`/api/admin/users/${userId}`, { isActive: !currentStatus })
      fetchAdminData()
    } catch (error) {
      alert('Failed to update user status')
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="dashboard admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Platform Management & Analytics</p>
      </div>

      {stats && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.users.total}</p>
            <p className="stat-detail">
              {stats.users.buyers} Buyers | {stats.users.cardOwners} Card Owners
            </p>
          </div>
          <div className="stat-card">
            <h3>Total Cards</h3>
            <p className="stat-number">{stats.cards.total}</p>
          </div>
          <div className="stat-card">
            <h3>Transactions</h3>
            <p className="stat-number">{stats.transactions.total}</p>
            <p className="stat-detail">
              {stats.transactions.pending} Pending | {stats.transactions.completed} Completed
            </p>
          </div>
          <div className="stat-card">
            <h3>Platform Revenue</h3>
            <p className="stat-number">₹{stats.revenue.total}</p>
          </div>
        </div>
      )}

      <section className="dashboard-section">
        <h2>All Users</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className="badge">{user.role}</span></td>
                  <td>
                    <span className={`status ${user.isActive ? 'status-approved' : 'status-rejected'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm"
                      onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Recent Transactions</h2>
        <div className="transaction-list">
          {transactions.map(trans => (
            <div key={trans._id} className="transaction-item">
              <div>
                <strong>{trans.product?.name}</strong>
                <p>Buyer: {trans.buyer?.email} | Owner: {trans.cardOwner?.email}</p>
                <p>Amount: ₹{trans.product?.discountedPrice} | Fee: ₹{trans.serviceFee}</p>
              </div>
              <span className={`status status-${trans.status}`}>{trans.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard
