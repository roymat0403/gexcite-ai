import React from 'react';
import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('gexcite_token');

  const plans = [
    {
      name: 'Free Trial',
      price: 'Free',
      period: '14 days',
      leads: 50,
      features: [
        '50 leads per trial',
        'AI lead generation',
        'Basic lead management',
        'Email support'
      ],
      primary: false
    },
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      leads: 100,
      features: [
        '100 leads per month',
        'AI lead generation',
        'Lead scoring',
        'Status tracking',
        'Email support'
      ],
      primary: false
    },
    {
      name: 'Pro',
      price: '$99',
      period: '/month',
      leads: 500,
      features: [
        '500 leads per month',
        'Advanced AI filtering',
        'Lead scoring & analytics',
        'Custom search criteria',
        'API access',
        'Priority email support'
      ],
      primary: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      leads: -1,
      features: [
        'Unlimited leads',
        'Custom AI models',
        'Dedicated account manager',
        'API & webhooks',
        '24/7 phone support',
        'SLA guarantee'
      ],
      primary: false
    }
  ];

  return (
    <div className="dashboard-container">
      <nav>
        <h1 style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Gexcite</h1>
        <div>
          {token ? (
            <>
              <button onClick={() => navigate('/dashboard')} className="btn-secondary">Dashboard</button>
              <button onClick={() => navigate('/profile')} className="btn-secondary">Profile</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-secondary">Login</button>
              <button onClick={() => navigate('/signup')} className="btn-primary">Sign Up</button>
            </>
          )}
        </div>
      </nav>

      <div className="container">
        <div className="dashboard-header">
          <h2>Simple, Transparent Pricing</h2>
          <p>Choose the perfect plan for your lead generation needs</p>
        </div>

        <div className="leads-grid">
          {plans.map((plan) => (
            <div key={plan.name} className="card" style={{ 
              border: plan.primary ? '2px solid #4CAF50' : '1px solid #ddd',
              transform: plan.primary ? 'scale(1.05)' : 'scale(1)'
            }}>
              {plan.primary && <div style={{ color: '#4CAF50', fontWeight: 'bold', marginBottom: '0.5rem' }}>★ POPULAR</div>}
              <h3 style={{ marginBottom: '0.5rem' }}>{plan.name}</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50', marginBottom: '0.5rem' }}>
                {plan.price}
              </div>
              <div style={{ color: '#555555', marginBottom: '1rem' }}>{plan.period}</div>
              <div style={{ backgroundColor: '#f5f5f5', padding: '0.5rem 1rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>
                <strong>{plan.leads === -1 ? 'Unlimited' : `${plan.leads} Leads`}</strong>
              </div>
              <ul style={{ marginBottom: '1.5rem', lineHeight: '1.8', color: '#555555', listStyle: 'none', padding: 0 }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>✓ {feature}</li>
                ))}
              </ul>
              <button 
                onClick={() => {
                  if (token) {
                    alert(`Upgrade to ${plan.name} - This would process payment via Stripe`);
                  } else {
                    navigate('/signup');
                  }
                }}
                className={plan.primary ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%' }}
              >
                {token ? `Upgrade to ${plan.name}` : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: '3rem', textAlign: 'center' }}>
          <h3>Have Questions?</h3>
          <p style={{ marginBottom: '1rem' }}>Interested in a custom enterprise plan? Contact our sales team.</p>
          <p style={{ color: '#4CAF50', fontWeight: 'bold' }}>sales@gexcite.com</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;