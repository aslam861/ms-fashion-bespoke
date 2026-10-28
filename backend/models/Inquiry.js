import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, default: '' },
    city: { type: String, default: '' },
    consultationType: {
      type: String,
      enum: ['whatsapp', 'video-call', 'boutique-visit'],
      default: 'whatsapp'
    },
    productId: { type: String, required: true },
    productTitle: { type: String, required: true },
    selectedAccessories: [{ type: String }],
    estimatedTotal: { type: Number, required: true },
    budget: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'scheduled', 'completed'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
export default Inquiry;
