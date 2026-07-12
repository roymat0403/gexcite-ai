import express, { Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';
import User from '../models/User';
import Lead from '../models/Lead';
import auth from '../middleware/auth';

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

interface LeadQuery {
  businessType: string;
  whatYouSell: string;
  targetAudience: string;
}

router.post('/generate', auth, async (req: Request, res: Response) => {
  try {
    const { businessType, whatYouSell, targetAudience } = req.body as LeadQuery;
    const userId = (req as any).user.userId;

    if (!businessType || !whatYouSell || !targetAudience) {
      return res.status(400).json({ message: 'Please provide all required information' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Gexcite user not found' });
    }

    if (user.subscriptionPlan === 'free-trial' && new Date() > user.trialEndsAt!) {
      return res.status(403).json({ 
        message: 'Your Gexcite free trial has expired. Upgrade to continue generating leads.',
        trialExpired: true
      });
    }

    if (user.leadsGenerated >= user.leadsLimit) {
      return res.status(403).json({ 
        message: 'You have reached your Gexcite leads limit. Upgrade your plan for more leads.',
        limitReached: true
      });
    }

    const prompt = `You are Gexcite, an AI lead generation expert. Based on the following business information, provide 15 realistic, high-quality business leads that would be potential customers.

Business Type: ${businessType}
What they sell/offer: ${whatYouSell}
Target Audience/Ideal Customer: ${targetAudience}

For each lead, provide in valid JSON format ONLY (no other text):
{
  "leads": [
    {
      "companyName": "actual company name",
      "industry": "industry type",
      "companySize": "small/medium/large",
      "location": "city, state or country",
      "leadScore": 85,
      "reasoning": "why this is a qualified lead for this business"
    }
  ]
}`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const generatedContent = completion.data.choices[0].message?.content || '{"leads": []}';
    
    let leadsData;
    try {
      leadsData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', generatedContent);
      return res.status(500).json({ message: 'Error parsing Gexcite AI response' });
    }

    if (!leadsData.leads || leadsData.leads.length === 0) {
      return res.status(500).json({ message: 'Gexcite failed to generate leads. Please try again.' });
    }

    const savedLeads = await Lead.insertMany(
      leadsData.leads.map((lead: any) => ({
        userId,
        companyName: lead.companyName,
        industry: lead.industry,
        companySize: lead.companySize,
        location: lead.location,
        leadScore: lead.leadScore || 75,
        reasoning: lead.reasoning,
        source: 'Gexcite AI Generated',
        status: 'new'
      }))
    );

    user.businessType = businessType;
    user.whatYouSell = whatYouSell;
    user.targetAudience = targetAudience;
    user.leadsGenerated += savedLeads.length;
    user.updatedAt = new Date();
    await user.save();

    res.status(201).json({
      message: `Gexcite generated ${savedLeads.length} qualified leads for your business!`,
      leadsCount: savedLeads.length,
      leads: savedLeads,
      userStats: {
        totalLeadsGenerated: user.leadsGenerated,
        leadsLimit: user.leadsLimit
      }
    });
  } catch (error: any) {
    console.error('Gexcite lead generation error:', error);
    if (error.response?.status === 401) {
      return res.status(401).json({ message: 'Invalid OpenAI API key' });
    }
    res.status(500).json({ message: 'Error generating Gexcite leads', error: error.message });
  }
});

router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { status, sort } = req.query;

    let query: any = { userId };
    if (status) {
      query.status = status;
    }

    let sortOrder: any = { createdAt: -1 };
    if (sort === 'score') {
      sortOrder = { leadScore: -1 };
    }

    const leads = await Lead.find(query).sort(sortOrder);
    res.json({
      message: `Retrieved ${leads.length} Gexcite leads`,
      count: leads.length,
      leads
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Gexcite leads', error });
  }
});

router.put('/:leadId', auth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { status, notes, followUpDate } = req.body;

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.leadId, userId },
      { status, notes, followUpDate, updatedAt: new Date() },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ message: 'Gexcite lead not found' });
    }

    res.json({
      message: 'Gexcite lead updated successfully',
      lead
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Gexcite lead', error });
  }
});

router.delete('/:leadId', auth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const lead = await Lead.findOneAndDelete({ _id: req.params.leadId, userId });

    if (!lead) {
      return res.status(404).json({ message: 'Gexcite lead not found' });
    }

    res.json({ message: 'Lead removed from Gexcite' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Gexcite lead', error });
  }
});

router.get('/stats/overview', auth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const stats = await Lead.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
          contacted: { $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] } },
          qualified: { $sum: { $cond: [{ $eq: ['$status', 'qualified'] }, 1, 0] } },
          converted: { $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] } },
          avgScore: { $avg: '$leadScore' }
        }
      }
    ]);

    res.json({
      message: 'Gexcite lead statistics',
      stats: stats[0] || { total: 0, new: 0, contacted: 0, qualified: 0, converted: 0, avgScore: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Gexcite statistics', error });
  }
});

export default router;