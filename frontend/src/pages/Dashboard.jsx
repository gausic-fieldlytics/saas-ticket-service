import React, { useState, useEffect } from 'react';
import { FiPhone, FiMessageSquare, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import AddTicketModal from '../components/AddTicketModal';

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/tickets', {
          headers: { authorization: 'dummy-token' }
      });
      const data = res.data.map(t => ({
          ...t,
          status: t.status.toLowerCase()
      }));
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const renderColumn = (status, title, className, priceTotal) => {
    const columnTickets = tickets.filter(t => t.status === status);
    return (
      <div className="kanban-column">
        <div className={`column-header ${className}`}>
          <span>{title} ({columnTickets.length})</span>
          <span>+</span>
        </div>
        <div style={{ background: className === 'new' ? '#1c71a3' : className === 'waiting' ? '#0b5282' : className === 'progress' ? '#1aaeb3' : '#e68f1c', color: 'white', padding: '10px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {priceTotal}
        </div>
        <div className="column-body">
            {className === 'new' && (
                <div style={{ background: 'rgba(255,255,255,0.4)', padding: '5px', textAlign: 'center', cursor: 'pointer', borderRadius: '4px', marginBottom: '10px', color: 'white' }}>
                    + Quick Deal
                </div>
            )}
          {columnTickets.map(ticket => (
            <div key={ticket.id} className="kanban-card">
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div className="card-title">{ticket.title}</div>
                <div style={{color: '#aaa'}}><FiPhone /> <FiMessageSquare /></div>
              </div>
              <div className="card-subtitle">{ticket.priority || 'Medium'}</div>
              <div className="card-subtitle" style={{color: '#468ee5', marginBottom: '2px'}}>{ticket.client_name || 'Internal'}</div>
              <div className="card-subtitle" style={{fontSize: '0.75em'}}>{ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'Today'}</div>
              <div style={{display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.8rem', marginTop: '10px'}}>
                  <span>Activities</span>
                  <span>+ Schedule</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="kanban-wrapper">
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems:'center', gap: '10px' }}>
                <span style={{fontSize: '1.5rem'}}>≡</span> Bitrix24
            </span>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.85rem' }}>
                find people, documents, ... 🔍
            </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{fontSize: '1.5rem'}}>1:57<small>PM</small></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#ccc' }}></div>
            <span>Admin User ▾</span>
          </div>
        </div>
      </div>

      <div className="secondary-nav">
        <a href="#leads">Leads</a>
        <a href="#deals" className="active">Deals</a>
        <a href="#inventory">Inventory ▾</a>
        <a href="#customers">Customers ▾</a>
        <a href="#sales">Sales ▾</a>
      </div>

      <div className="action-bar">
        <button onClick={() => setIsAddModalOpen(true)} className="btn-primary-custom" style={{backgroundColor: '#bfe238', color: '#333', display: 'flex', alignItems: 'center', gap: '5px', borderRadius: '0', borderRight: '1px solid #aaa'}}>ADD <span style={{fontSize: '0.7em'}}>▼</span></button>
        <div style={{ flex: 1, display: 'flex', background: 'rgba(255,255,255,0.6)', padding: '5px 10px', alignItems: 'center', border: '1px solid #c9d8e5' }}>
            <span style={{ background: '#38a5e8', color: 'white', padding: '2px 8px', borderRadius: '2px', marginRight: '10px', fontSize: '0.8rem' }}>Deals in progress x</span>
            <input type="text" placeholder="+ search" style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }} />
        </div>
        <button className="btn-primary-custom" style={{backgroundColor: '#4092d0', color: 'white', padding: '5px 15px'}}>⚙</button>
      </div>

      <div style={{padding: '5px 20px', background: 'rgba(255,255,255,0.1)', color: '#333', borderBottom: '1px solid #ccc', fontSize: '0.85rem', display: 'flex', gap: '15px'}}>
          <span>Kanban</span>
          <span>List</span>
          <span>Calendar</span>
          <span>Deals: {tickets.length} without activities</span>
      </div>

      <div className="kanban-board" style={{paddingTop: '15px'}}>
        {renderColumn('open', 'New', 'new', '$1,395')}
        {renderColumn('in progress', 'In progress', 'progress', '$2,305')}
        {renderColumn('testing', 'Waiting for details', 'waiting', '$4,175')}
        {renderColumn('closed', 'Final Invoice', 'closed', '$1,835')}
      </div>
      
      <AddTicketModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdded={fetchTickets} 
      />
    </div>
  );
}

export default Dashboard;