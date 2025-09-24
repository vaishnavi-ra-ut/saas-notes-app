import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) loadNote();
  }, [id]);

  async function loadNote() {
    try {
      const res = await api.get(`/notes/${id}`);
      setNote(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSave() {
    setLoading(true);
    try {
      if (id) {
        await api.put(`/notes/${id}`, note);
      } else {
        const res = await api.post("/notes", note);
        navigate(`/notes/${res.data._id}`);
        return;
      }
      navigate("/notes");
    } catch (err) {
      alert(err.response?.data?.error || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="editor">
      <input className="title" placeholder="Title" value={note.title} onChange={e => setNote({...note, title: e.target.value})} />
      <textarea className="content" placeholder="Write your note..." value={note.content} onChange={e => setNote({...note, content: e.target.value})} />
      <div className="editor-actions">
        <button className="btn subtle" onClick={() => navigate(-1)}>Cancel</button>
        <button className="btn primary" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save"}</button>
      </div>
    </div>
  );
}
