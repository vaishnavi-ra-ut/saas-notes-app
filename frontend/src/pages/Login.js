import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      // Helpful dev fallback: if backend lacks /auth/login, show hint
      alert(err.response?.data?.msg || "Login failed. If your backend doesn't have /auth/login, use /signup first or add a login route.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <label>Password</label>
          <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <button className="btn primary" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        </form>
        <div style={{marginTop: 12, fontSize: 13, color:"#666"}}>
          Tip: Demo accounts pre-seeded in backend: <code>admin@acme.test / password</code>
        </div>
      </div>
    </div>
  );
}
