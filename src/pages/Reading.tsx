import React, { useRef } from "react";
import "./Reading.css";

import atomicHabits from "../images/atomic_habits.jpg";
import richDadPoorDad from "../images/rich_dad_poor_dad.jpg";
import alchemist from "../images/alchemist.jpg";
import eatThatFrog from "../images/eat_that_frog.jpg";
import vijayanikiAidhuMetlu from "../images/vijayaniki_aidu_metlu.jpg";
import venneloAdapilla from "../images/vennelo_adapilla.jpeg";

const P = (id: number) => `https://picsum.photos/id/${id}/700/700`;

const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'>
    <rect width='640' height='640' fill='#0b0b0f'/>
    <circle cx='320' cy='320' r='260' fill='#22d3ee' opacity='0.28'/>
    <text x='50%' y='52%' text-anchor='middle'
          font-family='Segoe UI, Arial' font-size='28' fill='#e5e7eb'>
      Cover unavailable
    </text>
  </svg>`);

type Book = {
  title: string;
  author: string;
  imgSrc: string;
  description: string;
};

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

const books: Book[] = [
  { title: "Atomic Habits", author: "James Clear", imgSrc: atomicHabits, description: "Tiny habits → compounding results. Systems over goals, done right." },
  { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", imgSrc: richDadPoorDad, description: "Simple mental models for assets, cash flow, and financial literacy." },
  { title: "The Alchemist", author: "Paulo Coelho", imgSrc: alchemist, description: "A fable about following your ‘Personal Legend’—still magical." },
  { title: "Eat That Frog", author: "Brian Tracy", imgSrc: eatThatFrog, description: "Tactics to defeat procrastination and ship meaningful work." },
  { title: "Vijayaniki Aidhu Metlu", author: "Yandamoori Veerendranath", imgSrc: vijayanikiAidhuMetlu, description: "Classic Telugu inspiration on disciplined self-improvement." },
  { title: "Vennelo Adapilla", author: "Yandamoori Veerendranath", imgSrc: venneloAdapilla, description: "Beloved Telugu romantic novel with a thoughtful core." },

  // extra underrated picks
  { title: "Finite and Infinite Games", author: "James P. Carse", imgSrc: P(1025), description: "Play to continue the play, not just to win." },
  { title: "The Scout Mindset", author: "Julia Galef", imgSrc: P(1016), description: "Truth-seeking > tribe-defending. Update beliefs without ego." },
  { title: "How to Take Smart Notes", author: "Sönke Ahrens", imgSrc: P(1050), description: "Zettelkasten method—turn reading into output." },
  { title: "Deep Work", author: "Cal Newport", imgSrc: P(1031), description: "Underrated because it’s hard: focus as a competitive advantage." },
  { title: "The Mom Test", author: "Rob Fitzpatrick", imgSrc: P(1074), description: "Ask better questions, avoid polite lies. Essential for builders." },
  { title: "Ultralearning", author: "Scott Young", imgSrc: P(1027), description: "Aggressive self-directed learning—design your own bootcamps." },
  { title: "Factfulness", author: "Hans Rosling", imgSrc: P(1008), description: "Data-driven optimism that resets your global priors." },
  { title: "The Order of Time", author: "Carlo Rovelli", imgSrc: P(1033), description: "Physics explained with poetry; a mind-stretching read." },
  { title: "Range", author: "David Epstein", imgSrc: P(1015), description: "Generalists win in complex domains—permission to explore widely." },
  { title: "Algorithms to Live By", author: "Christian & Griffiths", imgSrc: P(1049), description: "Computer-science ideas for everyday decisions." },
  { title: "The War of Art", author: "Steven Pressfield", imgSrc: P(1080), description: "Beat Resistance and make art—short, sharp, motivating." },
  { title: "Malgudi Days", author: "R. K. Narayan", imgSrc: P(1062), description: "Deceptively simple Indian short stories—enduring and humane." },
];

const Reading: React.FC = () => {
  return (
    <div className="reading-container">
      <h2 className="reading-title">Books That Shaped My Journey</h2>
      <p className="reading-intro">Quiet gems that changed how I think, learn, and build.</p>

      <div className="books-grid">
        {books.map((book, index) => (
          <article
            key={book.title + index}
            className="book-card"
            style={{ ["--delay" as any]: `${index * 0.06}s` }}
            tabIndex={0}
          >
            <div className="cover-wrap">
              <ImageWithFallback src={book.imgSrc} alt={`${book.title} cover`} />
              <div className="neon" />
              <div className="gloss" />
            </div>
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <h4 className="book-author">{book.author}</h4>
              <p className="book-description">{book.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Reading;
