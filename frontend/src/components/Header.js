import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="search">
        <input placeholder="Search notes..." />
      </div>
      <div className="header-actions">
        <button className="btn ghost" onClick={() => navigate("/notes/new")}>New Note</button>
      </div>
    </header>
  );
}
