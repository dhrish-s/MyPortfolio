import React, { useRef } from "react";
import "./Music.css";

// KEEP your local covers
import albumCover1 from "../images/Hotelcalifornia.jpg"; // Hotel California — The Eagles
import albumCover2 from "../images/ac-dc.jpg";            // Back in Black — AC/DC
import albumCover3 from "../images/guns-n-roses.webp";    // Appetite for Destruction — Guns N' Roses

// A tidy fallback (SVG data URI)
const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#0ea5e9"/>
        <stop offset="1" stop-color="#e11d48"/>
      </linearGradient>
    </defs>
    <rect width="600" height="600" fill="#0b0b0f"/>
    <circle cx="300" cy="300" r="240" fill="url(#g)" opacity="0.25"/>
    <text x="50%" y="52%" text-anchor="middle" font-family="Segoe UI, Arial" font-size="28" fill="#e5e7eb">
      Cover Unavailable
    </text>
  </svg>`);

// Use a stable free image service for demo covers
const P = (id: number) => `https://picsum.photos/id/${id}/800/800`;

type Song = { id: string; title: string; artist: string; cover: string; href?: string };
type Row  = { key: string; title: string; songs: Song[] };

// Always-shows image component
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

function SongRow({ row }: { row: Row }) {
  const scroller = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const amount = Math.min(900, Math.max(360, Math.floor(el.clientWidth * 0.9)));
    el.scrollBy({ left: amount * dir, behavior: "smooth" });
  };

  return (
    <section id={`genre-${row.key}`} className="row-section">
      <div className="row-header">
        <h3>{row.title}</h3>
        <div className="row-controls">
          <button className="chev" onClick={() => scroll(-1)} aria-label="Scroll left">‹</button>
          <button className="chev" onClick={() => scroll(1)}  aria-label="Scroll right">›</button>
        </div>
      </div>

      <div className="row-scroller" ref={scroller}>
        <ul className="row-track">
          {row.songs.map((s) => (
            <li key={s.id} className="song-card" tabIndex={0}>
              <div className="cover">
                <ImageWithFallback src={s.cover} alt={`${s.title} cover`} />
                <div className="glow" />
                <button className="play" aria-label={`Play ${s.title}`}>
                  <span className="triangle" aria-hidden="true" />
                </button>
                <div className="shine" />
              </div>
              <div className="meta">
                <h4 title={s.title}>{s.title}</h4>
                <p title={s.artist}>{s.artist}</p>
              </div>
              <div className="accent-border" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** DATA
 * - Your 3 local covers are featured across rock rows.
 * - All other covers use picsum (stable) + the fallback if anything fails.
 */
const rows: Row[] = [
  {
    key: "rock",
    title: "Rock",
    songs: [
      { id: "hotel", title: "Hotel California",    artist: "The Eagles",    cover: albumCover1 },
      { id: "back",  title: "Back in Black",       artist: "AC/DC",         cover: albumCover2 },
      { id: "sweet", title: "Sweet Child O' Mine", artist: "Guns N' Roses", cover: albumCover3 },
      { id: "arena", title: "Arena Nights",        artist: "Midnight Mile", cover: P(1025) },
      { id: "static",title: "Static Stars",        artist: "Neon Harbor",   cover: P(1002) },
    ],
  },
  {
    key: "classicrock",
    title: "Classic Rock",
    songs: [
      { id: "classic1", title: "Road to Nowhere",         artist: "Old Flame",      cover: P(1050) },
      { id: "hotel2",   title: "Hotel California (Live)", artist: "The Eagles",     cover: albumCover1 },
      { id: "shoot",    title: "Shoot to Thrill",         artist: "AC/DC",          cover: albumCover2 },
    ],
  },
  {
    key: "hardrock",
    title: "Hard Rock",
    songs: [
      { id: "iron",  title: "Iron Riff",       artist: "Molten Wire", cover: P(1011) },
      { id: "train", title: "Nightrain",       artist: "Guns N' Roses", cover: albumCover3 },
      { id: "thund", title: "Thunderstruck",   artist: "AC/DC",        cover: albumCover2 },
    ],
  },
  {
    key: "blues",
    title: "Blues",
    songs: [
      { id: "delta",   title: "Delta Mist",      artist: "River Tone",  cover: P(1031) },
      { id: "broken",  title: "Broken Strings",  artist: "Moody Light", cover: P(1027) },
      { id: "midnite", title: "Midnight Shuffle",artist: "Blue Lantern",cover: P(1015) },
    ],
  },
  {
    key: "alternative",
    title: "Alternative",
    songs: [
      { id: "paper", title: "Paper Planets", artist: "Static Avenue", cover: P(1024) },
      { id: "grey",  title: "Grey Skyline",  artist: "Low Tide",      cover: P(1018) },
      { id: "waves", title: "Waves Apart",   artist: "Sky Division",  cover: P(1008) },
    ],
  },
  {
    key: "hindi",
    title: "Hindi Classics (’70s–’80s)",
    songs: [
      { id: "karz",   title: "Om Shanti Om",           artist: "Karz (1980)",             cover: P(1067) },
      { id: "disco",  title: "I Am a Disco Dancer",    artist: "Disco Dancer (1982)",     cover: P(1074) },
      { id: "qurb",   title: "Aap Jaisa Koi",          artist: "Qurbani (1980)",          cover: P(1080) },
      { id: "chand",  title: "Mere Haathon Mein",      artist: "Chandni (1989)",          cover: P(1049) },
      { id: "mrindia",title: "Hawa Hawai",             artist: "Mr. India (1987)",        cover: P(1062) },
    ],
  },
  {
    key: "mj",
    title: "Michael Jackson",
    songs: [
      { id: "thriller",  title: "Thriller",    artist: "Michael Jackson (1982)", cover: P(1035) },
      { id: "billie",    title: "Billie Jean", artist: "Michael Jackson (1982)", cover: P(1033) },
      { id: "beatit",    title: "Beat It",     artist: "Michael Jackson (1982)", cover: P(1021) },
    ],
  },
];

const Music: React.FC = () => {
  return (
    <div className="music-page">
      <div className="quote">
        <p>“Rock and Roll isn’t a genre, it’s a way of life.” 🎸</p>
      </div>

      <div className="genre-section">
        <h3>Explore by Genre</h3>
        <div className="genres" role="tablist" aria-label="Genres">
          {rows.map((r) => (
            <a key={r.key} className="genre-chip" href={`#genre-${r.key}`} role="tab">
              {r.title}
            </a>
          ))}
        </div>
      </div>

      <div className="albums-section">
        <h3>Favorite Songs</h3>
        {rows.map((row) => (
          <SongRow key={row.key} row={row} />
        ))}
      </div>
    </div>
  );
};

export default Music;
