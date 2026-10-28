import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Inquiry from '../models/Inquiry.js';
import { getDbStatus } from '../config/db.js';
import { sendOtpEmail } from '../services/mailer.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inquiriesFilePath = path.resolve(__dirname, '..', 'data', 'dynamicInquiries.json');

// Memory store fallback with disk persistence so appointments are never lost
export const inMemoryInquiries = [];

try {
  if (fs.existsSync(inquiriesFilePath)) {
    const raw = fs.readFileSync(inquiriesFilePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      inMemoryInquiries.push(...parsed);
      console.log(`[INQUIRIES] Loaded ${inMemoryInquiries.length} appointments from dynamicInquiries.json`);
    }
  }
} catch (e) {
  console.warn('[INQUIRIES] Notice loading dynamicInquiries.json:', e.message);
}

export const persistInquiries = () => {
  try {
    fs.writeFileSync(inquiriesFilePath, JSON.stringify(inMemoryInquiries, null, 2), 'utf8');
  } catch (e) {
    console.error('[INQUIRIES ERROR] Failed to save dynamicInquiries.json:', e.message);
  }
};

export const getInquiriesList = () => {
  if (inMemoryInquiries.length === 0 && fs.existsSync(inquiriesFilePath)) {
    try {
      const raw = fs.readFileSync(inquiriesFilePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryInquiries.push(...parsed);
      }
    } catch (e) {}
  }
  return inMemoryInquiries;
};

// In-memory store for OTPs: email -> { otp, expiresAt, attempts, verified }
const otpStore = new Map();

// POST /api/inquiries/send-otp - Generate & send email verification OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email, customerName } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid royal email address (e.g. name@gmail.com).'
      });
    }

    // Check if an OTP was recently sent (prevent flooding within 20s)
    const existing = otpStore.get(normalizedEmail);
    if (existing && existing.createdAt && (Date.now() - existing.createdAt < 20000)) {
      const waitSeconds = Math.ceil((20000 - (Date.now() - existing.createdAt)) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSeconds} seconds before requesting a new OTP code.`
      });
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(normalizedEmail, {
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
      verified: false
    });

    const sendResult = await sendOtpEmail(normalizedEmail, customerName || 'Royal Guest', otp);

    res.json({
      success: true,
      message: sendResult.message || 'Verification OTP sent to your email.',
      mode: sendResult.mode,
      devOtp: sendResult.devOtp
    });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ success: false, message: 'Server error generating verification code.' });
  }
});

// POST /api/inquiries/verify-otp - Verify the entered OTP code
router.post('/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();

    if (!normalizedEmail || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and 6-digit OTP code are required.'
      });
    }

    const record = otpStore.get(normalizedEmail);
    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'No OTP requested for this email. Please click "Send OTP" first.'
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({
        success: false,
        message: 'This OTP has expired (10 min limit). Please request a new code.'
      });
    }

    record.attempts += 1;
    if (record.attempts > 5) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({
        success: false,
        message: 'Too many incorrect attempts. Please request a new code.'
      });
    }

    if (record.otp !== String(otp).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect verification code. Please check your email and try again.'
      });
    }

    record.verified = true;
    res.json({
      success: true,
      message: 'Email verified successfully! You may now confirm your appointment.'
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Server error verifying OTP code.' });
  }
});

// POST /api/inquiries - Submit a bespoke consultation request
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      city,
      consultationType,
      productId,
      productTitle,
      selectedAccessories,
      estimatedTotal,
      budget,
      notes,
      otp // optional: verify in-flight if passed
    } = req.body;

    const normalizedEmail = (customerEmail || '').toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Email is now mandatory to eliminate fake submissions
    if (!customerName || !normalizedEmail || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Name, email address, and product reference are required.'
      });
    }

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid royal email address.'
      });
    }

    // Check OTP verification
    const otpRecord = otpStore.get(normalizedEmail);
    const isOtpValidInFlight = otp && otpRecord && (otpRecord.otp === String(otp).trim()) && (Date.now() <= otpRecord.expiresAt);

    if (!otpRecord?.verified && !isOtpValidInFlight) {
      return res.status(400).json({
        success: false,
        message: 'Email address has not been verified with OTP yet. Please verify your email first.'
      });
    }

    // Phone is optional: if provided, validate minimum 10 digits; otherwise mark Not Provided
    let finalPhone = customerPhone?.trim() || '';
    if (finalPhone && finalPhone !== 'Via WhatsApp' && finalPhone !== 'Not Provided' && finalPhone !== 'Optional (Not Provided)') {
      const digits = finalPhone.replace(/\D/g, '');
      if (digits.length < 10) {
        return res.status(400).json({
          success: false,
          message: 'If providing a phone number, please ensure it has 10 digits.'
        });
      }
    } else if (!finalPhone || finalPhone === 'Optional (Not Provided)') {
      finalPhone = 'Not Provided';
    }

    const inquiryData = {
      customerName,
      customerPhone: finalPhone,
      customerEmail: normalizedEmail,
      city: city || '',
      consultationType: consultationType || 'whatsapp',
      productId,
      productTitle: productTitle || 'Custom Bespoke Garment',
      selectedAccessories: selectedAccessories || [],
      estimatedTotal: Number(estimatedTotal) || 0,
      budget: budget || '',
      notes: notes || '',
      status: 'pending',
      createdAt: new Date()
    };

    const savedRecord = { ...inquiryData, _id: 'inq_' + Date.now() };

    if (getDbStatus()) {
      try {
        const newInquiry = new Inquiry(inquiryData);
        await newInquiry.save();
      } catch (err) {
        console.warn('DB save notice:', err.message);
      }
    }

    // Always record in in-memory store & persist to dynamicInquiries.json
    inMemoryInquiries.unshift(savedRecord);
    persistInquiries();

    console.log(`\n======================================================`);
    console.log(`👑 [NEW APPOINTMENT REGISTERED & SAVED TO DISK]`);
    console.log(`👤 Client: ${customerName}`);
    console.log(`📧 Verified Email: ${normalizedEmail}`);
    console.log(`📞 Phone: ${finalPhone}`);
    console.log(`💰 Budget: ${budget || 'Not specified'}`);
    console.log(`🏷️ Garment / Category: ${productTitle}`);
    console.log(`📍 City: ${city || 'Not Specified'}`);
    console.log(`📝 Notes: ${notes || 'None'}`);
    console.log(`======================================================\n`);

    // Clean up verified OTP from memory once lead is successfully saved
    otpStore.delete(normalizedEmail);

    res.status(201).json({
      success: true,
      message: 'Consultation request received successfully. Our master stylist will connect with you.',
      data: savedRecord
    });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ success: false, message: 'Server error processing inquiry' });
  }
});

// GET /api/inquiries - List inquiries (for admin/store master)
router.get('/', async (req, res) => {
  try {
    let inquiries = [];
    if (getDbStatus()) {
      inquiries = await Inquiry.find().sort({ createdAt: -1 });
    } else {
      inquiries = [...inMemoryInquiries].reverse();
    }
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving inquiries' });
  }
});

export default router;
