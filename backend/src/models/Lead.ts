import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  contactName: String,
  email: String,
  phone: String,
  website: String,
  industry: String,
  companySize: String,
  location: String,
  leadScore: {
    type: Number,
    default: 0
  },
  reasoning: String,
  source: {
    type: String,
    default: 'AI Generated'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'lost', 'converted'],
    default: 'new'
  },
  notes: String,
  followUpDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Lead', leadSchema);