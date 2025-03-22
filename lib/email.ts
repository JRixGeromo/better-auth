import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Better Auth <auth@yourdomain.com>',
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
      console.error('Failed to send verification email:', error);
      throw error;
    }

    console.log('Verification email sent:', data);
    return data;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}
