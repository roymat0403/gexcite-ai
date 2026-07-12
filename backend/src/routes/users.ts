import express, { Request, Response } from 'express';
import User from '../models/User';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/profile', auth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Gexcite user not found' });
    }

    const daysLeft = user.subscriptionPlan === 'free-trial' 
      ? Math.ceil((user.trialEndsAt!.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    res.json({
      message: 'Gexcite profile retrieved',
      user,
      trialDaysRemaining: daysLeft
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Gexcite profile', error });
  }
});

router.put('/profile', auth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { firstName, lastName, businessName, businessType, whatYouSell, targetAudience } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        businessName,
        businessType,
        whatYouSell,
        targetAudience,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Gexcite profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Gexcite profile', error });
  }
});

router.get('/subscription', auth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await User.findById(userId).select('subscriptionPlan trialEndsAt subscriptionStartDate subscriptionRenewDate leadsGenerated leadsLimit');

    if (!user) {
      return res.status(404).json({ message: 'Gexcite user not found' });
    }

    const subscriptionInfo: any = {
      plan: user.subscriptionPlan,
      leadsGenerated: user.leadsGenerated,
      leadsLimit: user.leadsLimit,
      leadsRemaining: user.leadsLimit - user.leadsGenerated
    };

    if (user.subscriptionPlan === 'free-trial') {
      subscriptionInfo.trialEndsAt = user.trialEndsAt;
      subscriptionInfo.daysRemaining = Math.ceil((user.trialEndsAt!.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    } else {
      subscriptionInfo.renewDate = user.subscriptionRenewDate;
    }

    res.json({
      message: 'Gexcite subscription details',
      subscription: subscriptionInfo
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Gexcite subscription', error });
  }
});

export default router;