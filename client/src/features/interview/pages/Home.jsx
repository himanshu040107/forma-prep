import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import {useInterview} from "../hooks/useInterview.js";
import { useAuth } from "../../auth/hooks/useAuth.js";
import Brand from "../components/Brand.jsx";
import "./home.style.scss";

const Home = () => {
  const { user, handleLogout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInput = useRef(null);
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { loading, reports, generateReport, fetchAllReports, removeReport } = useInterview();
  const [reportsLoading, setReportsLoading] = useState(true);
  const [deletingReportId, setDeletingReportId] = useState(null);
  const [reportsError, setReportsError] = useState("");
  const [reportToDelete, setReportToDelete] = useState(null);

  useEffect(() => {
    fetchAllReports()
      .catch((requestError) => console.error("Could not load saved interview plans:", requestError))
      .finally(() => setReportsLoading(false));
  }, []);

  useEffect(() => {
    if (!reportToDelete) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && !deletingReportId) setReportToDelete(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [reportToDelete, deletingReportId]);

  const confirmDeleteReport = async () => {
    if (!reportToDelete) return;
    setDeletingReportId(reportToDelete._id);
    setReportsError("");
    try {
      await removeReport(reportToDelete._id);
      setReportToDelete(null);
    } catch (requestError) {
      setReportsError(requestError.response?.data?.message || "Could not remove this interview plan. Please try again.");
    } finally {
      setDeletingReportId(null);
    }
  };

  const submitReport = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    
    const resumeFile=fileInput.current?.files?.[0];
    if (!resumeFile) {
      setError("Upload a PDF resume to continue.");
      setSubmitting(false);
      return;
    }
    if(loading){
      setError("Please wait, your previous request is still being processed.");
      setSubmitting(false);
      return;
    }
    try {
      const data = await generateReport({
        resume: resumeFile,
        jobDescription,
        selfDescription,
      });
      if (!data?._id) {
        throw new Error("Your preparation was created, but we couldn’t open it. Please try again.");
      }
      navigate(`/interview/${data._id}`, { state: { report: data } });
    } catch (requestError) {
      const message = requestError.response?.data?.message
        || requestError.message
        || "We couldn’t create your role preparation. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const signOut = async () => {
    try {
      await handleLogout();
      navigate("/login");
    } catch {
      setError("We couldn’t sign you out. Please try again.");
    }
  };

  return (
    <main className="interview-home">
      <header className="interview-topbar">
        <Brand />
        <nav className="interview-nav" aria-label="Main navigation">
          <a className="nav-current" href="#create-report">Resume & interview prep</a>
          <a href="#previous-reports">Saved plans</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <div className="interview-user">
          <span className="user-greeting">Hi, {user?.username || "there"}</span>
          <button type="button" onClick={signOut} disabled={authLoading}>Sign out <span aria-hidden="true">↗</span></button>
        </div>
      </header>

      <section className="interview-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> RESUME & INTERVIEW PREP, BUILT AROUND YOU</p>
          <h1>A stronger resume.<br />A sharper <em>interview.</em></h1>
          <p className="hero-description">
            Turn your experience and target role into a tailored resume and practical interview preparation, all in one place.
          </p>
          <a className="hero-link" href="#create-report">Prepare for a role <span aria-hidden="true">↓</span></a>
        </div>
        <aside className="hero-note" id="how-it-works">
          <span className="note-index">ONE ROLE. A CLEARER PLAN.</span>
          <div className="note-rule" />
          <p>Start with your experience.<br />See what the role asks for.<br /><em>Prepare your next move.</em></p>
          <div className="note-stamp" aria-hidden="true">f.</div>
        </aside>
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
      </section>

      <section className="previous-reports" id="previous-reports" aria-labelledby="previous-reports-title">
        <div className="previous-reports-heading">
          <div>
            <p className="eyebrow">YOUR CAREER WORKSPACE</p>
            <h2 id="previous-reports-title">Saved interview plans</h2>
            <p>Return to role-specific questions, skill insights, and preparation roadmaps.</p>
          </div>
          <span className="report-count">{reports.length} {reports.length === 1 ? "plan" : "plans"}</span>
        </div>
        {reportsLoading ? (
          <p className="previous-reports-empty">Loading your saved interview plans…</p>
        ) : reports.length ? (
          <div className="previous-reports-grid">
            {reports.map((savedReport) => (
              <article className="previous-report-card" key={savedReport._id}>
                <Link className="previous-report-link" to={`/interview/${savedReport._id}`}>
                  <span className="previous-report-label">ROLE PREPARATION</span>
                  <strong>{savedReport.title || "Interview preparation"}</strong>
                  <span className="previous-report-score">{savedReport.matchScore != null ? <>Profile match <b>{savedReport.matchScore}/100</b></> : "Questions and preparation roadmap"}</span>
                  <span className="previous-report-open">View preparation <span aria-hidden="true">→</span></span>
                </Link>
                <button className="previous-report-delete" type="button" onClick={() => setReportToDelete(savedReport)} aria-label={`Remove ${savedReport.title || "interview plan"}`}>
                  <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M3.5 5h9M6 5V3.5h4V5m1.5 0-.6 8H5.1l-.6-8M6.5 7v4m3-4v4" /></svg>
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="previous-reports-empty"><span aria-hidden="true">✳</span><p>Your saved role preparations will appear here.</p><a href="#create-report">Prepare for your first role <span aria-hidden="true">↓</span></a></div>
        )}
        {reportsError && <p className="previous-reports-error" role="alert">{reportsError}</p>}
      </section>

      {reportToDelete && (
        <div className="delete-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !deletingReportId) setReportToDelete(null); }}>
          <section className="delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description">
            <div className="delete-dialog-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4.5h6V7m2 0-.8 12H7.8L7 7m3.5 3v5m3-5v5" /></svg>
            </div>
            <p className="delete-dialog-eyebrow">REMOVE SAVED PREPARATION</p>
            <h2 id="delete-dialog-title">Remove this interview plan?</h2>
            <p id="delete-dialog-description">“{reportToDelete.title || "Interview preparation"}” will be permanently removed from your saved plans.</p>
            <div className="delete-dialog-actions">
              <button className="delete-dialog-cancel" type="button" onClick={() => setReportToDelete(null)} disabled={Boolean(deletingReportId)}>Keep plan</button>
              <button className="delete-dialog-confirm" type="button" onClick={confirmDeleteReport} disabled={Boolean(deletingReportId)}>
                {deletingReportId ? "Removing…" : "Remove plan"}
              </button>
            </div>
          </section>
        </div>
      )}

      <section className="interview-workspace" id="create-report">
        <div className="workspace-heading">
          <div>
            <p className="eyebrow">PREPARE FOR YOUR NEXT ROLE</p>
            <h2>Build your role-specific prep.</h2>
          </div>
          <span className="step-indicator"><b>01</b><i /> 02 <i /> 03</span>
        </div>

        <div className="workspace-grid">
          <form className="prep-form" onSubmit={submitReport}>
            <div className="form-section-title"><span>01</span><div><h3>Your current resume</h3><p>We’ll use your experience to tailor interview preparation and a resume for this role.</p></div></div>
            <input
              ref={fileInput}
              className="visually-hidden"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => setResume(event.target.files?.[0] || null)}
            />
            <button className={`resume-dropzone${resume ? " has-file" : ""}`} type="button" onClick={() => fileInput.current?.click()}>
              <span className="upload-icon" aria-hidden="true">↑</span>
              <span className="upload-copy"><strong>{resume ? resume.name : "Upload your resume"}</strong><small>{resume ? "Ready to tailor for this role" : "PDF format · up to 5 MB"}</small></span>
              <span className="browse-link">{resume ? "Change file" : "Browse"}</span>
            </button>

            <div className="form-section-title section-spaced"><span>02</span><div><h3>Your background</h3><p>Add context that may not be clear from your resume.</p></div></div>
            <label className="field-label" htmlFor="self-description">Professional summary</label>
            <textarea
              id="self-description"
              value={selfDescription}
              onChange={(event) => setSelfDescription(event.target.value)}
              placeholder="Summarize your experience, strengths, and the kind of role you’re pursuing…"
              rows={4}
              required
            />

            <div className="form-section-title section-spaced job-title"><span>03</span><div><h3>Your target role</h3><p>Use the job description to focus your resume and interview prep.</p></div></div>
            <label className="field-label" htmlFor="job-description">Job description</label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the role description here…"
              rows={5}
              required
            />

            {error && <p className="interview-error" role="alert">{error}</p>}
            <div className="form-submit-row">
              <p>Your resume and role details are used to build your preparation.</p>
              <button className="create-plan-button" type="submit" disabled={submitting}>
                {submitting ? "Building your preparation…" : "Build my interview prep"}<span aria-hidden="true">→</span>
              </button>
            </div>
          </form>

          <aside className="prep-aside">
            <div className="aside-card aside-feature">
              <div className="aside-topline"><span>FROM RESUME TO INTERVIEW READY</span><span aria-hidden="true">✳</span></div>
              <h3>Know your fit.<br />Prepare with <em>purpose.</em></h3>
              <p>See how your experience lines up with the role and focus your preparation where it matters.</p>
              <div className="feature-list">
                <div><span>01</span><p><b>Role fit and skill gaps</b><small>See strengths and areas to work on</small></p></div>
                <div><span>02</span><p><b>Interview practice</b><small>Technical and behavioral questions with guidance</small></p></div>
                <div><span>03</span><p><b>Tailored resume</b><small>Preview and download a role-focused PDF</small></p></div>
              </div>
            </div>

            <div className="aside-quote"><span aria-hidden="true">“</span><p>Your experience is the starting point. Make your next application count.</p><small>FORMA RESUME & INTERVIEW PREP</small></div>
          </aside>
        </div>
      </section>

      <footer className="interview-footer"><span>Forma · Resume & interview prep</span><span>Preparation built around your experience</span><a href="#create-report">Back to top ↑</a></footer>
    </main>
  );
};

export default Home;
