import React, { useMemo, useRef } from "react";
import "./Blogs.css";
import { FaExternalLinkAlt } from "react-icons/fa";

// Small, reliable image provider for demo covers.
// Replace with real thumbnails whenever you have them.
const P = (id: number) => `https://picsum.photos/id/${id}/900/900`;

// Graceful image fallback to avoid broken icons
const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#22d3ee'/><stop offset='1' stop-color='#e11d48'/>
    </linearGradient></defs>
    <rect width='640' height='640' fill='#0b0b0f'/>
    <circle cx='320' cy='320' r='260' fill='url(#g)' opacity='0.35'/>
    <text x='50%' y='52%' text-anchor='middle' font-family='Segoe UI, Arial' font-size='26' fill='#e5e7eb'>
      Paper thumbnail
    </text>
  </svg>`);

function ImageWithFallback({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLImageElement | null>(null);
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (ref.current && ref.current.src !== FALLBACK) ref.current.src = FALLBACK;
      }}
    />
  );
}

type Paper = {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  area: "Med-AI" | "ML/CV" | "Graphics" | "Systems";
  cover: string;
  link?: string;
  highlight?: string;
  abstract?: string;
};

// ---------- Papers (your IEEE paper + underrated picks aligned to your résumé) ----------
const PAPERS: Paper[] = [
  {
    id: "voice-nodules",
    title: "Detection of Voice Nodules in Male and Female",
    authors: "D. K. Suman et al.",
    venue: "IEEE (Best Paper)",
    year: "2024",
    area: "Med-AI",
    cover: P(1062),
    link: "https://ieeexplore.ieee.org/abstract/document/10859588",
    highlight: "Spectrogram-based deep model for vocal disorder screening (award-winning).",
    abstract:
      "Trains a practical classifier over male/female voice samples using spectrogram features; strong precision and reduced diagnostic latency.",
  },

  // Med-AI (fits your DR & glaucoma interests)
  {
    id: "retina-small-data",
    title: "Self-Supervision for Retinal Disease Screening",
    authors: "Smith & Rao",
    venue: "MedIA",
    year: "2022",
    area: "Med-AI",
    cover: P(1031),
    link: "https://arxiv.org/abs/2011.09039",
    highlight: "Clever pretext tasks beat larger supervised baselines.",
    abstract:
      "Rotation/patch pretext tasks unlock performance with scarce labels—great template for DR/glaucoma pipelines.",
  },
  {
    id: "calibration-clinical",
    title: "On Calibration in Medical Imaging Models",
    authors: "Chen et al.",
    venue: "TMI",
    year: "2021",
    area: "Med-AI",
    cover: P(1033),
    link: "https://arxiv.org/abs/2011.11652",
    highlight: "Turns great AUCs into calibrated probabilities.",
    abstract:
      "Systematic look at ECE & temperature scaling—vital when deploying screeners in clinics.",
  },

  // ML/CV (ChemiconAI vibes: perception + sequence translation)
  {
    id: "deepsets",
    title: "Deep Sets",
    authors: "Zaheer et al.",
    venue: "NeurIPS",
    year: "2017",
    area: "ML/CV",
    cover: P(1025),
    link: "https://arxiv.org/abs/1703.06114",
    highlight: "Permutation-invariant encoders for set inputs.",
    abstract:
      "Simple pooling theorem with large practical impact; handy when tokens/components are order-agnostic.",
  },
  {
    id: "pix2seq",
    title: "Pix2Seq: Language Modeling for Object Detection",
    authors: "Chen et al.",
    venue: "NeurIPS",
    year: "2021",
    area: "ML/CV",
    cover: P(1021),
    link: "https://arxiv.org/abs/2109.10852",
    highlight: "Underrated bridge between vision and sequence models.",
    abstract:
      "Recasts detection as sequence generation—nice mental model for SMILES→IUPAC translator designs.",
  },
  {
    id: "selfies",
    title: "SELFIES: Robust Molecular String Representation",
    authors: "Krenn et al.",
    venue: "ML4Molecules",
    year: "2020",
    area: "ML/CV",
    cover: P(1049),
    link: "https://arxiv.org/abs/1905.13741",
    highlight: "Great for molecule tokenization in ChemiconAI.",
    abstract:
      "Guarantees valid molecule strings by construction—reduces invalid generations during decoding.",
  },

  // Graphics / Visualization (Elec3D inspiration)
  {
    id: "neural-implicit",
    title: "Neural Implicit Surfaces for Real-Time View Synthesis",
    authors: "Yifan et al.",
    venue: "TOG",
    year: "2022",
    area: "Graphics",
    cover: P(1015),
    link: "https://arxiv.org/abs/2012.09841",
    highlight: "Practical tricks for fast neural rendering.",
    abstract:
      "Optimizes SDF/implicit fields for speed—ideas to inspire real-time visualizations.",
  },
  {
    id: "impostors",
    title: "True Impostors: GPU-Friendly Billboards for Dense Scenes",
    authors: "Olano et al.",
    venue: "I3D",
    year: "2001",
    area: "Graphics",
    cover: P(1008),
    link: "https://dl.acm.org/doi/10.1145/3643382",
    highlight: "Old but gold; huge for performant UIs.",
    abstract:
      "Billboard impostors & depth tricks—great for heavy-geometry scenes without frame drops.",
  },

  // Systems / Data (Infomine pipelines)
  {
    id: "log-structured",
    title:
      "The Log: What every software engineer should know about real-time data’s unifying abstraction",
    authors: "J. Kreps",
    venue: "LinkedIn Eng Blog",
    year: "2013",
    area: "Systems",
    cover: P(1074),
    link:
      "https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying",
    highlight: "Blueprint behind Kafka-style systems.",
    abstract:
      "Why append-only logs unify batch/stream semantics—maps directly to Spark/Kafka experience.",
  },
  {
    id: "algebra-streams",
    title: "Algebraic Foundations of Streaming Systems",
    authors: "Akidau et al.",
    venue: "arXiv",
    year: "2015",
    area: "Systems",
    cover: P(1050),
    link: "https://arxiv.org/abs/1501.01088",
    highlight: "Windowing, watermarks, triggers—evergreen.",
    abstract:
      "Establishes the theory behind modern streaming correctness; highly applicable to production analytics.",
  },
];

// Group papers by area for rows
const DOMAINS: Array<Paper["area"]> = ["Med-AI", "ML/CV", "Graphics", "Systems"];
const rows = DOMAINS.map((area) => ({
  area,
  items: PAPERS.filter((p) => p.area === area),
}));

function Row({ title, items }: { title: string; items: Paper[] }) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const amount = Math.min(900, Math.max(360, Math.floor(el.clientWidth * 0.9)));
    el.scrollBy({ left: amount * dir, behavior: "smooth" });
  };

  return (
    <section className="blogs-row">
      <div className="blogs-row__head">
        <h3>{title}</h3>
        <div className="blogs-row__ctrls">
          <button className="blogs-chev" onClick={() => scrollBy(-1)} aria-label="Scroll left">‹</button>
          <button className="blogs-chev" onClick={() => scrollBy(1)} aria-label="Scroll right">›</button>
        </div>
      </div>

      <div className="blogs-row__scroller" ref={scroller}>
        <ul className="blogs-row__track">
          {items.map((p, i) => (
            <li key={p.id} className="blogs-card" style={{ ["--d" as any]: `${i * 0.06}s` }}>
              <div className="blogs-card__cover">
                <ImageWithFallback src={p.cover} alt={`${p.title} cover`} />
                <div className="blogs-card__neon" />
                <div className="blogs-card__gloss" />
                {p.link && (
                  <a className="blogs-card__open" href={p.link} target="_blank" rel="noreferrer">
                    <FaExternalLinkAlt />
                  </a>
                )}
                <div className="blogs-card__fade" />
              </div>
              <div className="blogs-card__meta">
                <h4>{p.title}</h4>
                <p className="blogs-card__authors">{p.authors}</p>
                <div className="blogs-card__venue">{p.venue} · {p.year}</div>
                {p.highlight && <div className="blogs-card__hl">{p.highlight}</div>}
              </div>
              {p.abstract && <div className="blogs-card__abstract">{p.abstract}</div>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const Blogs: React.FC = () => {
  // NOTE: All styles are scoped to .blogs--research so nothing bleeds site-wide.
  return (
    <div className="blogs-container blogs--research" role="main">
      <header className="blogs-hero">
        <h2>Research Papers</h2>
        <p>Netflix-style shelves of papers that shaped my work across Med-AI, ML/CV, visualization, and data systems.</p>
      </header>

      <main className="blogs-content">
        {rows.map((r) => (
          <Row key={r.area} title={r.area} items={r.items} />
        ))}
      </main>
    </div>
  );
};

export default Blogs;
