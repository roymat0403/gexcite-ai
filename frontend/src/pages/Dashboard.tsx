import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionPlan: string;
  leadsGenerated: number;
  trialEndsAt?: string;
}

interface Stats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  daysRemaining: number;
}

const Dashboard: React.FC<{ setIsAuthenticated: (val: boolean) => void }> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('gexcite_token');
    const userData = localStorage.getItem('gexcite_user');
    
    if (!token) {
      navigate('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('gexcite_token');
      const response = await axios.get('http://localhost:5000/api/leads/stats/overview', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gexcite_token');
    localStorage.removeItem('gexcite_user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav>
        <h1 onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>Gexcite</h1>
        <div>
          <button onClick={() => navigate('/lead-finder')} className="btn-secondary">Find Leads</button>
          <button onClick={() => navigate('/leads')} className="btn-secondary">My Leads</button>
          <button onClick={() => navigate('/profile')} className="btn-secondary">Profile</button>
          <button onClick={handleLogout} className="btn-primary">Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="dashboard-header">
          <h2>Welcome back, {user?.firstName}! 👋</h2>
          <p>Your AI-powered lead generation dashboard</p>
        </div>

        {user?.subscriptionPlan === 'free-trial' && (
          <div className="info-message">
            <strong>Free Trial Active:</strong> You have {Math.ceil((new Date(user.trialEndsAt || '').getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining. <button onClick={() => navigate('/pricing')} className="btn-primary" style={{ marginLeft: '1rem' }}>Upgrade Now</button>
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats?.totalLeads || 0}</div>
            <div className="stat-label">Total Leads</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats?.newLeads || 0}</div>
            <div className="stat-label">New Leads</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats?.contactedLeads || 0}</div>
            <div className="stat-label">Contacted</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{user?.subscriptionPlan === 'free-trial' ? '14' : '∞'}</div>
            <div className="stat-label">Days Left</div>
          </div>
        </div>

        <div className="card">
          <h2>Get Started</h2>
          <p style={{ marginBottom: '1rem' }}>Ready to find new business leads? Use our AI-powered lead finder to discover qualified prospects.</p>
          <button onClick={() => navigate('/lead-finder')} className="btn-primary">Start Finding Leads</button>
        </div>

        <div className="card">
          <h2>How Gexcite Works</h2>
          <ol style={{ marginLeft: '1.5rem', lineHeight: '1.8', color: '#555555' }}>
            <li><strong>Describe Your Business</strong> - Tell us about your company and what you sell</li>
            <li><strong>Define Your Target</strong> - Who is your ideal customer?</li>
            <li><strong>Get AI-Generated Leads</strong> - Our AI analyzes and finds real leads for you</li>
            <li><strong>Track & Convert</strong> - Manage leads and track your progress to sales</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;