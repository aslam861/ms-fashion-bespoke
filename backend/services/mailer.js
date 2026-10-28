import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dynamicConfigFile = path.resolve(__dirname, '..', 'data', 'dynamicBrandConfig.json');

/**
 * Configure Nodemailer transporter.
 * If SMTP_EMAIL and SMTP_PASSWORD are set in .env or dynamicBrandConfig.json, it uses Gmail SMTP.
 * Otherwise, it runs in Dev Mode and logs the OTP in the console.
 */
const getTransporter = () => {
  let user = process.env.SMTP_EMAIL ? process.env.SMTP_EMAIL.trim() : '';
  let pass = process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.replace(/\s+/g, '') : '';

  if (!user || !pass) {
    try {
      if (fs.existsSync(dynamicConfigFile)) {
        const parsed = JSON.parse(fs.readFileSync(dynamicConfigFile, 'utf-8'));
        if (parsed.smtpEmail) user = parsed.smtpEmail.trim();
        if (parsed.smtpPassword) pass = parsed.smtpPassword.replace(/\s+/g, '');
      }
    } catch (e) {}
  }

  if (!user || !pass) {
    return null;
  }

  return {
    user,
    transporter: nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass
      }
    })
  };
};

/**
 * Send Royal M.S Fashion Verification OTP Email
 * @param {string} toEmail - Recipient email
 * @param {string} customerName - Recipient name
 * @param {string} otp - 6-digit numeric OTP
 * @returns {Promise<{ success: boolean, mode: string, devOtp?: string }>}
 */
export const sendOtpEmail = async (toEmail, customerName = 'Royal Guest', otp) => {
  const smtpConfig = getTransporter();

  // If credentials are not configured yet, run in development mode
  if (!smtpConfig) {
    console.log(`\n======================================================`);
    console.log(`⚜️ [M.S FASHION MAILER (DEV MODE)]`);
    console.log(`👑 Recipient: ${customerName} <${toEmail}>`);
    console.log(`🔑 Verification OTP: ${otp}`);
    console.log(`⏱️ Validity: 10 minutes`);
    console.log(`💡 To send live emails, add SMTP_EMAIL and SMTP_PASSWORD in backend/.env`);
    console.log(`======================================================\n`);

    return {
      success: true,
      mode: 'dev',
      devOtp: otp,
      message: 'OTP generated in dev mode (check console or screen).'
    };
  }

  // Luxury Royal Email Template
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7EFE2; margin: 0; padding: 24px; }
        .card { max-width: 540px; margin: 0 auto; background-color: #FBF6EC; border: 2px solid #A9812F; box-shadow: 0 10px 25px rgba(28, 8, 11, 0.15); overflow: hidden; }
        .header { background-color: #5C1A21; padding: 28px 20px; text-align: center; border-bottom: 2px solid #A9812F; }
        .brand-title { color: #FBF6EC; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 0; text-transform: uppercase; font-family: Georgia, serif; }
        .tagline { color: #C5A869; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-top: 6px; }
        .body-content { padding: 32px 28px; color: #2B211D; }
        .salutation { font-size: 16px; font-weight: 600; color: #5C1A21; margin-bottom: 12px; font-family: Georgia, serif; }
        .intro { font-size: 13px; line-height: 1.6; color: #54453C; margin-bottom: 24px; }
        .otp-box { background-color: #ECE2D2; border: 2px dashed #A9812F; border-radius: 4px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #7A665A; font-weight: bold; margin-bottom: 8px; }
        .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #5C1A21; font-family: 'Courier New', Courier, monospace; margin: 0; }
        .expiry-note { font-size: 11px; color: #8F6B24; margin-top: 8px; font-weight: 600; }
        .security-note { font-size: 12px; color: #7A6E65; line-height: 1.5; border-top: 1px solid #E5D9C5; padding-top: 16px; margin-top: 20px; }
        .footer { background-color: #1C080B; color: #A8988C; padding: 16px; text-align: center; font-size: 11px; letter-spacing: 1px; }
        .footer a { color: #C5A869; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 class="brand-title">M.S FASHION</h1>
          <div class="tagline">The Art of Bespoke Ethnic Menswear • Mumbai</div>
        </div>
        <div class="body-content">
          <div class="salutation">Respected ${customerName},</div>
          <p class="intro">
            Thank you for choosing <strong>M.S Fashion</strong> for your bespoke celebration attire.
            Please use the 6-digit verification code below to verify your email and confirm your exclusive boutique appointment.
          </p>

          <div class="otp-box">
            <div class="otp-label">Appointment Verification Code</div>
            <div class="otp-code">${otp}</div>
            <div class="expiry-note">⏳ Valid for the next 10 minutes</div>
          </div>

          <p class="security-note">
            ⚠️ <em>If you did not request this appointment, please disregard this email. Never share this code with anyone.</em>
          </p>
        </div>
        <div class="footer">
          Atelier: Sanaullah Compound, Dharavi Main Road, Mahim (East), Mumbai - 400017<br>
          Direct Line: +91 89993 86222 • <a href="https://maps.app.goo.gl/bK6BAQTHtguhqWo19">View Atelier on Google Maps</a>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { user, transporter } = smtpConfig;
    const sender = process.env.SMTP_EMAIL || user;
    const info = await transporter.sendMail({
      from: `"M.S Fashion Atelier" <${sender}>`,
      to: toEmail,
      subject: `👑 ${otp} is your M.S Fashion Appointment Verification Code`,
      html: htmlContent
    });

    console.log(`[MAILER] OTP email delivered successfully to ${toEmail}. MessageId: ${info.messageId}`);
    return {
      success: true,
      mode: 'live',
      message: 'Verification OTP sent directly to your email inbox.'
    };
  } catch (error) {
    console.error('[MAILER ERROR] Failed to send email via SMTP:', error);
    // Fallback to dev output so user is never blocked even if SMTP password has a typo
    return {
      success: true,
      mode: 'fallback',
      devOtp: otp,
      message: 'SMTP delivery encountered an issue. Dev OTP provided for verification.'
    };
  }
};
