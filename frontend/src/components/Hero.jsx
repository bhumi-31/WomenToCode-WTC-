import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'

function Hero() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <section id="home" className="hero">
      {/* Video Background */}
      <div className="hero-bg-container">
        <video
          className="hero-bg-video"
          autoPlay
          muted
          loop
          playsInline
          src="/hero-bg.mp4"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Hero Content */}
      <div className={`hero-content ${loaded ? 'loaded' : ''}`}>
        <h1 className="hero-title">
          <span className="title-line line-1">CODE</span>
          <span className="title-line line-2">THE</span>
          <span className="title-line line-3">FUTURE</span>
        </h1>

        <div className="hero-subtitle">
          <p>Empowering women in tech through<br />community, education, and opportunity.</p>
        </div>

        <Link to="/join" className="hero-btn">
          <span className="btn-icon">✦</span>
          <span className="btn-text">JOIN US NOW</span>
        </Link>
      </div>

      {/* Right Side Description - Kinetics Style */}
      <div className={`hero-side-text ${loaded ? 'loaded' : ''}`}>
        <p>We create extraordinary opportunities for women to learn, grow, and lead in technology.</p>
      </div>

      {/* Bottom Right Watermark - DYC Style */}
      <div className="hero-watermark">
        <span>WTC</span>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-line"></div>
      </div>
    </section>
  )
}

export default Hero
