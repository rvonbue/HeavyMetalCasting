// AWS SES email service for transactional and marketing emails
const EMAIL_API_URL = '/api/send-email';
const FROM_EMAIL = 'noreply@heavymetalcasting.com';
const FROM_NAME = 'Heavy Metal Casting';

// Helper to send emails via AWS SES serverless function
async function sendEmail(to, subject, htmlContent) {
  const response = await fetch(EMAIL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to,
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Email service error: ${response.status}`);
  }

  return response.json();
}

// Send email verification email
export async function sendVerificationEmail(email, verificationToken) {
  const verificationLink = `${window.location.origin}/verify-email?token=${verificationToken}`;

  return sendEmail(email, 'Verify your email for Heavy Metal Casting', `
    <h2>Welcome to Heavy Metal Casting!</h2>
    <p>Please verify your email address to complete your account setup.</p>
    <p>
      <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px;">
        Verify Email
      </a>
    </p>
    <p>Or copy this link: ${verificationLink}</p>
    <p style="color: #666; font-size: 12px;">
      This link expires in 24 hours. If you didn't sign up for this account, you can ignore this email.
    </p>
  `);
}

// Send password reset email
export async function sendPasswordResetEmail(email, resetToken) {
  const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`;

  return sendEmail(email, 'Reset your Heavy Metal Casting password', `
    <h2>Password Reset Request</h2>
    <p>We received a request to reset your password.</p>
    <p>
      <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px;">
        Reset Password
      </a>
    </p>
    <p>Or copy this link: ${resetLink}</p>
    <p style="color: #666; font-size: 12px;">
      This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
    </p>
  `);
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(email, orderDetails) {
  return sendEmail(email, `Order Confirmation #${orderDetails.orderId}`, `
    <h2>Order Confirmation</h2>
    <p>Thank you for your order!</p>
    <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
    <p><strong>Total:</strong> $${orderDetails.total.toFixed(2)}</p>
    <p>Your order will be processed shortly. You'll receive a shipping notification when it's on the way.</p>
  `);
}

// Send marketing/promotional email
export async function sendPromotionalEmail(email, subject, htmlContent) {
  return sendEmail(email, subject, htmlContent);
}

// Send email to multiple recipients (newsletters, bulk promotions)
export async function sendBulkEmail(emails, subject, htmlContent) {
  return sendEmail(emails, subject, htmlContent);
}
