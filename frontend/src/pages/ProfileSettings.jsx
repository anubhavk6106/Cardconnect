import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const { user, login } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profileImage: '',
  });
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
    }
  }, [user]);

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
                    : `http://localhost:5000${userData.profileImage}`
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

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

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
