import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function AllNotes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete note?")) return;
    await api.delete(`/notes/${id}`);
    setNotes(notes.filter(n => n._id !== id));
  }

  return (
    <div>
      <div className="section-header">
        <h2>All Notes</h2>
        <Link to="/notes/new" className="btn small">New Note</Link>
      </div>

      <div className="note-list">
        {notes.length === 0 && <div className="muted">No notes yet</div>}
        {notes.map(n => (
          <div className="note-row" key={n._id}>
            <div>
              <strong>{n.title || "Untitled"}</strong>
              <div className="muted">{(n.content || "").slice(0,160)}</div>
            </div>

            <div className="row-actions">
              <Link to={`/notes/${n._id}`} className="link">Open</Link>
              <Link to={`/notes/${n._id}`} className="btn ghost small">Edit</Link>
              <button className="btn subtle small" onClick={() => handleDelete(n._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
