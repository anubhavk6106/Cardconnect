const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email templates
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to CardConnect!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Welcome to CardConnect, ${name}! 🎉</h1>
        <p>Thank you for joining our platform. You can now access exclusive bank card discounts!</p>
        <p>Get started by:</p>
        <ul>
          <li>Browsing available cards and discounts</li>
          <li>Requesting transactions for your favorite products</li>
          <li>Earning rewards and building your reputation</li>
        </ul>
        <a href="${process.env.FRONTEND_URL}" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Go to Dashboard</a>
      </div>
    `
  }),

  transactionRequest: (buyerName, productName, cardOwnerName) => ({
    subject: 'New Transaction Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">New Transaction Request</h2>
        <p>Hi ${cardOwnerName},</p>
        <p><strong>${buyerName}</strong> has requested to use your card for:</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>Product:</strong> ${productName}</p>
        </div>
        <p>Please review and respond to this request in your dashboard.</p>
        <a href="${process.env.FRONTEND_URL}/card-owner/dashboard" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Request</a>
      </div>
    `
  }),

  transactionApproved: (buyerName, productName, discountAmount) => ({
    subject: 'Transaction Approved! ✅',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Transaction Approved! ✅</h2>
        <p>Hi ${buyerName},</p>
        <p>Great news! Your transaction request has been approved.</p>
        <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>Product:</strong> ${productName}</p>
          <p style="margin: 5px 0;"><strong>Discount:</strong> ₹${discountAmount}</p>
        </div>
        <p>You can now proceed with your purchase using the provided discount.</p>
        <a href="${process.env.FRONTEND_URL}/transactions" style="display: inline-block; padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Details</a>
      </div>
    `
  }),

  transactionRejected: (buyerName, productName) => ({
    subject: 'Transaction Request Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Transaction Request Update</h2>
        <p>Hi ${buyerName},</p>
        <p>Unfortunately, your transaction request for <strong>${productName}</strong> was not approved.</p>
        <p>Don't worry! You can browse other available cards and try again.</p>
        <a href="${process.env.FRONTEND_URL}/buyer/dashboard" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Browse Cards</a>
      </div>
    `
  }),

  transactionCompleted: (cardOwnerName, buyerName, earnings) => ({
    subject: 'Transaction Completed - Earnings Added! 💰',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Transaction Completed! 💰</h2>
        <p>Hi ${cardOwnerName},</p>
        <p><strong>${buyerName}</strong> has completed their purchase.</p>
        <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>Your Earnings:</strong> ₹${earnings}</p>
        </div>
        <p>Thank you for sharing your discount!</p>
        <a href="${process.env.FRONTEND_URL}/card-owner/dashboard" style="display: inline-block; padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Dashboard</a>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    const emailContent = emailTemplates[template](...data);
    
    const mailOptions = {
      from: `"CardConnect" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendEmail };
