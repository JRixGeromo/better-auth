import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  user: {
    email: string;
  };
  url: string;
  token: string;
}

export async function sendVerificationEmail({ user, url, token }: EmailParams) {
  console.log('📧 Email service called with:', {
    email: user.email,
    tokenLength: token.length,
    apiKeyExists: !!process.env.RESEND_API_KEY,
    apiKeyLength: process.env.RESEND_API_KEY?.length
  });

  console.log('🔗 Verification URL:', url);

  try {
    console.log('📤 Sending email via Resend...');
    const { data, error } = await resend.emails.send({
      from: 'no-reply@jobbify.com.au',
      to: user.email,
      subject: 'Verify your email address',
      html: `
        <div>
          <h1>Welcome to Better Auth!</h1>
          <p>Please verify your email address by clicking the link below:</p>
          <p>
            <a href="${url}">
              Verify Email Address
            </a>
          </p>
          <p>Or copy and paste this URL into your browser:</p>
          <p>${url}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `
    });

    if (error) {
      console.error('❌ Resend API error:', error);
      throw error;
    }

    console.log('✅ Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error in sendVerificationEmail:', error);
    throw error;
  }
}
