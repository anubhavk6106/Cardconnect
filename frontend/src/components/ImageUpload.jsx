import { useState } from 'react';
import api from '../api/axios';
import './ImageUpload.css';

const ImageUpload = ({ type = 'profile', onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      setSuccess('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // Get token from localStorage
      const userInfo = localStorage.getItem('userInfo');
      const token = userInfo ? JSON.parse(userInfo).token : null;

      if (!token) {
        setError('Please login to upload images');
        setUploading(false);
        return;
      }

      const endpoint = type === 'profile' ? '/api/upload/profile' : '/api/upload/card';
      const { data } = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setSuccess('Image uploaded successfully!');
      setSelectedFile(null);
      setPreview(null);

      if (onUploadSuccess) {
        onUploadSuccess(data.imageUrl);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setError('');
    setSuccess('');
  };

  return (
    <div className="image-upload">
      <div className="upload-container">
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
            <button 
              className="clear-btn" 
              onClick={handleClear}
              disabled={uploading}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <label htmlFor="file-input" className="upload-label">
              <div className="upload-icon">📷</div>
              <p>Click to select image</p>
              <small>Max size: 5MB</small>
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        )}
      </div>

      {selectedFile && !uploading && (
        <button className="upload-btn" onClick={handleUpload}>
          Upload Image
        </button>
      )}

      {uploading && (
        <div className="upload-progress">
          <div className="spinner"></div>
          <p>Uploading...</p>
        </div>
      )}

      {error && <div className="upload-error">{error}</div>}
      {success && <div className="upload-success">{success}</div>}
    </div>
  );
};

export default ImageUpload;
