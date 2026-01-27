import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Gallery.css';

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop",
    alt: "Woman coding at desk"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=500&fit=crop",
    alt: "Professional woman developer"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop",
    alt: "Woman in tech"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop",
    alt: "Coding workshop"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop",
    alt: "Woman at hackathon"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop",
    alt: "Team collaboration"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop",
    alt: "Mentoring session"
  }
];

const Gallery = () => {
  const [animationStage, setAnimationStage] = useState(0);
  // Stage 0: Black screen
  // Stage 1: Main image appears (large)
  // Stage 2: Main image shrinks
  // Stage 3: Side images slide in
  // Stage 4: Final grid complete

  useEffect(() => {
    // Stage 0 -> 1: Black screen for 300ms, then main image fades in
    const timer1 = setTimeout(() => {
      setAnimationStage(1);
    }, 300);

    // Stage 1 -> 2: After 1.4s, start shrinking
    const timer2 = setTimeout(() => {
      setAnimationStage(2);
    }, 1700);

    // Stage 2 -> 3: After 1.5s, side images slide in
    const timer3 = setTimeout(() => {
      setAnimationStage(3);
    }, 3200);

    // Stage 3 -> 4: Final state after 1.2s
    const timer4 = setTimeout(() => {
      setAnimationStage(4);
    }, 4400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <section className={`gallery-section stage-${animationStage}`}>
      {/* Black Overlay */}
      <div className={`black-overlay ${animationStage >= 1 ? 'hidden' : ''}`}></div>

      {/* Navbar - shows after animation complete */}
      <div className={`gallery-nav-wrapper ${animationStage >= 4 ? 'visible' : ''}`}>
        <Navbar />
      </div>

      {/* Gallery Container */}
      <div className="gallery-container">
        {/* Header - shows at final stage */}
        <div className={`gallery-header ${animationStage >= 4 ? 'visible' : ''}`}>
          <span className="gallery-label">── OUR GALLERY</span>
          <h1 className="gallery-title">
            <span className="title-line">MOMENTS OF</span>
            <span className="title-line highlight">EMPOWERMENT</span>
          </h1>
        </div>

        {/* Bento Grid */}
        <div className="gallery-grid">
          {/* Main Center Image */}
          <div className={`gallery-item main-image stage-${animationStage}`}>
            <img src={galleryImages[0].src} alt={galleryImages[0].alt} />
          </div>

          {/* Left Column - slides from left */}
          <div className={`gallery-item left-top ${animationStage >= 3 ? 'visible' : ''}`}>
            <img src={galleryImages[1].src} alt={galleryImages[1].alt} />
          </div>
          <div className={`gallery-item left-bottom ${animationStage >= 3 ? 'visible' : ''}`} style={{transitionDelay: '0.15s'}}>
            <img src={galleryImages[2].src} alt={galleryImages[2].alt} />
          </div>

          {/* Right Column - slides from right */}
          <div className={`gallery-item right-top ${animationStage >= 3 ? 'visible' : ''}`}>
            <img src={galleryImages[3].src} alt={galleryImages[3].alt} />
          </div>
          <div className={`gallery-item right-bottom ${animationStage >= 3 ? 'visible' : ''}`} style={{transitionDelay: '0.15s'}}>
            <img src={galleryImages[4].src} alt={galleryImages[4].alt} />
          </div>

          {/* Bottom Row - slides from bottom */}
          <div className={`gallery-item bottom-left ${animationStage >= 3 ? 'visible' : ''}`} style={{transitionDelay: '0.3s'}}>
            <img src={galleryImages[5].src} alt={galleryImages[5].alt} />
          </div>
          <div className={`gallery-item bottom-right ${animationStage >= 3 ? 'visible' : ''}`} style={{transitionDelay: '0.35s'}}>
            <img src={galleryImages[6].src} alt={galleryImages[6].alt} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
