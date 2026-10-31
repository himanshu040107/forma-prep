import { Link,useNavigate } from "react-router";
import "../pages/auth.style.scss";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import Brand from "../../interview/components/Brand.jsx";
const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const {loading,handleRegister}=useAuth();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await handleRegister({ email, password, username });
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We couldn’t create your account. Please try again.");
    }
  };

  return (
    <main className="auth-page">
      <header className="auth-topbar">
        <Brand />
        <div className="topbar-action">
          <span>Already have an account?</span>
          <Link to="/login">
            Sign in <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>

      <section className="auth-layout register-layout">
        <div className="auth-intro">
          <p className="eyebrow">START WITH YOUR EXPERIENCE</p>
          <h1>
            A clearer plan
            <br />
            for your next <em>role.</em>
          </h1>
          <p className="intro-copy">
            Create role-specific interview practice from your resume and a job description. Review your role match, explore skill gaps, and build a tailored resume.
          </p>
          <p className="intro-note">
            “Your experience is the starting point. Your next step is yours to shape.”
            <br />
            Resume and interview preparation in one workspace.
          </p>
        </div>

        <div className="auth-card">
          <div className="card-heading">
            <p className="eyebrow">LET’S GET YOU STARTED</p>
            <h2>Create your account</h2>
            <p>Save your role-specific preparation and return to it anytime.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="register-name">Your name</label>
            <input
              id="register-name"
              name="username"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="register-email">Email address</label>
            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="register-password">Create a password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength="8"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create account"} <span aria-hidden="true">→</span>
            </button>
          </form>
          <p className="card-footnote">Your account keeps your saved interview plans together.</p>
        </div>
      </section>
      <footer className="auth-footer">
        <span>Forma · Resume &amp; interview prep</span>
        <span>Preparation built around your experience</span>
      </footer>
    </main>
  );
};

export default Register;
