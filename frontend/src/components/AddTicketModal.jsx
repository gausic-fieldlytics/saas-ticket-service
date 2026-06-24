import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddTicketModal({ isOpen, onClose, onAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    application_id: '',
    client_id: '',
    type: 'Support'
  });
  const [applications, setApplications] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (isOpen) {
      axios.get('http://localhost:5001/api/master/applications', { headers: { authorization: 'dummy-token' } })
        .then(res => setApplications(res.data)).catch(console.error);
      axios.get('http://localhost:5001/api/master/clients', { headers: { authorization: 'dummy-token' } })
        .then(res => setClients(res.data)).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/tickets', formData, {
        headers: { authorization: 'dummy-token' }
      });
      onAdded();
      onClose();
    } catch (error) {
      console.error('Error adding ticket', error);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '500px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Add New Deal / Ticket</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Title</label>
            <input type="text" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
            <textarea style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', height: '80px' }} 
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Application</label>
              <select style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
                value={formData.application_id} onChange={e => setFormData({...formData, application_id: e.target.value})} required>
                <option value="">Select App</option>
                {applications.map(app => <option key={app.id} value={app.id}>{app.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Client</label>
              <select style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
                value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} required>
                <option value="">Select Client</option>
                {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Type</label>
              <select style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="Support">Support</option>
                <option value="Development">Development</option>
                <option value="Change Request">Change Request</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Priority</label>
              <select style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
                value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
          <button type="submit" style={{ background: '#bfe238', color: '#333', border: 'none', padding: '10px 20px', width: '100%', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            Save Deal
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTicketModal;
