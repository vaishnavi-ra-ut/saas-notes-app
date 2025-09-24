import React from 'react';
import axios from 'axios';

export default function NoteItem({ note, token, refresh }) {
  const handleDelete = async () => {
    await axios.delete(`${process.env.REACT_APP_API}/notes/${note._id}`, { headers: { Authorization: `Bearer ${token}` } });
    refresh();
  };

  return (
    <div style={{ border: '1px solid #ccc', margin: '0.5rem', padding: '0.5rem' }}>
      <h4>{note.title}</h4>
      <p>{note.content}</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
