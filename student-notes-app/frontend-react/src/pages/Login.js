import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/api";
import { saveAuth } from "../utils/auth";
import "./auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await loginUser({ email, password });

      if (res.data.token) {
        saveAuth({ token: res.data.token, user: res.data.user });
        navigate("/dashboard");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Server not connected");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-orb auth-orb-one"></div>
      <div className="auth-orb auth-orb-two"></div>

      <div className="auth-layout">
        <section className="auth-showcase">
          <div className="auth-brand">
            <span className="brand-badge">Student Notes Workspace</span>
            <h1>Organize notes, uploads, and study material in one calm place.</h1>
            <p>
              A focused academic dashboard for managing class notes with better
              visibility, faster access, and a cleaner workflow.
            </p>
          </div>

          <div className="showcase-panel">
            <div className="showcase-card">
              <span className="showcase-label">Why students use it</span>
              <strong>Quick uploads</strong>
              <p>Store PDFs, assignments, and topic-wise notes without clutter.</p>
            </div>

            <div className="showcase-card">
              <span className="showcase-label">Built for daily use</span>
              <strong>Personal dashboard</strong>
              <p>See your uploads, review subjects, and keep everything easy to find.</p>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-panel-header">
            <span className="panel-kicker">Welcome back</span>
            <h2>Sign in to NoteMate</h2>
            <p>Enter your account details to continue to your workspace.</p>
          </div>

          <div className="auth-form">
            <label className="field">
              <span>Email address</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button className="primary-btn" onClick={login}>
              Login
            </button>
          </div>

          <p className="switch-text">
            New here?
            <span onClick={() => navigate("/signup")}> Create an account</span>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;
