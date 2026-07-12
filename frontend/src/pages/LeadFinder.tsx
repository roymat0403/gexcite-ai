import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LeadFinder: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessType: '',
    whatYouSell: '',
    targetAudience: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('gexcite_token');
      const response = await axios.post(
        'http://localhost:5000/api/leads/generate',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess(`✅ ${response.data.message}`);
      setTimeout(() => {
        navigate('/leads');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error generating leads');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <nav>
        <h1 onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>Gexcite</h1>
        <div>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">Dashboard</button>
          <button onClick={() => navigate('/leads')} className="btn-secondary">My Leads</button>
        </div>
      </nav>

      <div className="form-container">
        <h1 style={{ textAlign: 'center', color: '#1a1a1a', marginBottom: '0.5rem' }}>
          Find Your Next Leads
        </h1>
        <p style={{ textAlign: 'center', color: '#555555', marginBottom: '2rem' }}>
          Tell us about your business and we'll use AI to find qualified leads for you
        </p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="businessType">What type of business do you have?</label>
            <input
              type="text"
              id="businessType"
              name="businessType"
              placeholder="e.g., Software Development, Consulting, E-commerce, Marketing Agency"
              value={formData.businessType}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="whatYouSell">What do you sell/offer?</label>
            <textarea
              id="whatYouSell"
              name="whatYouSell"
              placeholder="Describe your products or services in detail. Be specific about what makes your offering unique."
              value={formData.whatYouSell}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="targetAudience">Who are you looking to sell to?</label>
            <textarea
              id="targetAudience"
              name="targetAudience"
              placeholder="Describe your ideal customer profile - industry, company size, location, challenges they face, etc."
              value={formData.targetAudience}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Generating Leads with AI...' : '🚀 Find Leads with Gexcite AI'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadFinder;