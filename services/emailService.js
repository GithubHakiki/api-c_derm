require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOTPEmail = (to, otp) => {
  const msg = {
    to: to,
    from: process.env.EMAIL_FROM,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  return sgMail.send(msg).catch(error => {
    console.error('Error sending OTP', error);
    throw new Error('Error sending OTP email');
  });
};

module.exports = {
  sendOTPEmail,
};
