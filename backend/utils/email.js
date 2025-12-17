const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send OTP email
exports.sendOTPEmail = async (email, otp, studentName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"PAIE Attendance" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Attendance OTP',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 50px auto;
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .otp {
              font-size: 36px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 8px;
              margin: 30px 0;
              padding: 20px;
              background-color: #f8f9ff;
              border-radius: 8px;
              display: inline-block;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #6c757d;
            }
            .warning {
              color: #dc3545;
              font-size: 14px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>PAIE Attendance System</h1>
            </div>
            <div class="content">
              <h2>Hello, ${studentName}!</h2>
              <p>Your OTP for marking attendance is:</p>
              <div class="otp">${otp}</div>
              <p>This OTP is valid for ${process.env.OTP_EXPIRY_MINUTES || 3} minutes.</p>
              <p class="warning">⚠️ Do not share this OTP with anyone!</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} PAIE Attendance System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send email');
  }
};
