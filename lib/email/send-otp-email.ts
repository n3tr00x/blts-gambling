'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOTPEmailParams {
  email: string;
  // token: string;
}

/**
 * Development mode email sender using Resend
 * Sends OTP verification code to the user's email
 * In development, logs to console if no API key is set
 */
export async function sendOTPEmail({ email }: SendOTPEmailParams) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  console.log('isDevelopment', isDevelopment);
  console.log('senderEmail', senderEmail);

  // Log in development mode
  if (isDevelopment) {
    console.log('📧 [DEV MODE] Email OTP Details:');
    console.log(`   To: ${email}`);
    // console.log(`   Code: ${token}`);
  }

  // Skip sending in development if no API key
  if (isDevelopment && !process.env.RESEND_API_KEY) {
    console.log('⚠️  [DEV MODE] RESEND_API_KEY not set. Email not sent.');
    return { success: true, message: '[DEV MODE] Email logged to console' };
  }

  try {
    const html = generateEmailHTML({
      // token,
    });

    const result = await resend.emails.send({
      from: senderEmail,
      to: email,
    });

    if (result.error) {
      console.error('❌ Email sending error:', result.error);
      return {
        success: false,
        message: 'Nie udało się wysłać emaila',
        error: result.error,
      };
    }

    console.log('✅ Email sent successfully:', result.data?.id);
    return {
      success: true,
      message: 'Email wysłany pomyślnie',
      data: result.data,
    };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return {
      success: false,
      message: 'Błąd przy wysyłaniu emaila',
      error,
    };
  }
}

function generateEmailHTML({ token }: { token?: string }): string {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kod weryfikacyjny</title>
    </head>
    <body style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9fafb;
      margin: 0;
      padding: 20px;
    ">
      <div style="
        max-width: 600px;
        margin: 0 auto;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        overflow: hidden;
      ">
        <div style="
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        ">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">
            BLTS Gambling
          </h1>
        </div>

        <div style="padding: 40px 20px;">
          <p style="color: #666; margin-top: 0;">Cześć!</p>
          
          <p>Twój kod weryfikacyjny to:</p>
          <div style="
            font-size: 48px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 30px 0;
            color: #3b82f6;
            font-family: 'Courier New', monospace;
            text-align: center;
          ">
            ${token}
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px; text-align: center;">
            Kod wygaśnie za 10 minut.
          </p>

          ${isDevelopment ? `<p style="color: #999; font-size: 12px; background: #f5f5f5; padding: 10px; border-radius: 4px; text-align: center;">Kod (DEV): ${token}</p>` : ''}

          <div style="
            border-top: 1px solid #e5e7eb;
            margin-top: 30px;
            padding-top: 20px;
            font-size: 12px;
            color: #999;
          ">
            <p style="margin: 5px 0;">
              Jeśli to nie Ty wysłałeś ten request, zignoruj tego emaila.
            </p>
            <p style="margin: 5px 0;">
              Pytania? Skontaktuj się z nami na support@blts-gambling.com
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
