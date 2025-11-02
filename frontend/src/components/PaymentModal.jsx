import { useState, useEffect } from 'react';
import api from '../api/axios';
import './PaymentModal.css';

const PaymentModal = ({ transaction, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = import.meta.env.VITE_RAZORPAY_CHECKOUT_URL;
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } else {
      setRazorpayLoaded(true);
    }
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      setError('Payment system is loading, please wait...');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Create order
      const { data } = await api.post('/api/payment/create-order', {
        amount: transaction.serviceFee,
        transactionId: transaction._id,
      });

      // Razorpay options
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'CardConnect',
        description: `Payment for ${transaction.product.name}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyData = await api.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              transactionId: transaction._id,
            });

            if (verifyData.data.success) {
              onSuccess(verifyData.data.transaction);
            }
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: transaction.buyer?.name || '',
          email: transaction.buyer?.email || '',
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      
      razorpayInstance.on('payment.failed', function (response) {
        setError('Payment failed. Please try again.');
        setLoading(false);
      });

      razorpayInstance.open();
      setLoading(false);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Complete Payment</h2>
        
        <div className="payment-details">
          <div className="detail-row">
            <span>Product:</span>
            <span>{transaction.product.name}</span>
          </div>
          <div className="detail-row">
            <span>Platform:</span>
            <span>{transaction.product.platform}</span>
          </div>
          <div className="detail-row">
            <span>Original Price:</span>
            <span>₹{transaction.product.originalPrice}</span>
          </div>
          <div className="detail-row">
            <span>Discount:</span>
            <span className="highlight">₹{transaction.discountAmount}</span>
          </div>
          <div className="detail-row total">
            <span>Service Fee (15%):</span>
            <span>₹{transaction.serviceFee.toFixed(2)}</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="payment-info">
          <p>You will pay ₹{transaction.serviceFee.toFixed(2)} as service fee</p>
          <p>Card owner will receive ₹{transaction.ownerEarnings.toFixed(2)}</p>
        </div>

        <div className="modal-actions">
          <button 
            className="btn-secondary" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>

        <div className="payment-security">
          <small>🔒 Secured by Razorpay</small>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
