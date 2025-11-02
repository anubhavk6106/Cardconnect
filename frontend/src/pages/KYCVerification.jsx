import { useState, useEffect } from 'react';
import api from '../api/axios';
import '../styles/KYCVerification.css';

const KYCVerification = () => {
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    idProofType: 'aadhaar',
    idProofNumber: '',
    addressProofType: 'utility_bill'
  });
  const [files, setFiles] = useState({
    idFront: null,
    idBack: null,
    addressProof: null,
    selfie: null
  });
  const [previews, setPreviews] = useState({
    idFront: null,
    idBack: null,
    addressProof: null,
    selfie: null
  });

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      const { data } = await api.get('/api/kyc/my-kyc');
      setKycStatus(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching KYC status:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload only image files');
        return;
      }

      setFiles({
        ...files,
        [fieldName]: file
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews({
          ...previews,
          [fieldName]: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required files
    if (!files.idFront || !files.addressProof || !files.selfie) {
      alert('Please upload all required documents');
      return;
    }

    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('idProofType', formData.idProofType);
      submitData.append('idProofNumber', formData.idProofNumber);
      submitData.append('addressProofType', formData.addressProofType);
      submitData.append('idFront', files.idFront);
      if (files.idBack) {
        submitData.append('idBack', files.idBack);
      }
      submitData.append('addressProof', files.addressProof);
      submitData.append('selfie', files.selfie);

      const { data } = await api.post('/api/kyc/submit', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert(data.message);
      fetchKYCStatus();
      
      // Reset form
      setFormData({
        idProofType: 'aadhaar',
        idProofNumber: '',
        addressProofType: 'utility_bill'
      });
      setFiles({
        idFront: null,
        idBack: null,
        addressProof: null,
        selfie: null
      });
      setPreviews({
        idFront: null,
        idBack: null,
        addressProof: null,
        selfie: null
      });
    } catch (error) {
      console.error('Error submitting KYC:', error);
      alert(error.response?.data?.message || 'Failed to submit KYC');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      none: { text: 'Not Submitted', class: 'status-none' },
      pending: { text: 'Pending Review', class: 'status-pending' },
      under_review: { text: 'Under Review', class: 'status-review' },
      approved: { text: 'Verified ✓', class: 'status-approved' },
      rejected: { text: 'Rejected', class: 'status-rejected' }
    };
    return badges[status] || badges.none;
  };

  if (loading) {
    return (
      <div className="kyc-page">
        <div className="loading">Loading KYC status...</div>
      </div>
    );
  }

  // If KYC is approved
  if (kycStatus && kycStatus.status === 'approved') {
    return (
      <div className="kyc-page">
        <div className="kyc-container">
          <div className="kyc-success">
            <div className="success-icon">✓</div>
            <h2>KYC Verified!</h2>
            <p>Your account has been successfully verified.</p>
            <div className="verification-details">
              <div className="detail-item">
                <strong>Verification Level:</strong>
                <span className="level-badge">{kycStatus.verificationLevel}</span>
              </div>
              <div className="detail-item">
                <strong>Verified On:</strong>
                <span>{new Date(kycStatus.reviewedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If KYC is pending or under review
  if (kycStatus && ['pending', 'under_review'].includes(kycStatus.status)) {
    const badge = getStatusBadge(kycStatus.status);
    return (
      <div className="kyc-page">
        <div className="kyc-container">
          <div className="kyc-pending">
            <div className="pending-icon">⏳</div>
            <h2>KYC Submission {badge.text}</h2>
            <p>Your documents are being reviewed by our team. This usually takes 1-2 business days.</p>
            <div className="submission-info">
              <div className="info-item">
                <strong>Submitted On:</strong>
                <span>{new Date(kycStatus.submittedAt).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <strong>Status:</strong>
                <span className={`status-badge ${badge.class}`}>{badge.text}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If KYC was rejected or not submitted
  return (
    <div className="kyc-page">
      <div className="kyc-container">
        <div className="kyc-header">
          <h1>🔐 KYC Verification</h1>
          <p>Complete your KYC to unlock all features and build trust with other users</p>
          {kycStatus && kycStatus.status === 'rejected' && (
            <div className="rejection-notice">
              <strong>Previous submission was rejected:</strong>
              <p>{kycStatus.rejectionReason}</p>
              <small>Please re-submit with correct documents</small>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="kyc-form">
          {/* ID Proof Section */}
          <div className="form-section">
            <h3>1. Identity Proof</h3>
            <div className="form-group">
              <label>Document Type *</label>
              <select
                name="idProofType"
                value={formData.idProofType}
                onChange={handleInputChange}
                required
              >
                <option value="aadhaar">Aadhaar Card</option>
                <option value="pan">PAN Card</option>
                <option value="passport">Passport</option>
                <option value="driving_license">Driving License</option>
                <option value="voter_id">Voter ID</option>
              </select>
            </div>

            <div className="form-group">
              <label>Document Number *</label>
              <input
                type="text"
                name="idProofNumber"
                value={formData.idProofNumber}
                onChange={handleInputChange}
                placeholder="Enter document number"
                required
              />
            </div>

            <div className="file-upload-group">
              <div className="file-upload">
                <label>Front Side *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'idFront')}
                  required
                />
                {previews.idFront && (
                  <div className="image-preview">
                    <img src={previews.idFront} alt="ID Front" />
                  </div>
                )}
              </div>

              <div className="file-upload">
                <label>Back Side (if applicable)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'idBack')}
                />
                {previews.idBack && (
                  <div className="image-preview">
                    <img src={previews.idBack} alt="ID Back" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address Proof Section */}
          <div className="form-section">
            <h3>2. Address Proof</h3>
            <div className="form-group">
              <label>Document Type *</label>
              <select
                name="addressProofType"
                value={formData.addressProofType}
                onChange={handleInputChange}
                required
              >
                <option value="utility_bill">Utility Bill</option>
                <option value="bank_statement">Bank Statement</option>
                <option value="rental_agreement">Rental Agreement</option>
                <option value="aadhaar">Aadhaar Card</option>
              </select>
            </div>

            <div className="file-upload">
              <label>Upload Document *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'addressProof')}
                required
              />
              {previews.addressProof && (
                <div className="image-preview">
                  <img src={previews.addressProof} alt="Address Proof" />
                </div>
              )}
            </div>
          </div>

          {/* Selfie Section */}
          <div className="form-section">
            <h3>3. Selfie Verification</h3>
            <p className="section-note">Take a clear selfie holding your ID proof</p>
            <div className="file-upload">
              <label>Upload Selfie *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'selfie')}
                required
              />
              {previews.selfie && (
                <div className="image-preview">
                  <img src={previews.selfie} alt="Selfie" />
                </div>
              )}
            </div>
          </div>

          <div className="form-notes">
            <h4>Important Notes:</h4>
            <ul>
              <li>All documents should be clear and readable</li>
              <li>File size should not exceed 5MB per image</li>
              <li>Supported formats: JPG, PNG, JPEG</li>
              <li>Personal information should be visible</li>
              <li>Documents should not be expired</li>
            </ul>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit for Verification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default KYCVerification;
