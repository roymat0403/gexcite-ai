import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  businessType: string;
  whatYouSell: string;
  targetAudience: string;
  subscriptionPlan: string;
  leadsGenerated: number;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('gexcite_token');
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data.user);
      setFormData(response.data.user);
    } catch (error) {
      setMessage('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('gexcite_token');
      await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setSaving(false);
    }
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
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">Dashboard</button>
          <button onClick={() => navigate('/pricing')} className="btn-secondary">Upgrade</button>
        </div>
      </nav>

      <div className="form-container">
        <h1 style={{ textAlign: 'center', color: '#1a1a1a', marginBottom: '2rem' }}>Your Gexcite Profile</h1>

        {message && (
          message.includes('Error') 
            ? <div className="error-message">{message}</div>
            : <div className="success-message">{message}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              disabled
              style={{ backgroundColor: '#f5f5f5' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="businessName">Business Name</label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="businessType">Business Type</label>
            <input
              type="text"
              id="businessType"
              name="businessType"
              value={formData.businessType || ''}
              onChange={handleChange}
              placeholder="e.g., SaaS, Consulting, E-commerce"
            />
          </div>

          <div className="form-group">
            <label htmlFor="whatYouSell">What You Sell</label>
            <textarea
              id="whatYouSell"
              name="whatYouSell"
              value={formData.whatYouSell || ''}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="targetAudience">Target Audience</label>
            <textarea
              id="targetAudience"
              name="targetAudience"
              value={formData.targetAudience || ''}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="card" style={{ backgroundColor: '#f9f9f9', marginBottom: '1.5rem' }}>
            <h3>Account Information</h3>
            <p><strong>Plan:</strong> {profile?.subscriptionPlan}</p>
            <p><strong>Leads Generated:</strong> {profile?.leadsGenerated}</p>
          </div>

          <button type="submit" disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;