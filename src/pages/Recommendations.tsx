import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Recommendations.css";
import { getProfileBanner } from "../queries/getProfileBanner"; // ✅ import query
import { ProfileBanner } from "../types";

const Recommendations: React.FC = () => {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const banner: ProfileBanner = await getProfileBanner();
        if (banner.resumeLink?.url) {
          setResumeUrl(banner.resumeLink.url);
        }
      } catch (error) {
        console.error("Error fetching profile banner:", error);
      }
    }
    fetchBanner();
  }, []);

  const openNew = (href: string) =>
    window.open(href, "_blank", "noopener,noreferrer");

  const safeScroll = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section className="recs-empty-wrap">
      <div className="recs-empty-card" role="status" aria-live="polite">
        <div className="recs-empty-glow" aria-hidden="true" />

        <h2 className="recs-empty-title">No recommendations yet</h2>

        <p className="recs-empty-sub">
          I’m early in my journey—hire me and I’ll earn them. In the meantime:
        </p>

        {/* chips row */}
        <div className="recs-chips" role="group" aria-label="Highlights">
          <Link to="/projects" className="recs-chip" role="button">
            ⚡ Projects shipped
          </Link>

          <button
            type="button"
            className="recs-chip"
            onClick={() => openNew("https://github.com/dhrish-s")}
          >
            🧠 Open Source
          </button>

          <button
            type="button"
            className="recs-chip"
            onClick={() => safeScroll("skills")}
          >
            🛠️ Strong fundamentals
          </button>
        </div>

        {/* shimmer placeholders */}
        <div className="recs-skeletons" aria-hidden="true">
          <div className="skeleton-quote" />
          <div className="skeleton-quote" />
        </div>

        {/* CTA buttons */}
        <div className="recs-cta-row">
          <a
            className="recs-cta recs-cta-primary"
            href="mailto:dsuman@usc.edu?subject=Reference%20Request%20for%20Dhrish"
          >
            Request a reference
          </a>

          {resumeUrl && (
            <a
              className="recs-cta recs-cta-secondary"
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              View resume
            </a>
          )}

          <a
            className="recs-cta recs-cta-link"
            href="https://www.linkedin.com/in/dhrish-s/"
            target="_blank"
            rel="noreferrer"
          >
            Connect on LinkedIn
          </a>
        </div>

        <p className="recs-foot">
          P.S. If you’ve worked with me and want to leave a short blurb, I’d love
          to include it here.
        </p>
      </div>
    </section>
  );
};

export default Recommendations;
