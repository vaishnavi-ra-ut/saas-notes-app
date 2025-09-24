    import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteItem from '../components/NoteItem';
import NoteForm from '../components/NoteForm';

export default function Notes() {
  const token = localStorage.getItem('token');
  const [notes, setNotes] = useState([]);
  const [tenantPlan, setTenantPlan] = useState('free');

  const fetchNotes = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API}/notes`, { headers: { Authorization: `Bearer ${token}` } });
    setNotes(res.data);

    // fetch tenant plan (optional, can include in JWT payload)
    const decoded = JSON.parse(atob(token.split('.')[1]));
    setTenantPlan(decoded.plan || 'free');
  };

  const handleUpgrade = async () => {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    await axios.post(`${process.env.REACT_APP_API}/tenants/${decoded.tenant}/upgrade`, {}, { headers: { Authorization: `Bearer ${token}` } });
    alert('Upgraded to Pro!');
    setTenantPlan('pro');
    fetchNotes();
  };

  useEffect(() => { fetchNotes(); }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Notes</h2>
      {tenantPlan === 'free' && notes.length >= 3 && (
        <button onClick={handleUpgrade}>Upgrade to Pro</button>
      )}
      <NoteForm token={token} refresh={fetchNotes} />
      {notes.map(n => <NoteItem key={n._id} note={n} token={token} refresh={fetchNotes} />)}
    </div>
  );
}
