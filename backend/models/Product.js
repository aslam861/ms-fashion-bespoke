import mongoose from 'mongoose';

const AccessorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true }, // e.g. "collar", "buttons", "safa", etc.
  description: { type: String, default: '' },
  price: { type: Number, default: 0 },
  zoomOrigin: {
    x: { type: Number, default: 50 }, // percentage
    y: { type: Number, default: 50 }, // percentage
    scale: { type: Number, default: 2.2 }
  }
});

const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Sherwani', 'Jodhpuri', 'Indo-Western', 'Blazer']
    },
    subCategory: {
      type: String,
      required: true
    },
    folderPath: {
      type: String,
      required: true
    },
    placeholderLabel: {
      type: String,
      required: true
    },
    imageFileName: {
      type: String,
      default: ''
    },
    basePrice: {
      type: Number,
      required: true
    },
    tagline: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    fabric: {
      type: String,
      default: 'Pure Raw Silk & Brocade'
    },
    embroidery: {
      type: String,
      default: 'Handcrafted Zardozi & Resham'
    },
    fit: {
      type: String,
      default: 'Custom Bespoke Tailored Fit'
    },
    leadTime: {
      type: String,
      default: '15 - 20 Working Days'
    },
    accessories: [AccessorySchema]
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;
