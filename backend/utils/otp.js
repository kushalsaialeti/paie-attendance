// Generate random OTP
exports.generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

// Calculate OTP expiry time
exports.getOTPExpiry = () => {
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 3;
  return new Date(Date.now() + expiryMinutes * 60 * 1000);
};
