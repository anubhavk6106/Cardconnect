import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import VerifiedBadge from '../components/VerifiedBadge';
import axios from 'axios';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profileImage: '',
  });
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        email: user.email || '',
        profileImage: user.profileImage || '',
      });
      fetchKYCStatus();
    }
  }, [user]);

  const fetchKYCStatus = async () => {
    try {
      const { data } = await axios.get('/api/kyc/my-kyc');
      setKycStatus(data.data);
    } catch (error) {
      console.error('Error fetching KYC status:', error);
    }
  };

  const getKYCStatusInfo = () => {
    if (!user?.verification?.status || user.verification.status === 'none') {
      return {
        status: 'Not Verified',
        color: '#718096',
        icon: '⚠️',
        action: 'Verify Now'
      };
    }
    
    const statusMap = {
      pending: { status: 'Pending Review', color: '#d69e2e', icon: '⏳', action: 'View Status' },
      under_review: { status: 'Under Review', color: '#319795', icon: '👁️', action: 'View Status' },
      approved: { status: 'Verified', color: '#38a169', icon: '✓', action: 'View Details' },
      rejected: { status: 'Rejected', color: '#e53e3e', icon: '✗', action: 'Re-submit' }
    };
    
    return statusMap[user.verification.status] || statusMap.pending;
  };

  const handleImageUpload = (imageUrl) => {
    setUserData({ ...userData, profileImage: imageUrl });
    setMessage('Profile picture updated successfully!');
    
    // Update user context
    const updatedUser = { ...user, profileImage: imageUrl };
    login(updatedUser);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { data } = await axios.put('/api/auth/profile', {
        name: userData.name,
      });

      login(data);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-settings">
      <div className="settings-container">
        <h1>Profile Settings</h1>

        <div className="profile-section">
          <h2>Profile Picture</h2>
          <div className="profile-image-section">
            {userData.profileImage && (
              <div className="current-image">
                <img 
                  src={userData.profileImage.startsWith('http') 
                    ? userData.profileImage 
                    : `${import.meta.env.VITE_API_URL}${userData.profileImage}`
                  } 
                  alt="Profile" 
                />
              </div>
            )}
            <ImageUpload type="profile" onUploadSuccess={handleImageUpload} />
          </div>
        </div>

        <div className="profile-section">
          <h2>Personal Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={userData.email}
                disabled
                style={{ background: '#f0f0f0', cursor: 'not-allowed' }}
              />
              <small>Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value={user?.role || ''}
                disabled
                style={{ background: '#f0f0f0', cursor: 'not-allowed', textTransform: 'capitalize' }}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={user?.phone || ''}
                disabled
                style={{ background: '#f0f0f0', cursor: 'not-allowed' }}
              />
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* KYC Verification Section */}
        {(user?.role === 'buyer' || user?.role === 'card_owner') && (
          <div className="profile-section kyc-section">
            <h2>KYC Verification</h2>
            <div className="kyc-status-card">
              <div className="kyc-status-info">
                <div className="kyc-status-header">
                  <span className="kyc-icon" style={{ fontSize: '2.5rem' }}>
                    {getKYCStatusInfo().icon}
                  </span>
                  <div className="kyc-details">
                    <h3>Verification Status</h3>
                    <p 
                      className="kyc-status-text" 
                      style={{ color: getKYCStatusInfo().color, fontWeight: '700', fontSize: '1.2rem' }}
                    >
                      {getKYCStatusInfo().status}
                      {user?.verification?.isVerified && (
                        <VerifiedBadge 
                          isVerified={true} 
                          level={user.verification.level} 
                          size="large" 
                        />
                      )}
                    </p>
                  </div>
                </div>

                {user?.verification?.isVerified ? (
                  <div className="kyc-verified-info">
                    <p className="kyc-success-msg">
                      ✓ Your account is verified. You can now access all platform features.
                    </p>
                    <div className="kyc-details-grid">
                      <div className="kyc-detail-item">
                        <strong>Verification Level:</strong>
                        <span className="verification-level-badge">{user.verification.level}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="kyc-action-section">
                    {!user?.verification?.status || user.verification.status === 'none' ? (
                      <p className="kyc-message">
                        Complete your KYC verification to unlock all features and build trust with other users.
                      </p>
                    ) : user.verification.status === 'pending' || user.verification.status === 'under_review' ? (
                      <p className="kyc-message">
                        Your documents are being reviewed. This usually takes 1-2 business days.
                      </p>
                    ) : user.verification.status === 'rejected' && kycStatus?.rejectionReason ? (
                      <div className="kyc-rejection-info">
                        <p className="kyc-message" style={{ color: '#e53e3e' }}>
                          <strong>Rejection Reason:</strong> {kycStatus.rejectionReason}
                        </p>
                        <p className="kyc-message">Please re-submit your documents with the corrections.</p>
                      </div>
                    ) : null}

                    <button
                      className="btn-kyc"
                      onClick={() => navigate('/kyc/verify')}
                    >
                      {getKYCStatusInfo().action} →
                    </button>
                  </div>
                )}
              </div>

              {!user?.verification?.isVerified && (
                <div className="kyc-benefits">
                  <h4>Benefits of KYC Verification:</h4>
                  <ul>
                    <li>✓ Build trust with other users</li>
                    <li>✓ Access to premium features</li>
                    <li>✓ Higher transaction limits</li>
                    <li>✓ Priority support</li>
                    <li>✓ Display verified badge on your profile</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="profile-section">
          <h2>Account Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <label>Total Transactions</label>
              <span>{user?.stats?.totalTransactions || 0}</span>
            </div>
            {user?.role === 'buyer' && (
              <div className="stat-item">
                <label>Total Savings</label>
                <span>₹{user?.stats?.totalSavings?.toFixed(2) || '0.00'}</span>
              </div>
            )}
            {user?.role === 'card_owner' && (
              <div className="stat-item">
                <label>Total Earnings</label>
                <span>₹{user?.stats?.totalEarnings?.toFixed(2) || '0.00'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
