import "./auth-loading.scss";

const AuthLoading = () => (
  <main className="auth-loading" role="status" aria-live="polite" aria-busy="true">
    <header className="auth-loading__header">
      <span className="auth-loading__mark" aria-hidden="true">f</span>
      <span className="auth-loading__brand">forma<span>.</span><small>RESUME &amp; INTERVIEW PREP</small></span>
    </header>

    <section className="auth-loading__content" aria-label="Restoring your session">
      <div className="auth-loading__preview" aria-hidden="true">
        <div className="auth-loading__preview-top"><span /><span /><span /></div>
        <div className="auth-loading__preview-body">
          <i className="auth-loading__avatar" />
          <i className="auth-loading__line auth-loading__line--title" />
          <i className="auth-loading__line auth-loading__line--short" />
          <i className="auth-loading__rule" />
          <i className="auth-loading__line" />
          <i className="auth-loading__line auth-loading__line--wide" />
          <i className="auth-loading__line auth-loading__line--medium" />
        </div>
      </div>

      <div className="auth-loading__message">
        <span className="auth-loading__spinner" aria-hidden="true" />
        <h1>Opening your workspace</h1>
        <p>Loading your saved interview plans…</p>
        <span className="auth-loading__progress" aria-hidden="true"><i /></span>
      </div>
    </section>

    <footer className="auth-loading__footer">Your resumes and interview preparation, all in one place</footer>
  </main>
);

export default AuthLoading;
