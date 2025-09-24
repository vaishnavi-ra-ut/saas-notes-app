import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo-grad" />
        <div>
          <div className="brand-title">Noteglow</div>
          <div className="brand-sub">Notes for pros</div>
        </div>
      </div>

      <div className="workspace-card">
        <div className="workspace-title">Personal</div>
        <div className="workspace-sub">Switch workspace</div>
      </div>

      <nav className="side-nav">
        <NavLink to="/" end className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>Dashboard</NavLink>
        <NavLink to="/notes" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>All Notes</NavLink>
        <NavLink to="/settings" className="nav-item">Settings</NavLink>
      </nav>

      <button className="btn new-note" onClick={() => navigate("/notes/new")}>New Note</button>

      <div className="me-card">
        <div className="me-avatar" />
        <div>
          <div className="me-name">{user?.name || "Guest"}</div>
          <div className="me-role">Product Designer</div>
        </div>
      </div>

      <div style={{padding: 12}}>
        {user ? (
          <button className="btn subtle" onClick={() => { logout(); navigate("/login"); }}>Logout</button>
        ) : (
          <div className="login-links">
            <NavLink to="/login" className="link">Login</NavLink> · <NavLink to="/signup" className="link">Sign up</NavLink>
          </div>
        )}
      </div>
    </aside>
  );
}
