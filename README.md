# Gexcite - AI-Powered Lead Generation Platform

## Overview

Gexcite is a cutting-edge AI-powered web application that helps businesses find qualified leads for their sales efforts. Users sign up for a free 14-day trial and can use our advanced AI to discover real-world business leads based on their industry, products, and target audience.

## Features

### 🎯 Core Features
- **AI-Powered Lead Generation** - Uses OpenAI to intelligently find leads based on business information
- **User Authentication** - Secure JWT-based authentication system
- **14-Day Free Trial** - No credit card required to get started
- **Lead Management Dashboard** - Track, organize, and manage all generated leads
- **Subscription Plans** - Flexible pricing with Free Trial, Starter, Pro, and Enterprise options
- **Lead Tracking** - Monitor lead status (new, contacted, qualified, converted, lost)
- **User Profiles** - Customize business information and preferences

### 🎨 Design
- **Times New Roman Font** - Professional serif typography throughout
- **Dark Grey & White Theme** - Modern color scheme (#2a2a2a, #ffffff, #4CAF50)
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Intuitive UI** - Clean, user-friendly interface

## Tech Stack

### Backend
- **Node.js + Express.js** - RESTful API server
- **MongoDB** - NoSQL database
- **TypeScript** - Type-safe JavaScript
- **JWT** - Authentication tokens
- **OpenAI API** - AI lead generation engine
- **Mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **TypeScript** - Type-safe React components
- **Axios** - HTTP client
- **CSS3** - Styling with responsive design

## Project Structure

```
gexcite-ai/
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Lead.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── leads.ts
│   │   │   ├── users.ts
│   │   │   └── payment.ts
│   │   └── middleware/
│   │       └── auth.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── index.css
│   │   └── pages/
│   │       ├── Login.tsx
│   │       ├── SignUp.tsx
│   │       ├── Dashboard.tsx
│   │       ├── LeadFinder.tsx
│   │       ├── Leads.tsx
│   │       ├── Profile.tsx
│   │       └── Pricing.tsx
│   ├── package.json
│   └── tsconfig.json
├── .env.example
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js v14+
- MongoDB (local or MongoDB Atlas)
- OpenAI API key

### Backend Setup

```bash
cd backend
npm install
cp ../.env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Environment Variables

Create a `.env` file in the root directory:

```
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/gexcite

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# OpenAI API
OPENAI_API_KEY=your-openai-api-key-here

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login

### Leads
- `POST /api/leads/generate` - Generate leads using AI
- `GET /api/leads` - Get user's leads
- `PUT /api/leads/:leadId` - Update lead status
- `DELETE /api/leads/:leadId` - Delete lead
- `GET /api/leads/stats/overview` - Get lead statistics

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/subscription` - Get subscription details

### Payment
- `GET /api/payment/plans` - Get available plans
- `POST /api/payment/upgrade` - Upgrade subscription
- `POST /api/payment/cancel` - Cancel subscription

## Subscription Plans

### Free Trial
- **Cost**: Free
- **Duration**: 14 days
- **Leads**: 50 leads
- **Features**: Basic AI lead generation, lead management

### Starter
- **Cost**: $29/month
- **Leads**: 100 leads/month
- **Features**: AI lead generation, lead scoring, status tracking

### Pro
- **Cost**: $99/month
- **Leads**: 500 leads/month
- **Features**: Advanced AI filtering, analytics, API access

### Enterprise
- **Cost**: Custom pricing
- **Leads**: Unlimited
- **Features**: Custom AI models, dedicated support, webhooks

## Workflow

1. **Sign Up** - User creates account and gets 14-day free trial
2. **Profile Setup** - User answers questions about their business
3. **Lead Generation** - User provides business details and target audience
4. **AI Analysis** - OpenAI analyzes data and generates qualified leads
5. **Lead Management** - User views, filters, and tracks leads
6. **Status Tracking** - User updates lead status as they progress
7. **Upgrade** - User upgrades plan when trial expires

## Database Schema

### User
```javascript
{
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  businessName: String,
  businessType: String,
  whatYouSell: String,
  targetAudience: String,
  subscriptionPlan: 'free-trial' | 'starter' | 'pro' | 'enterprise',
  trialEndsAt: Date,
  leadsGenerated: Number,
  leadsLimit: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Lead
```javascript
{
  userId: ObjectId,
  companyName: String,
  industry: String,
  companySize: 'small' | 'medium' | 'large',
  location: String,
  leadScore: Number (0-100),
  reasoning: String,
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'converted',
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Future Enhancements

- [ ] Stripe payment integration
- [ ] Email verification
- [ ] Advanced lead filtering
- [ ] Email notifications
- [ ] Lead export (CSV, PDF)
- [ ] Mobile app (React Native)
- [ ] Webhooks for lead generation
- [ ] Lead scoring algorithms
- [ ] Analytics dashboard
- [ ] Two-factor authentication

## License

MIT License - See LICENSE file for details

## Support

For support, email support@gexcite.com or open an issue on GitHub.

## Credits

Built with React, Node.js, MongoDB, and OpenAI
