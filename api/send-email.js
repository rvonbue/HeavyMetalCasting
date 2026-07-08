import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({ region: process.env.AWS_REGION });
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@heavymetalcasting.com';
const FROM_NAME = 'Heavy Metal Casting';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, htmlContent } = req.body;

    if (!to || !subject || !htmlContent) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, htmlContent' });
    }

    const params = {
      Source: `${FROM_NAME} <${FROM_EMAIL}>`,
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlContent,
            Charset: 'UTF-8',
          },
        },
      },
    };

    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);

    return res.status(200).json({
      success: true,
      messageId: response.MessageId,
    });
  } catch (error) {
    console.error('AWS SES Error:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      message: error.message,
    });
  }
}
