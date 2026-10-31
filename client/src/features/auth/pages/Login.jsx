import { Link,useNavigate } from "react-router";
import "../pages/auth.style.scss";
import { useAuth } from "../hooks/useAuth.js";
import { useState } from "react";
import Brand from "../../interview/components/Brand.jsx";
const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await handleLogin({ email, password });
      navigate("/");
    } catch (loginError) {
      setError(loginError.response?.data?.message || "We couldn’t sign you in. Check your details and try again.");
    }
  };

  return (
    <main className="auth-page">
      <header className="auth-topbar">
        <Brand />
        <div className="topbar-action">
          <span>New to Forma?</span>
          <Link to="/register">
            Create account <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>

      <section className="auth-layout">
        <div className="auth-intro">
          <p className="eyebrow">RESUME & INTERVIEW PREPARATION</p>
          <h1>
            Prepare for your
            <br />
            next <em>role.</em>
          </h1>
          <p className="intro-copy">
            Use your resume and a target job description to build role-specific interview questions, skill insights, a study roadmap, and a tailored resume.
          </p>
          <p className="intro-note">
            “A clear plan starts with the experience you already have.”
            <br />
            Bring your experience. Prepare for the role.
          </p>
        </div>

        <div className="auth-card">
          <div className="card-heading">
            <p className="eyebrow">WELCOME BACK</p>
            <h2>Sign in to Forma</h2>
            <p>Return to saved preparation or build a resume for your next role.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="label-row">
              <label htmlFor="login-password">Password</label>
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"} <span aria-hidden="true">→</span>
            </button>
          </form>
          <p className="card-footnote">Your saved role preparations are available whenever you sign in.</p>
        </div>
      </section>
      <footer className="auth-footer">
        <span>Forma · Resume &amp; interview prep</span>
        <span>Preparation built around your experience</span>
      </footer>
    </main>
  );
};

export default Login;
