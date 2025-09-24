import React, { useState } from 'react';
import axios from 'axios';

export default function NoteForm({ token, refresh }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API}/notes`, { title, content }, { headers: { Authorization: `Bearer ${token}` } });
      setTitle(''); setContent(''); setError('');
      refresh();
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating note');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} /><br/>
      <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} /><br/>
      <button type="submit">Add Note</button>
      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  );
}
