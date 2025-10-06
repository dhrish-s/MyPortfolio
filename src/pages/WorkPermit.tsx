import React, { useEffect, useMemo, useState } from 'react';
import './WorkPermit.css';
import { getWorkPermit } from '../queries/getWorkPermit';
import { WorkPermit as IWorkPermit } from '../types';

const WorkPermit: React.FC = () => {
  const [workPermitData, setWorkPermitData] = useState<IWorkPermit | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getWorkPermit();
      setWorkPermitData(data);
    })();
  }, []);

  // -------- Derived values (always before any return) --------
  const expiry: Date | null = useMemo(
    () => (workPermitData?.expiryDate ? new Date(workPermitData.expiryDate) : null),
    [workPermitData?.expiryDate]
  );

  const msLeft = useMemo(() => (expiry ? expiry.getTime() - Date.now() : NaN), [expiry]);
  const daysLeft = Number.isFinite(msLeft) ? Math.max(0, Math.floor(msLeft / 86400000)) : 0;
  const isExpired = expiry ? msLeft <= 0 : false;
  const isSoon = expiry ? !isExpired && daysLeft <= 180 : false;

  const expiryDisplay = useMemo(() => {
    if (!expiry) return '--';
    return expiry.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }, [expiry]);

  const timeLeftDisplay = useMemo(() => {
    if (!expiry) return '';
    if (isExpired) return 'Expired';
    const years = Math.floor(daysLeft / 365);
    const months = Math.floor((daysLeft % 365) / 30);
    if (years > 0) return `${years} yr${years > 1 ? 's' : ''}${months > 0 ? ` ${months} mo` : ''} left`;
    if (months > 0) return `${months} mo left`;
    return `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
  }, [expiry, isExpired, daysLeft]);

  // Ring percentage (cap at 100) and dynamic color (green → amber → red)
  const pct = expiry ? Math.min(100, Math.max(0, Math.round((daysLeft / 365) * 100))) : 0;
  const accentClr = isExpired ? '#ff4d4d' : daysLeft <= 60 ? '#ff4d4d' : daysLeft <= 180 ? '#ffb020' : '#2ecc71';
  const ringStyle = {
    ['--wp-pct' as any]: pct,
    ['--wp-accentClr' as any]: accentClr,
  } as React.CSSProperties;

  // ---- Additional info: sanitize & filter placeholders ----
  const extraInfo = useMemo(() => {
    const raw = (workPermitData?.additionalInfo ?? '').trim();
    // remove single pair of surrounding quotes if present
    const dequoted = raw.replace(/^[“"']|[”"']$/g, '').trim();
    const isPlaceholder =
      dequoted === '' ||
      /^[-–—]+$/.test(dequoted) ||                 // just dashes
      /^(n\/?a|na|none|null|undefined)$/i.test(dequoted);
    return isPlaceholder ? '' : dequoted;
  }, [workPermitData?.additionalInfo]);

  // -------- Skeleton (after hooks) --------
  if (!workPermitData) {
    return (
      <section className="work-permit-container" aria-busy="true">
        <div className="work-permit-card wp-skeleton">
          <div className="wp-skel-bar wp-skel-title" />
          <div className="wp-skel-bar wp-skel-line" />
          <div className="wp-skel-bar wp-skel-line" />
          <div className="wp-skel-bar wp-skel-chip" />
        </div>
      </section>
    );
  }

  return (
    <section className="work-permit-container" aria-labelledby="workPermitTitle">
      {/* Decorative glows, namespaced to avoid global impact */}
      <div className="wp-glow wp-glow-1" aria-hidden />
      <div className="wp-glow wp-glow-2" aria-hidden />

      <article className={`work-permit-card ${isExpired ? 'expired' : isSoon ? 'soon' : 'ok'}`}>
        <header className="wp-header">
          <h2 id="workPermitTitle" className="work-permit-headline">🎓 Work Permit</h2>
          <span className={`wp-status-chip ${isExpired ? 'danger' : isSoon ? 'warning' : 'success'}`}>
            {isExpired ? 'Expired' : 'Valid'}
          </span>
        </header>

        <p className="work-permit-summary">
          I’m currently on a <strong>{workPermitData.visaStatus}</strong> 🛂 that allows me to work
          in the United States. My visa is valid until <strong>{expiryDisplay}</strong> 📅.
        </p>

        <div className="wp-grid">
          {/* Countdown */}
          <div className="wp-countdown">
            <div className="wp-countdown-ring" style={ringStyle}>
              <div className="wp-countdown-core">
                <div className="wp-countdown-number">{isExpired ? 0 : daysLeft}</div>
                <div className="wp-countdown-label">days left</div>
              </div>
            </div>
            <div className="wp-timeleft">{timeLeftDisplay}</div>
          </div>

          {/* Details */}
          <ul className="wp-details" aria-label="Permit details">
            <li>
              <span className="wp-icon">🪪</span>
              <span className="wp-label">Status</span>
              <span className="wp-value">{workPermitData.visaStatus}</span>
            </li>
            <li>
              <span className="wp-icon">⏳</span>
              <span className="wp-label">Expiry</span>
              <span className="wp-value">{expiryDisplay}</span>
            </li>
            <li>
              <span className="wp-icon">📍</span>
              <span className="wp-label">Region</span>
              <span className="wp-value">United States</span>
            </li>
          </ul>
        </div>

        {/* Work Authorization panel */}
        <section className="wp-auth">
          <div className="wp-auth-header">
            <h3>Work Authorization</h3>
            <span className="wp-auth-badge">No Sponsorship Needed</span>
          </div>
          <p className="wp-auth-summary">
            Eligible for <strong>F-1 OPT (12 months)</strong> plus <strong>STEM OPT (24 months)</strong> — up to
            <strong> 36 months (3 years)</strong> of work authorization.
          </p>

          <div className="wp-auth-timeline" role="img" aria-label="OPT 12 months followed by STEM OPT 24 months">
            <div className="wp-auth-seg wp-auth-opt">OPT • 12 mo</div>
            <div className="wp-auth-seg wp-auth-stem">STEM OPT • 24 mo</div>
          </div>

          <p className="wp-auth-footnote">
            After this period, long-term options (e.g., H-1B) can be pursued. For now: onboard with standard I-9 —{' '}
            <strong>no sponsorship required</strong>.
          </p>
        </section>

        {extraInfo && <p className="wp-additional-info">“{extraInfo}”</p>}
      </article>
    </section>
  );
};

export default WorkPermit;
