// Brevo email service for transactional and marketing emails
const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3';
const FROM_EMAIL = 'noreply@heavymetalcasting.com'; // Replace with actual domain
const FROM_NAME = 'Heavy Metal Casting';

// Helper to make authenticated Brevo API calls
async function makeBrevoRequest(endpoint, options = {}) {
  const response = await fetch(`${BREVO_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Brevo API error: ${response.status}`);
  }

  return response.json();
}

// Send email verification email
export async function sendVerificationEmail(email, verificationToken) {
  const verificationLink = `${window.location.origin}/verify-email?token=${verificationToken}`;

  return makeBrevoRequest('/smtp/email', {
    method: 'POST',
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email }],
      subject: 'Verify your email for Heavy Metal Casting',
      htmlContent: `
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
      `,
    }),
  });
}

// Send password reset email
export async function sendPasswordResetEmail(email, resetToken) {
  const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`;

  return makeBrevoRequest('/smtp/email', {
    method: 'POST',
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email }],
      subject: 'Reset your Heavy Metal Casting password',
      htmlContent: `
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
      `,
    }),
  });
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(email, orderDetails) {
  return makeBrevoRequest('/smtp/email', {
    method: 'POST',
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email }],
      subject: `Order Confirmation #${orderDetails.orderId}`,
      htmlContent: `
        <h2>Order Confirmation</h2>
        <p>Thank you for your order!</p>
        <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        <p><strong>Total:</strong> $${orderDetails.total.toFixed(2)}</p>
        <p>Your order will be processed shortly. You'll receive a shipping notification when it's on the way.</p>
      `,
    }),
  });
}

// Send marketing/promotional email
export async function sendPromotionalEmail(email, subject, htmlContent) {
  return makeBrevoRequest('/smtp/email', {
    method: 'POST',
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email }],
      subject,
      htmlContent,
    }),
  });
}

// Send email to multiple recipients (newsletters, bulk promotions)
export async function sendBulkEmail(emails, subject, htmlContent) {
  return makeBrevoRequest('/smtp/email', {
    method: 'POST',
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: emails.map(email => ({ email })),
      subject,
      htmlContent,
    }),
  });
}
