// Transactional email via Resend (https://resend.com).
// Keeps the same request contract as before: { to, subject, htmlContent }.
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@heavymetalcasting.com';
const FROM_NAME = 'Heavy Metal Casting';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured' });
  }

  try {
    const { to, subject, htmlContent } = req.body;

    if (!to || !subject || !htmlContent) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, htmlContent' });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: Array.isArray(to) ? to : [to],
        subject,
        html: htmlContent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(response.status).json({
        error: 'Failed to send email',
        message: data?.message || 'Resend request failed',
      });
    }

    return res.status(200).json({
      success: true,
      messageId: data.id,
    });
  } catch (error) {
    console.error('Resend request error:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      message: error.message,
    });
  }
}
