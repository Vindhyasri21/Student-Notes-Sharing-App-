import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signupUser } from "../services/api";
import { saveAuth } from "../utils/auth";
import "./auth.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    try {
      const res = await signupUser({ name, email, password });
      saveAuth({ token: res.data.token, user: res.data.user });
      alert(res.data.message);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-orb auth-orb-one"></div>
      <div className="auth-orb auth-orb-two"></div>

      <div className="auth-layout">
        <section className="auth-showcase">
          <div className="auth-brand">
            <span className="brand-badge">Create Your Academic Space</span>
            <h1>Build your own note library with a polished study dashboard.</h1>
            <p>
              Sign up to keep your uploads, subjects, and revision material neatly
              arranged inside one professional workspace.
            </p>
          </div>

          <div className="showcase-panel">
            <div className="showcase-card">
              <span className="showcase-label">Private account</span>
              <strong>Track your own uploads</strong>
              <p>Keep your files separate and easy to manage anytime you log in.</p>
            </div>

            <div className="showcase-card">
              <span className="showcase-label">Clean workflow</span>
              <strong>Ready for class use</strong>
              <p>Upload by title, subject, and topic so everything stays sorted.</p>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-panel-header">
            <span className="panel-kicker">Get started</span>
            <h2>Create your account</h2>
            <p>Set up your account and enter your dashboard in one step.</p>
          </div>

          <div className="auth-form">
            <label className="field">
              <span>Full name</span>
              <input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

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
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button className="primary-btn" onClick={signup}>
              Create Account
            </button>
          </div>

          <p className="switch-text">
            Already have an account?
            <span onClick={() => navigate("/")}> Login here</span>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Signup;
