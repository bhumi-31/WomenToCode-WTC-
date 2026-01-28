// ===========================================
// EMAIL SERVICE
// ===========================================
// Handles all email sending functionality
// Uses Nodemailer with Gmail SMTP
// ===========================================

const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Use App Password for Gmail
    }
  });
};

// Base email template with WomenToCode branding
const getEmailTemplate = (content) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WomenToCode</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px;">
          
          <!-- Header -->
          <tr>
            <td style="text-align: center; padding-bottom: 30px;">
              <h1 style="margin: 0; font-size: 48px; font-weight: 700; letter-spacing: 6px; color: #1a1a1a; font-family: Georgia, 'Times New Roman', serif;">
                WTC
              </h1>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 15px auto 0;">
                <tr>
                  <td style="width: 60px; height: 1px; background-color: #1a1a1a;"></td>
                  <td style="padding: 0 15px; color: #1a1a1a; font-size: 11px; font-weight: 500; letter-spacing: 3px;">
                    W O M E N &nbsp; T O &nbsp; C O D E
                  </td>
                  <td style="width: 60px; height: 1px; background-color: #1a1a1a;"></td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main Content Card -->
          <tr>
            <td>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #1a1a1a 0%, #141414 100%); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08);">
                <tr>
                  <td style="padding: 40px;">
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding-top: 30px; text-align: center;">
              <p style="margin: 0 0 15px 0; color: rgba(255, 255, 255, 0.4); font-size: 13px;">
                Connect with us
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="padding: 0 8px;">
                    <a href="#" style="color: #F7D046; text-decoration: none; font-size: 13px;">Instagram</a>
                  </td>
                  <td style="color: rgba(255, 255, 255, 0.3);">•</td>
                  <td style="padding: 0 8px;">
                    <a href="#" style="color: #F7D046; text-decoration: none; font-size: 13px;">LinkedIn</a>
                  </td>
                  <td style="color: rgba(255, 255, 255, 0.3);">•</td>
                  <td style="padding: 0 8px;">
                    <a href="#" style="color: #F7D046; text-decoration: none; font-size: 13px;">Twitter</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 20px 0 0 0; color: rgba(255, 255, 255, 0.3); font-size: 12px;">
                © ${new Date().getFullYear()} WomenToCode. All rights reserved.
              </p>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.2); font-size: 11px;">
                You received this email because you have an account with WomenToCode.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// Welcome Email Template
const getWelcomeEmailContent = (firstName) => {
  return `
    <!-- Welcome Icon -->
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(247, 208, 70, 0.2) 0%, rgba(247, 208, 70, 0.1) 100%); border-radius: 50%; padding-top: 18px; box-sizing: border-box;">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#F7D046"/>
        </svg>
      </div>
    </div>
    
    <!-- Greeting -->
    <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 28px; font-weight: 600; text-align: center;">
      Welcome to the Community, <span style="color: #F7D046;">${firstName}!</span>
    </h2>
    
    <p style="margin: 0 0 25px 0; color: rgba(255, 255, 255, 0.7); font-size: 16px; line-height: 1.7; text-align: center;">
      We're thrilled to have you join WomenToCode! You're now part of a vibrant community of women who are passionate about technology and coding.
    </p>
    
    <!-- Divider -->
    <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(247, 208, 70, 0.3) 50%, transparent 100%); margin: 30px 0;"></div>
    
    <!-- What's Next Section -->
    <h3 style="margin: 0 0 20px 0; color: #F7D046; font-size: 18px; font-weight: 600;">
      Here's what you can do next:
    </h3>
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="padding: 12px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <div style="width: 28px; height: 28px; background: rgba(247, 208, 70, 0.15); border-radius: 8px; text-align: center; line-height: 28px;">
                  <span style="color: #F7D046; font-size: 14px;">1</span>
                </div>
              </td>
              <td style="color: rgba(255, 255, 255, 0.7); font-size: 15px; line-height: 1.5;">
                <strong style="color: #ffffff;">Complete your profile</strong> - Add your bio and social links
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <div style="width: 28px; height: 28px; background: rgba(247, 208, 70, 0.15); border-radius: 8px; text-align: center; line-height: 28px;">
                  <span style="color: #F7D046; font-size: 14px;">2</span>
                </div>
              </td>
              <td style="color: rgba(255, 255, 255, 0.7); font-size: 15px; line-height: 1.5;">
                <strong style="color: #ffffff;">Explore our programs</strong> - Learn new skills with our workshops
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <div style="width: 28px; height: 28px; background: rgba(247, 208, 70, 0.15); border-radius: 8px; text-align: center; line-height: 28px;">
                  <span style="color: #F7D046; font-size: 14px;">3</span>
                </div>
              </td>
              <td style="color: rgba(255, 255, 255, 0.7); font-size: 15px; line-height: 1.5;">
                <strong style="color: #ffffff;">Join upcoming events</strong> - Connect with like-minded women
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <!-- CTA Button -->
    <div style="text-align: center; margin-top: 35px;">
      <a href="${process.env.FRONTEND_URL}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #F7D046 0%, #d4a83a 100%); color: #0a0a0a; text-decoration: none; font-weight: 600; font-size: 15px; border-radius: 10px; letter-spacing: 0.5px;">
        Explore WomenToCode
      </a>
    </div>
    
    <!-- Signature -->
    <p style="margin: 35px 0 0 0; color: rgba(255, 255, 255, 0.5); font-size: 14px; text-align: center; font-style: italic;">
      Welcome aboard!<br>
      <span style="color: rgba(255, 255, 255, 0.7);">The WomenToCode Team</span>
    </p>
  `;
};

// Password Reset Email Template
const getPasswordResetContent = (firstName, resetLink) => {
  return `
    <!-- Lock Icon -->
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(247, 208, 70, 0.2) 0%, rgba(247, 208, 70, 0.1) 100%); border-radius: 50%; padding-top: 18px; box-sizing: border-box;">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="#F7D046"/>
        </svg>
      </div>
    </div>
    
    <!-- Title -->
    <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 28px; font-weight: 600; text-align: center;">
      Reset Your Password
    </h2>
    
    <p style="margin: 0 0 25px 0; color: rgba(255, 255, 255, 0.7); font-size: 16px; line-height: 1.7; text-align: center;">
      Hi <strong style="color: #F7D046;">${firstName}</strong>, we received a request to reset your password. Click the button below to create a new password.
    </p>
    
    <!-- CTA Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="${resetLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #F7D046 0%, #d4a83a 100%); color: #0a0a0a; text-decoration: none; font-weight: 600; font-size: 15px; border-radius: 10px; letter-spacing: 0.5px;">
        Reset Password
      </a>
    </div>
    
    <!-- Security Notice -->
    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 20px; margin-top: 25px;">
      <p style="margin: 0 0 10px 0; color: rgba(255, 255, 255, 0.6); font-size: 14px; line-height: 1.6; display: flex; align-items: center;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px; vertical-align: middle;">
          <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="#F7D046"/>
        </svg>
        <strong style="color: rgba(255, 255, 255, 0.8);">This link expires in 1 hour</strong>
      </p>
      <p style="margin: 0; color: rgba(255, 255, 255, 0.5); font-size: 13px; line-height: 1.6;">
        If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
      </p>
    </div>
    
    <!-- Alternative Link -->
    <p style="margin: 25px 0 0 0; color: rgba(255, 255, 255, 0.4); font-size: 12px; text-align: center; word-break: break-all;">
      If the button doesn't work, copy and paste this link:<br>
      <a href="${resetLink}" style="color: #F7D046; text-decoration: none;">${resetLink}</a>
    </p>
  `;
};

// Password Reset Success Email Template
const getPasswordResetSuccessContent = (firstName) => {
  return `
    <!-- Success Icon -->
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%); border-radius: 50%; padding-top: 18px; box-sizing: border-box;">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#22c55e"/>
        </svg>
      </div>
    </div>
    
    <!-- Title -->
    <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 28px; font-weight: 600; text-align: center;">
      Password Changed Successfully
    </h2>
    
    <p style="margin: 0 0 25px 0; color: rgba(255, 255, 255, 0.7); font-size: 16px; line-height: 1.7; text-align: center;">
      Hi <strong style="color: #F7D046;">${firstName}</strong>, your password has been successfully updated. You can now log in with your new password.
    </p>
    
    <!-- CTA Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #F7D046 0%, #d4a83a 100%); color: #0a0a0a; text-decoration: none; font-weight: 600; font-size: 15px; border-radius: 10px; letter-spacing: 0.5px;">
        Log In Now
      </a>
    </div>
    
    <!-- Security Notice -->
    <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 10px; padding: 20px; margin-top: 25px;">
      <p style="margin: 0; color: rgba(255, 255, 255, 0.6); font-size: 14px; line-height: 1.6;">
        <strong style="color: #ef4444;">Didn't make this change?</strong><br>
        If you didn't reset your password, please contact us immediately at support@womentocode.com
      </p>
    </div>
  `;
};

// Send Welcome Email
const sendWelcomeEmail = async (email, firstName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"WomenToCode" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to WomenToCode, ${firstName}!`,
      html: getEmailTemplate(getWelcomeEmailContent(firstName))
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

// Send Password Reset Email
const sendPasswordResetEmail = async (email, firstName, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: `"WomenToCode" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your WomenToCode Password',
      html: getEmailTemplate(getPasswordResetContent(firstName, resetLink))
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

// Send Password Reset Success Email
const sendPasswordResetSuccessEmail = async (email, firstName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"WomenToCode" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your WomenToCode Password Has Been Changed',
      html: getEmailTemplate(getPasswordResetSuccessContent(firstName))
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Password reset success email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending password reset success email:', error);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail
};
