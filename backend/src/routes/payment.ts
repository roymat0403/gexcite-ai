import express, { Request, Response } from 'express';
import User from '../models/User';
import auth from '../middleware/auth';

const router = express.Router();

const PLANS = {
  starter: {
    name: 'Starter',
    price: 29,
    leads: 100,
    features: ['100 leads/month', 'Basic lead management', 'Email support']
  },
  pro: {
    name: 'Pro',
    price: 99,
    leads: 500,
    features: ['500 leads/month', 'Advanced filtering', 'Lead scoring', 'API access']
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    leads: -1,
    features: ['Unlimited leads', 'Custom AI models', 'Dedicated support', 'API & Webhooks']
  }
};

router.get('/plans', (req: Request, res: Response) => {
  res.json({
    message: 'Gexcite subscription plans',
    plans: PLANS
  });
});

router.post('/upgrade', auth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { planName } = req.body;

    if (!planName || !PLANS[planName as keyof typeof PLANS]) {
      return res.status(400).json({ message: 'Invalid Gexcite plan' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Gexcite user not found' });
    }

    const plan = PLANS[planName as keyof typeof PLANS];
    const renewDate = new Date();
    renewDate.setMonth(renewDate.getMonth() + 1);

    user.subscriptionPlan = planName;
    user.leadsLimit = plan.leads === -1 ? 999999 : plan.leads;
    user.subscriptionStartDate = new Date();
    user.subscriptionRenewDate = renewDate;
    user.isActive = true;
    await user.save();

    res.json({
      message: `Successfully upgraded to Gexcite ${plan.name} plan!`,
      subscription: {
        plan: planName,
        leadsLimit: user.leadsLimit,
        startDate: user.subscriptionStartDate,
        renewDate: user.subscriptionRenewDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error upgrading Gexcite subscription', error });
  }
});

router.post('/cancel', auth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Gexcite user not found' });
    }

    user.subscriptionPlan = 'free-trial';
    user.leadsLimit = 50;
    user.isActive = true;
    user.trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await user.save();

    res.json({ message: 'Gexcite subscription cancelled. You can still use our free trial.' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling Gexcite subscription', error });
  }
});

export default router;