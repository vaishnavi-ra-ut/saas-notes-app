import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState({ total: 0, pinned: 0, thisWeek: 0, team: 0 });

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
      setStats({
        total: res.data.length,
        pinned: res.data.filter(n => n.pinned).length,
        thisWeek: res.data.filter(n => {
          const d = new Date(n.createdAt);
          return (Date.now() - d.getTime()) < 7*24*3600*1000;
        }).length,
        team: res.data.filter(n => n.team).length
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-card welcome">
        <div className="tag">Welcome</div>
        <h1>Good to see you back</h1>
        <p>Here's what's happening across your Personal workspace.</p>

        <div className="small-cards">
          <div className="stat-card">
            <div className="stat-title">Total Notes</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Pinned</div>
            <div className="stat-value">{stats.pinned}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">This Week</div>
            <div className="stat-value">{stats.thisWeek}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Team Notes</div>
            <div className="stat-value">{stats.team}</div>
          </div>
        </div>
      </div>

      <section style={{marginTop: 20}}>
        <div className="section-header">
          <h3>Recent Notes</h3>
          <Link to="/notes">View all</Link>
        </div>

        <div className="note-grid">
          {notes.slice(0,4).map(n => (
            <article key={n._id} className="note-card">
              <h4>{n.title || "Untitled"}</h4>
              <p>{n.content?.slice(0,120)}</p>
              <div className="note-actions">
                <Link to={`/notes/${n._id}`} className="link">Open</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
