import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Lead {
  _id: string;
  companyName: string;
  industry: string;
  companySize: string;
  location: string;
  leadScore: number;
  status: string;
  reasoning: string;
}

const Leads: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('gexcite_token');
      const response = await axios.get('http://localhost:5000/api/leads', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLeads(response.data.leads || []);
    } catch (err) {
      setError('Error loading leads');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const token = localStorage.getItem('gexcite_token');
      await axios.put(
        `http://localhost:5000/api/leads/${leadId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchLeads();
    } catch (err) {
      setError('Error updating lead');
    }
  };

  const deleteLead = async (leadId: string) => {
    try {
      const token = localStorage.getItem('gexcite_token');
      await axios.delete(
        `http://localhost:5000/api/leads/${leadId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchLeads();
    } catch (err) {
      setError('Error deleting lead');
    }
  };

  const filteredLeads = filterStatus === 'all' 
    ? leads 
    : leads.filter(lead => lead.status === filterStatus);

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
          <button onClick={() => navigate('/lead-finder')} className="btn-secondary">Find More Leads</button>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">Dashboard</button>
        </div>
      </nav>

      <div className="container">
        <div className="dashboard-header">
          <h2>Your Gexcite Leads</h2>
          <p>{filteredLeads.length} leads found</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {leads.length === 0 ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <p>No leads yet. Start generating leads with Gexcite AI!</p>
            <button onClick={() => navigate('/lead-finder')} className="btn-primary">Find Leads Now</button>
          </div>
        ) : (
          <>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <label style={{ marginRight: '1rem', color: '#1a1a1a' }}>Filter by Status:</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ width: 'auto', padding: '0.5rem' }}
              >
                <option value="all">All Leads</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
              </select>
            </div>

            <div className="leads-grid">
              {filteredLeads.map(lead => (
                <div key={lead._id} className="lead-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <h3 style={{ flex: 1 }}>{lead.companyName}</h3>
                    <span className={`status-badge status-${lead.status}`}>{lead.status}</span>
                  </div>
                  <p><strong>Industry:</strong> {lead.industry}</p>
                  <p><strong>Company Size:</strong> {lead.companySize}</p>
                  <p><strong>Location:</strong> {lead.location}</p>
                  <p><strong>Lead Score:</strong> <span className="lead-score">{lead.leadScore}/100</span></p>
                  <p><strong>Why:</strong> {lead.reasoning}</p>

                  <div className="lead-actions">
                    {lead.status !== 'contacted' && (
                      <button
                        onClick={() => updateLeadStatus(lead._id, 'contacted')}
                        className="btn-primary"
                      >
                        Mark Contacted
                      </button>
                    )}
                    {lead.status !== 'qualified' && (
                      <button
                        onClick={() => updateLeadStatus(lead._id, 'qualified')}
                        className="btn-secondary"
                      >
                        Qualified
                      </button>
                    )}
                    {lead.status !== 'converted' && (
                      <button
                        onClick={() => updateLeadStatus(lead._id, 'converted')}
                        className="btn-primary"
                      >
                        Converted
                      </button>
                    )}
                    <button
                      onClick={() => deleteLead(lead._id)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leads;