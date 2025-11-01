import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/KYCAdminPanel.css';

const KYCAdminPanel = () => {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    status: 'approved',
    rejectionReason: '',
    verificationLevel: 'verified',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const [submissionsRes, statsRes] = await Promise.all([
        axios.get(`/api/kyc/all${params}`),
        axios.get('/api/kyc/stats')
      ]);

      setSubmissions(submissionsRes.data.data);
      setStats(statsRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching KYC data:', error);
      setLoading(false);
    }
  };

  const viewSubmission = async (id) => {
    try {
      const { data } = await axios.get(`/api/kyc/${id}`);
      setSelectedSubmission(data.data);
      setReviewForm({
        status: 'approved',
        rejectionReason: '',
        verificationLevel: 'verified',
        notes: ''
      });
    } catch (error) {
      console.error('Error fetching submission:', error);
      alert('Failed to load submission');
    }
  };

  const markUnderReview = async (id) => {
    try {
      await axios.put(`/api/kyc/${id}/under-review`);
      alert('Marked as under review');
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();

    if (reviewForm.status === 'rejected' && !reviewForm.rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setReviewing(true);

    try {
      await axios.put(`/api/kyc/${selectedSubmission._id}/review`, reviewForm);
      alert(`KYC ${reviewForm.status} successfully`);
      setSelectedSubmission(null);
      fetchData();
    } catch (error) {
      console.error('Error reviewing KYC:', error);
      alert(error.response?.data?.message || 'Failed to review KYC');
    } finally {
      setReviewing(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pending', class: 'status-pending' },
      under_review: { text: 'Under Review', class: 'status-review' },
      approved: { text: 'Approved', class: 'status-approved' },
      rejected: { text: 'Rejected', class: 'status-rejected' }
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <div className="kyc-admin-page">
        <div className="loading">Loading KYC submissions...</div>
      </div>
    );
  }

  return (
    <div className="kyc-admin-page">
      <div className="kyc-admin-container">
        <div className="admin-header">
          <h1>🔐 KYC Management</h1>
          <p>Review and approve user verification submissions</p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <h3>Total Submissions</h3>
                <p className="stat-number">{stats.total}</p>
              </div>
            </div>

            <div className="stat-card pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>Pending</h3>
                <p className="stat-number">{stats.pending}</p>
              </div>
            </div>

            <div className="stat-card review">
              <div className="stat-icon">👁️</div>
              <div className="stat-info">
                <h3>Under Review</h3>
                <p className="stat-number">{stats.underReview}</p>
              </div>
            </div>

            <div className="stat-card approved">
              <div className="stat-icon">✓</div>
              <div className="stat-info">
                <h3>Approved</h3>
                <p className="stat-number">{stats.approved}</p>
              </div>
            </div>

            <div className="stat-card rejected">
              <div className="stat-icon">✗</div>
              <div className="stat-info">
                <h3>Rejected</h3>
                <p className="stat-number">{stats.rejected}</p>
              </div>
            </div>

            <div className="stat-card verified">
              <div className="stat-icon">🎖️</div>
              <div className="stat-info">
                <h3>Verified Users</h3>
                <p className="stat-number">{stats.verifiedUsers}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="filter-bar">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'under_review' ? 'active' : ''}`}
            onClick={() => setFilter('under_review')}
          >
            Under Review
          </button>
          <button
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button
            className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>

        {/* Submissions Table */}
        <div className="submissions-table">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Submitted On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                    No submissions found
                  </td>
                </tr>
              ) : (
                submissions.map(submission => {
                  const badge = getStatusBadge(submission.status);
                  return (
                    <tr key={submission._id}>
                      <td>
                        <strong>{submission.user?.name}</strong>
                      </td>
                      <td>{submission.user?.email}</td>
                      <td>{new Date(submission.submittedAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${badge.class}`}>{badge.text}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-view"
                          onClick={() => viewSubmission(submission._id)}
                        >
                          View Details
                        </button>
                        {submission.status === 'pending' && (
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => markUnderReview(submission._id)}
                          >
                            Mark Review
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Review Modal */}
        {selectedSubmission && (
          <div className="modal-overlay" onClick={() => setSelectedSubmission(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedSubmission(null)}>
                ×
              </button>

              <h2>KYC Submission Details</h2>

              <div className="submission-details">
                <div className="detail-section">
                  <h3>User Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <strong>Name:</strong>
                      <span>{selectedSubmission.user?.name}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Email:</strong>
                      <span>{selectedSubmission.user?.email}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Phone:</strong>
                      <span>{selectedSubmission.user?.phone}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Role:</strong>
                      <span>{selectedSubmission.user?.role}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Documents</h3>
                  
                  <div className="document-section">
                    <h4>ID Proof ({selectedSubmission.documents.idProof.type})</h4>
                    <p><strong>Number:</strong> {selectedSubmission.documents.idProof.number}</p>
                    <div className="document-images">
                      <div className="doc-image">
                        <p>Front Side</p>
                        <img src={`http://localhost:5000/${selectedSubmission.documents.idProof.frontImage}`} alt="ID Front" />
                      </div>
                      {selectedSubmission.documents.idProof.backImage && (
                        <div className="doc-image">
                          <p>Back Side</p>
                          <img src={`http://localhost:5000/${selectedSubmission.documents.idProof.backImage}`} alt="ID Back" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="document-section">
                    <h4>Address Proof ({selectedSubmission.documents.addressProof.type})</h4>
                    <div className="document-images">
                      <div className="doc-image">
                        <img src={`http://localhost:5000/${selectedSubmission.documents.addressProof.image}`} alt="Address Proof" />
                      </div>
                    </div>
                  </div>

                  <div className="document-section">
                    <h4>Selfie</h4>
                    <div className="document-images">
                      <div className="doc-image">
                        <img src={`http://localhost:5000/${selectedSubmission.documents.selfie}`} alt="Selfie" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Form */}
                {selectedSubmission.status !== 'approved' && selectedSubmission.status !== 'rejected' && (
                  <form onSubmit={handleReview} className="review-form">
                    <h3>Review Decision</h3>

                    <div className="form-group">
                      <label>Decision *</label>
                      <select
                        value={reviewForm.status}
                        onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                        required
                      >
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                      </select>
                    </div>

                    {reviewForm.status === 'approved' && (
                      <div className="form-group">
                        <label>Verification Level *</label>
                        <select
                          value={reviewForm.verificationLevel}
                          onChange={(e) => setReviewForm({ ...reviewForm, verificationLevel: e.target.value })}
                          required
                        >
                          <option value="basic">Basic</option>
                          <option value="verified">Verified</option>
                          <option value="premium">Premium</option>
                        </select>
                      </div>
                    )}

                    {reviewForm.status === 'rejected' && (
                      <div className="form-group">
                        <label>Rejection Reason *</label>
                        <textarea
                          value={reviewForm.rejectionReason}
                          onChange={(e) => setReviewForm({ ...reviewForm, rejectionReason: e.target.value })}
                          placeholder="Explain why the KYC is being rejected..."
                          required
                          rows="4"
                        />
                      </div>
                    )}

                    <div className="form-group">
                      <label>Internal Notes (Optional)</label>
                      <textarea
                        value={reviewForm.notes}
                        onChange={(e) => setReviewForm({ ...reviewForm, notes: e.target.value })}
                        placeholder="Add any internal notes..."
                        rows="3"
                      />
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setSelectedSubmission(null)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`btn ${reviewForm.status === 'approved' ? 'btn-success' : 'btn-danger'}`}
                        disabled={reviewing}
                      >
                        {reviewing ? 'Submitting...' : `${reviewForm.status === 'approved' ? 'Approve' : 'Reject'} KYC`}
                      </button>
                    </div>
                  </form>
                )}

                {/* If already reviewed */}
                {(selectedSubmission.status === 'approved' || selectedSubmission.status === 'rejected') && (
                  <div className="review-info">
                    <h3>Review Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <strong>Status:</strong>
                        <span className={`badge ${getStatusBadge(selectedSubmission.status).class}`}>
                          {getStatusBadge(selectedSubmission.status).text}
                        </span>
                      </div>
                      <div className="detail-item">
                        <strong>Reviewed On:</strong>
                        <span>{new Date(selectedSubmission.reviewedAt).toLocaleString()}</span>
                      </div>
                      {selectedSubmission.verificationLevel && (
                        <div className="detail-item">
                          <strong>Level:</strong>
                          <span>{selectedSubmission.verificationLevel}</span>
                        </div>
                      )}
                      {selectedSubmission.rejectionReason && (
                        <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                          <strong>Rejection Reason:</strong>
                          <span>{selectedSubmission.rejectionReason}</span>
                        </div>
                      )}
                      {selectedSubmission.notes && (
                        <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                          <strong>Notes:</strong>
                          <span>{selectedSubmission.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KYCAdminPanel;
