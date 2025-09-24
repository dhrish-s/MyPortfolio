import React, { useEffect, useState } from 'react';
import './NetflixTitle.css';
import netflixSound from './netflix-sound.mp3';
import { useNavigate } from 'react-router-dom';
import logoImage from '../src/images/logo-2.png'; // keep your existing path

const NetflixTitle: React.FC = () => {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 1) Start the zoomOut animation
    setAnimate(true);

    // 2) Try to play the sound right away (no click)
    const audio = new Audio(netflixSound);
    audio.volume = 1.0;
    audio.play().catch(() => {
      // Autoplay with sound might be blocked on some browsers; ignore silently
    });

    // 3) Navigate after 5 seconds
    const timer = setTimeout(() => {
      navigate('/browse');
    }, 5000);

    // Cleanup
    return () => {
      clearTimeout(timer);
      audio.pause();
    };
  }, [navigate]);

  return (
    <div className="ntx-container">
      <img
        src={logoImage}
        alt="Custom Logo"
        className={`ntx-logo ${animate ? 'ntx-animate' : ''}`}
      />
    </div>
  );
};

export default NetflixTitle;
