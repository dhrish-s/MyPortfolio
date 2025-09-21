import React, { useEffect, useMemo, useRef, useState } from 'react';
import './ContactMe.css';
import profilePic from '../images/dhrish.png';
import {
  FaEnvelope,
  FaPhoneAlt,
  FaCoffee,
  FaLinkedin,
  FaCopy,
  FaCheck,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { ContactMe as IContactMe } from '../types';
import { getContactMe } from '../queries/getContactMe';

const ContactMe: React.FC = () => {
  const [userData, setUserData] = useState<IContactMe>();
  const [copied, setCopied] = useState<'email' | 'phone' | null>(null);
  const [typedText, setTypedText] = useState('');
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const confettiAreaRef = useRef<HTMLDivElement | null>(null);

  const taglines = useMemo(
    () => [
      'Turning ☕️ into clean commits.',
      'Making pixels behave since… several commits ago.',
      'If it compiles, we celebrate. If not, we caffeinate.',
      'Available for bugs, banter, and build pipelines.',
    ],
    []
  );

  useEffect(() => {
    (async () => {
      const data = await getContactMe();
      setUserData(data);
    })();
  }, []);

  const sanitizeSummary = (s?: string) =>
    (s ?? '').replace(/\s*(?:\.\s*)?(?:undefined|null|NaN)\s*$/i, '').trim();

  useEffect(() => {
    const raw = userData?.summary;
    if (raw == null) return;

    const text = sanitizeSummary(raw);
    setTypedText('');
    if (!text) return;

    let i = 0;
    const id = window.setInterval(() => {
      if (i < text.length) {
        setTypedText((prev) => prev + text.charAt(i));
        i += 1;
      } else {
        clearInterval(id);
      }
    }, 16);
    return () => clearInterval(id);
  }, [userData?.summary]);

  useEffect(() => {
    const id = setInterval(() => {
      setTaglineIdx((i) => (i + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(id);
  }, [taglines.length]);

  function handleCopy(value: string, which: 'email' | 'phone') {
    if (!value) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(value);
    } else {
      const ta = document.createElement('textarea');
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(which);
    setTimeout(() => setCopied(null), 1400);
  }

  function onCardMouseMove(e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const ry = ((x - midX) / midX) * 8;
    const rx = ((midY - y) / midY) * 8;
    setTilt({ rx, ry });
  }
  function onCardLeave() { setTilt({ rx: 0, ry: 0 }); }

  const calendlyLink =
    (userData as any)?.calendlyLink || 'https://calendly.com/everythingguy007/30min';

  function launchConfettiThenCalendly() {
    if (confettiAreaRef.current) {
      const area = confettiAreaRef.current;
      const emojis = ['☕️', '✨', '🎉', '🚀', '💬', '🧠'];
      for (let i = 0; i < 16; i++) {
        const el = document.createElement('span');
        el.className = 'confetti-emoji';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = `${Math.random() * 100}%`;
        el.style.setProperty('--tx', `${(Math.random() - 0.5) * 160}px`);
        el.style.setProperty('--ty', `${-80 - Math.random() * 80}px`);
        area.appendChild(el);
        setTimeout(() => el.remove(), 1200);
      }
    }
    setTimeout(() => {
      window.open(calendlyLink, '_blank', 'noopener,noreferrer');
    }, 650);
  }

  if (!userData) return <div className="cm-root contact-loading">Loading your awesome…</div>;

  return (
    <div className="cm-root contact-container">
      <div className="gradient-bg" aria-hidden />
      <div className="contact-inner" ref={confettiAreaRef}>
        {/* LEFT COLUMN */}
        <div className="left-stack">
          <div
            className="profile-card profile-card--wide"
            onMouseMove={onCardMouseMove}
            onMouseLeave={onCardLeave}
            style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
          >
            <div className="avatar-stack">
              <img src={profilePic} alt={userData.name || 'Profile'} className="badge-avatar" />
              <a
                href={userData.linkedinLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="badge-chip"
                title="LinkedIn"
              >
                <FaLinkedin />
                <span>LinkedIn</span>
                <FaExternalLinkAlt className="external" />
              </a>
            </div>

            <div className="badge-content">
              <h3 className="badge-name">{userData.name || ''}</h3>
              <p className="badge-title">{userData.title || ''}</p>
              <p className="badge-company single-line">{userData.companyUniversity || ''}</p>
            </div>
          </div>

          {/* SUMMARY OUTSIDE THE CARD */}
          <div className="summary-panel">
            <div className="typewriter outside">
              <span>{typedText}</span>
              <b className="cursor">|</b>
            </div>
            <p className="rotating-tagline" aria-live="polite">
              {taglines[taglineIdx]}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="contact-panel">
          <div className="contact-header">
            <p>I’m always up for a chat — inbox, call, or caffeine. Pick your fighter 👇</p>
          </div>

          <div className="contact-grid">
            {/* Email */}
            <div className="contact-card">
              <div className="contact-row">
                <FaEnvelope className="contact-icon" />
                <a href={`mailto:${userData.email}`} className="contact-value">
                  {userData.email}
                </a>
                <button
                  className="ghost-btn"
                  onClick={() => handleCopy(userData.email, 'email')}
                  aria-label="Copy email"
                >
                  {copied === 'email' ? <FaCheck /> : <FaCopy />}
                </button>
              </div>
              <div className="contact-actions">
                <a
                  className="primary-btn"
                  href={`mailto:${userData.email}?subject=Hello%20${encodeURIComponent(
                    userData.name || 'there'
                  )}&body=Hi%20${encodeURIComponent(userData.name || 'there')},%0D%0A%0D%0A`}
                >
                  Let’s talk
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="contact-card">
              <div className="contact-row">
                <FaPhoneAlt className="contact-icon" />
                <a href={`tel:${userData.phoneNumber}`} className="contact-value">
                  {userData.phoneNumber}
                </a>
                <button
                  className="ghost-btn"
                  onClick={() => handleCopy(userData.phoneNumber, 'phone')}
                  aria-label="Copy phone"
                >
                  {copied === 'phone' ? <FaCheck /> : <FaCopy />}
                </button>
              </div>
              <div className="contact-actions">
                <a className="secondary-btn" href={`tel:${userData.phoneNumber}`}>
                  Call now
                </a>
              </div>
            </div>

            {/* Coffee */}
            <div className="contact-card coffee-card">
              <div className="contact-row">
                <FaCoffee className="contact-icon coffee" />
                <div className="contact-value">Coffee chat?</div>
              </div>
              <p className="coffee-sub">10 minutes, two humans, one beverage.</p>
              <div className="contact-actions">
                <button
                  type="button"
                  className="primary-btn"
                  onClick={launchConfettiThenCalendly}
                  aria-label="Book a coffee chat on Calendly"
                >
                  Book a ☕️ vibe check
                </button>
              </div>
            </div>
          </div>

          <div className="micro-note" aria-live="polite">
            {copied ? (copied === 'email' ? 'Email copied!' : 'Phone copied!') : 'Tip: click the copy icon to paste faster.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMe;
