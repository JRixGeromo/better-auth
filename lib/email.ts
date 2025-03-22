import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  console.log('📧 Email service called with:', {
    email,
    tokenLength: token.length,
    apiKeyExists: !!process.env.RESEND_API_KEY,
    apiKeyLength: process.env.RESEND_API_KEY?.length
  });

  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  console.log('🔗 Verification URL:', verificationUrl);

  try {
    console.log('📤 Sending email via Resend...');
    const { data, error } = await resend.emails.send({
      from: 'no-reply@jobbify.com.au',
      to: email,
      subject: 'Verify your email address',
      html: `
        <div>
          <h1>Welcome to Better Auth!</h1>
          <p>Please verify your email address by clicking the link below:</p>
          <p>
            <a href="${verificationUrl}">
              Verify Email Address
            </a>
          </p>
          <p>Or copy and paste this URL into your browser:</p>
          <p>${verificationUrl}</p>
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
