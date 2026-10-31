import { Link } from "react-router";

const Brand = () => (
  <Link className="brand" to="/" aria-label="Forma resume and interview prep home">
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 40 40" focusable="false">
        <rect x="2" y="2" width="36" height="36" rx="11" />
        <path d="M13 29V12h14M13 20h11" />
        <path className="brand-spark" d="M28 10v5m-2.5-2.5h5" />
      </svg>
    </span>
    <span className="brand-name">
      forma<span className="brand-period">.</span>
      <small>RESUME &amp; INTERVIEW PREP</small>
    </span>
  </Link>
);

export default Brand;
