import React, { useState } from "react";
import axios from "axios";
import "./App.css";

// Set the backend URL
const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
      const endpoint = isLogin ? "login" : "register";
      const res = await axios.post(`${API_BASE}/${endpoint}`, form, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage(res?.data?.message || "Success");
      setSuccess(true);
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      setMessage(serverMsg || err.message || "An unexpected error occurred");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <div className="brand">📊 Digital Marketing Campaign Tracker</div>
        <h2 className="title">{isLogin ? "User Login" : "User Registration"}</h2>

        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            autoFocus
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button className="btn" type="submit" disabled={loading}>
            {loading ? (isLogin ? "Signing in..." : "Registering...") : (isLogin ? "Sign In" : "Register")}
          </button>
        </form>

        {message && (
          <div className={`message ${success ? "success" : "error"}`}>{message}</div>
        )}

        <button
          className="link-btn"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
            setSuccess(false);
          }}
        >
          {isLogin ? "Create a new account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

export default App;
