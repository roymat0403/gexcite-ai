import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import leadsRoutes from './routes/leads';
import userRoutes from './routes/users';
import paymentRoutes from './routes/payment';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gexcite';
mongoose.connect(mongoUri)
  .then(() => console.log('✅ Gexcite: MongoDB connected'))
  .catch(err => console.error('❌ Gexcite: MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Gexcite is running',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Gexcite backend running on port ${PORT}`);
});

export default app;