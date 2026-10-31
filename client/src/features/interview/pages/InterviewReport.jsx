import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth.js";
import { useInterview } from "../hooks/useInterview.js";
import Brand from "../components/Brand.jsx";
import { generateResumePdf, getInterviewReportById } from "../services/interview.api.js";
import "./report.style.scss";

const sections = [
  { id: "technical", label: "Technical practice", number: "01" },
  { id: "behavioral", label: "Behavioral practice", number: "02" },
  { id: "roadmap", label: "Study roadmap", number: "03" },
];

const InterviewReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const { user, handleLogout, loading: authLoading } = useAuth();
  const { reports, fetchAllReports } = useInterview();
  const [report, setReport] = useState(location.state?.report || null);
  const [reportLoading, setReportLoading] = useState(!location.state?.report);
  const [reportError, setReportError] = useState("");
  const [resumeGenerating, setResumeGenerating] = useState(false);
  const [resumePreviewUrl, setResumePreviewUrl] = useState("");
  const [activeSection, setActiveSection] = useState("technical");

  useEffect(() => {
    let cancelled = false;
    fetchAllReports().catch((error) => {
      if (!cancelled) console.error("Could not load interview report history:", error);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (location.state?.report) {
      setReport(location.state.report);
      setReportLoading(false);
      return;
    }
    let cancelled = false;
    setReportLoading(true);
    getInterviewReportById(interviewId)
      .then((data) => { if (!cancelled) setReport(data.interviewReport); })
      .catch((error) => {
        if (!cancelled) setReportError(error.response?.data?.message || "We couldn’t load this role preparation. Please try again.");
      })
      .finally(() => { if (!cancelled) setReportLoading(false); });
    return () => { cancelled = true; };
  }, [interviewId, location.state]);

  const downloadResume = async () => {
    setResumeGenerating(true);
    try {
      const pdfBlob = await generateResumePdf(interviewId);
      setResumePreviewUrl(URL.createObjectURL(pdfBlob));
    } catch (error) {
      setReportError(error.response?.data?.message || "We couldn’t build your tailored resume. Please try again.");
    } finally {
      setResumeGenerating(false);
    }
  };

  useEffect(() => () => {
    if (resumePreviewUrl) URL.revokeObjectURL(resumePreviewUrl);
  }, [resumePreviewUrl]);

  useEffect(() => {
    if (!resumePreviewUrl) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setResumePreviewUrl("");
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [resumePreviewUrl]);

  const closeResumePreview = () => setResumePreviewUrl("");

  const saveResume = () => {
    const link = document.createElement("a");
    link.href = resumePreviewUrl;
    link.download = `resume_${interviewId}.pdf`;
    link.click();
  };

  const signOut = async () => {
    try {
      await handleLogout();
      navigate("/login");
    } catch {
      // Keep the report available if sign out fails.
    }
  };

  if (reportLoading) {
    return <main className="interview-report-page"><section className="report-empty"><p className="eyebrow">YOUR RESUME & INTERVIEW WORKSPACE</p><h1>Loading your role preparation…</h1></section></main>;
  }

  if (!report) {
    return (
      <main className="interview-report-page">
        <header className="interview-topbar">
          <Brand />
        </header>
        <section className="report-empty"><p className="eyebrow">YOUR RESUME & INTERVIEW WORKSPACE</p><h1>{reportError ? "We couldn’t load this preparation." : "No role preparation found."}</h1><p>{reportError || "Create preparation from your resume and a job description to see tailored interview practice and a study roadmap here."}</p><Link className="create-plan-button" to="/">Build my interview prep <span>→</span></Link>
          <div className="report-history report-empty-history">
            <p className="sidebar-label">SAVED PLANS</p>
            {reports.length ? reports.map((savedReport) => (
              <button className="report-history-item" key={savedReport._id} type="button" onClick={() => navigate(`/interview/${savedReport._id}`)}>
                <span className="report-history-title">{savedReport.title || "Interview preparation"}</span>
                <span className="report-history-meta">{savedReport.matchScore != null ? `Profile match: ${savedReport.matchScore}/100` : "Saved plan"}</span>
              </button>
            )) : <p className="report-history-empty">Your saved role preparations will appear here.</p>}
          </div>
        </section>
      </main>
    );
  }

  const list = activeSection === "technical"
    ? report.technicalQuestions || []
    : activeSection === "behavioral"
      ? report.behavioralQuestions || []
      : report.preparationPlan || [];

  return (
    <main className="interview-report-page">
      <header className="interview-topbar">
        <Brand />
        <nav className="interview-nav" aria-label="Main navigation"><Link to="/">Resume & interview prep</Link><a className="nav-current" href="#report-content">Role preparation</a></nav>
        <div className="interview-user"><span className="user-greeting">Hi, {user?.username || "there"}</span><button type="button" onClick={signOut} disabled={authLoading}>Sign out <span aria-hidden="true">↗</span></button></div>
      </header>

      <section className="report-heading">
        <div><p className="eyebrow">YOUR ROLE PREPARATION</p><h1>{report.title || "Your interview preparation"}</h1><p>Review your role match, practice interview questions, and follow your study roadmap.</p><button className="resume-builder-button" type="button" onClick={downloadResume} disabled={resumeGenerating}>{resumeGenerating ? "Building your tailored resume…" : "Build tailored resume"}<span aria-hidden="true">→</span></button>{reportError && <p className="report-error" role="alert">{reportError}</p>}</div>
        <div className="report-match"><span>ROLE MATCH</span><strong>{report.matchScore ?? "—"}<small>/100</small></strong></div>
      </section>

      <section className="report-layout" id="report-content">
        <nav className="report-sidebar" aria-label="Interview preparation sections">
          <p className="sidebar-label">PREPARATION SECTIONS</p>
          {sections.map((section) => (
            <button key={section.id} type="button" className={activeSection === section.id ? "active" : ""} onClick={() => setActiveSection(section.id)} aria-current={activeSection === section.id ? "page" : undefined}>
              <span>{section.number}</span>{section.label}<b aria-hidden="true">→</b>
            </button>
          ))}
          <div className="report-history">
            <p className="sidebar-label">SAVED PLANS</p>
            {reports.length ? reports.map((savedReport) => (
              <button
                className={`report-history-item ${savedReport._id === interviewId ? "selected" : ""}`}
                key={savedReport._id}
                type="button"
                onClick={() => navigate(`/interview/${savedReport._id}`)}
                aria-current={savedReport._id === interviewId ? "page" : undefined}
              >
                <span className="report-history-title">{savedReport.title || "Interview preparation"}</span>
                <span className="report-history-meta">
                  {savedReport.createdAt ? new Date(savedReport.createdAt).toLocaleDateString() : "Saved plan"}
                  {savedReport.matchScore != null ? ` · ${savedReport.matchScore}/100` : ""}
                </span>
              </button>
            )) : <p className="report-history-empty">Your saved role preparations will appear here.</p>}
          </div>
          <div className="sidebar-tip"><span>✳</span><p>Take one section at a time. Good preparation is built step by step.</p></div>
        </nav>

        <section className="report-main-content" aria-live="polite">
          <div className="content-kicker">{sections.find(({ id }) => id === activeSection)?.number} / 03</div>
          <h2>{sections.find(({ id }) => id === activeSection)?.label}</h2>
          <p className="content-intro">{activeSection === "roadmap" ? "A day-by-day study guide focused on this role." : "Review what each question is assessing and how to shape a clear, specific answer."}</p>
          {list.length ? (
            <div className={activeSection === "roadmap" ? "report-items roadmap-items" : "report-items"}>
              {list.map((item, index) => activeSection === "roadmap" ? (
                <article className="report-item roadmap-item" key={`${item.day}-${index}`}>
                  <span className="item-number">DAY {String(item.day ?? index + 1).padStart(2, "0")}</span><div><h3>{item.focus}</h3><ul>{(item.tasks || []).map((task, taskIndex) => <li key={taskIndex}>{task}</li>)}</ul></div>
                </article>
              ) : (
                <article className="report-item question-item" key={`${item.question}-${index}`}>
                  <span className="item-number">QUESTION {String(index + 1).padStart(2, "0")}</span><h3>{item.question}</h3><div className="answer-block"><h4>What they’re looking for</h4><p>{item.intention}</p></div><div className="answer-block"><h4>How to approach it</h4><p>{item.answer}</p></div>
                </article>
              ))}
            </div>
          ) : <div className="report-no-items">There’s no content in this section yet. Check the other preparation sections in the menu.</div>}
        </section>

        <aside className="report-insights">
          <div className="insights-card"><div className="insights-title"><span>ROLE SKILL GAPS</span><span aria-hidden="true">✳</span></div><h2>Skill gaps</h2><p className="insights-description">Skills from the job description to focus on.</p>
            {report.skillGaps?.length ? <div className="skill-tags">{report.skillGaps.map((gap, index) => <span className={`skill-tag severity-${(gap.severity || "medium").toLowerCase()}`} key={`${gap.skill}-${index}`}>{gap.skill}<small>{gap.severity || "Focus"}</small></span>)}</div> : <p className="no-gaps">No skill gaps were identified for this role. Keep building on your strengths.</p>}
          </div>
          <div className="insights-note"><span>YOUR NEXT STEP</span><p>Use the sample guidance as a starting point, then shape each answer around your own experience.</p></div>
        </aside>
      </section>
      {resumePreviewUrl && (
        <div className="resume-preview-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeResumePreview(); }}>
          <section className="resume-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="resume-preview-title">
            <header><div><p className="eyebrow">RESUME PREVIEW</p><h2 id="resume-preview-title">Resume tailored to this role</h2></div><button className="resume-preview-close" type="button" onClick={closeResumePreview} aria-label="Close resume preview">×</button></header>
            <iframe title="Preview of your tailored resume" src={resumePreviewUrl} />
            <footer><button type="button" className="resume-preview-secondary" onClick={closeResumePreview}>Close preview</button><button type="button" className="resume-preview-download" onClick={saveResume}>Download PDF <span aria-hidden="true">↓</span></button></footer>
          </section>
        </div>
      )}
      <footer className="interview-footer"><span>Forma · Resume & interview prep</span><span>Preparation built around your experience</span><Link to="/">Back to your workspace ↑</Link></footer>
    </main>
  );
};

export default InterviewReport;
