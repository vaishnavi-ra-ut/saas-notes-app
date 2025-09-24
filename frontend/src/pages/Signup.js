import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create account</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <label>Email</label>
          <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <label>Password</label>
          <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <button className="btn primary" type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
        </form>
      </div>
    </div>
  );
}
