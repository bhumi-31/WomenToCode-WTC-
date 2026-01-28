import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Gallery.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Fallback images (14 for demo - 2 rows)
const defaultImages = [
  // Row 1
  { id: 1, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop", title: "Woman coding at desk" },
  { id: 2, image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=500&fit=crop", title: "Professional woman developer" },
  { id: 3, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop", title: "Woman in tech" },
  { id: 4, image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop", title: "Coding workshop" },
  { id: 5, image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop", title: "Woman at hackathon" },
  { id: 6, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop", title: "Team collaboration" },
  { id: 7, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop", title: "Mentoring session" },
  // Row 2
  { id: 8, image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop", title: "Team meeting" },
  { id: 9, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=500&fit=crop", title: "Group discussion" },
  { id: 10, image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=300&fit=crop", title: "Friends coding" },
  { id: 11, image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&h=400&fit=crop", title: "Tech talk" },
  { id: 12, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop", title: "Developer at work" },
  { id: 13, image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop", title: "Workshop session" },
  { id: 14, image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop", title: "Brainstorming" }
];

// Helper: Split images into chunks of 7 for bento rows
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

// Component for a single Bento Row
const BentoRow = ({ images, rowIndex, animationStage, isFirstRow }) => {
  // For first row, use animation stages; for others, show immediately when stage >= 4
  const showItems = isFirstRow ? animationStage >= 3 : animationStage >= 4;
  const showMain = isFirstRow ? true : animationStage >= 4;

  // Get image URL safely
  const getImageUrl = (img) => img?.image || img?.src || '';
  const getImageAlt = (img) => img?.title || img?.alt || 'Gallery image';

  // If not enough images for a complete row, render partial
  if (!images || images.length === 0) return null;

  return (
    <div className={`gallery-grid ${!isFirstRow ? 'additional-row' : ''}`}>
      {/* Main Center Image (index 0) */}
      {images[0] && (
        <div className={`gallery-item main-image ${isFirstRow ? `stage-${animationStage}` : 'visible-static'}`}>
          <img src={getImageUrl(images[0])} alt={getImageAlt(images[0])} />
        </div>
      )}

      {/* Left Column (index 1, 2) */}
      {images[1] && (
        <div className={`gallery-item left-top ${showItems ? 'visible' : ''}`}>
          <img src={getImageUrl(images[1])} alt={getImageAlt(images[1])} />
        </div>
      )}
      {images[2] && (
        <div className={`gallery-item left-bottom ${showItems ? 'visible' : ''}`} style={{transitionDelay: isFirstRow ? '0.15s' : '0s'}}>
          <img src={getImageUrl(images[2])} alt={getImageAlt(images[2])} />
        </div>
      )}

      {/* Right Column (index 3, 4) */}
      {images[3] && (
        <div className={`gallery-item right-top ${showItems ? 'visible' : ''}`}>
          <img src={getImageUrl(images[3])} alt={getImageAlt(images[3])} />
        </div>
      )}
      {images[4] && (
        <div className={`gallery-item right-bottom ${showItems ? 'visible' : ''}`} style={{transitionDelay: isFirstRow ? '0.15s' : '0s'}}>
          <img src={getImageUrl(images[4])} alt={getImageAlt(images[4])} />
        </div>
      )}

      {/* Bottom Row (index 5, 6) */}
      {images[5] && (
        <div className={`gallery-item bottom-left ${showItems ? 'visible' : ''}`} style={{transitionDelay: isFirstRow ? '0.3s' : '0s'}}>
          <img src={getImageUrl(images[5])} alt={getImageAlt(images[5])} />
        </div>
      )}
      {images[6] && (
        <div className={`gallery-item bottom-right ${showItems ? 'visible' : ''}`} style={{transitionDelay: isFirstRow ? '0.35s' : '0s'}}>
          <img src={getImageUrl(images[6])} alt={getImageAlt(images[6])} />
        </div>
      )}
    </div>
  );
};

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState(defaultImages);
  const [animationStage, setAnimationStage] = useState(0);
  // Stage 0: Black screen
  // Stage 1: Main image appears (large)
  // Stage 2: Main image shrinks
  // Stage 3: Side images slide in
  // Stage 4: Final grid complete

  useEffect(() => {
    // Fetch gallery images from backend
    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_URL}/gallery`);
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          // Use ALL images from backend (no more slice!)
          setGalleryImages(data.data);
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
      }
    };
    fetchImages();

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

  // Split images into rows of 7
  const imageRows = chunkArray(galleryImages, 7);

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

        {/* Render all Bento Rows */}
        {imageRows.map((rowImages, index) => (
          <BentoRow 
            key={index}
            images={rowImages}
            rowIndex={index}
            animationStage={animationStage}
            isFirstRow={index === 0}
          />
        ))}

        {/* Image Count */}
        {animationStage >= 4 && (
          <div className="gallery-count">
            <span>{galleryImages.length} MOMENTS CAPTURED</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
