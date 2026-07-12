import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  businessName: String,
  businessType: String,
  whatYouSell: String,
  targetAudience: String,
  subscriptionPlan: {
    type: String,
    enum: ['free-trial', 'starter', 'pro', 'enterprise'],
    default: 'free-trial'
  },
  trialEndsAt: {
    type: Date,
    default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  },
  subscriptionStartDate: Date,
  subscriptionRenewDate: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  leadsGenerated: {
    type: Number,
    default: 0
  },
  leadsLimit: {
    type: Number,
    default: 50
  },
  paymentMethod: String,
  stripeCustomerId: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);