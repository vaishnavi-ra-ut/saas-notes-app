import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AllNotes from "./pages/AllNotes";
import NoteEditor from "./pages/NoteEditor";
import { useAuth } from "./contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function App() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Header />
        <main className="page-content">
          <Routes>
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/notes" element={user ? <AllNotes /> : <Navigate to="/login" />} />
            <Route path="/notes/new" element={user ? <NoteEditor /> : <Navigate to="/login" />} />
            <Route path="/notes/:id" element={user ? <NoteEditor /> : <Navigate to="/login" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
