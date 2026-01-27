import { useState, useEffect, useRef } from 'react'
import './JoinCTA.css'

function JoinCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const titleWords = ['EMPOWERING', 'WOMEN TO', 'CODE.']

  return (
    <section className="join-cta-section" ref={sectionRef}>
      <div className={`join-cta-container ${isVisible ? 'visible' : ''}`}>
        
        {/* Tag */}
        <span className="join-tag">JOIN THE MOVEMENT</span>

        {/* Main Title */}
        <h2 className="join-title">
          {titleWords.map((word, wordIndex) => (
            <span key={wordIndex} className="title-line">
              {word.split('').map((char, charIndex) => (
                <span
                  key={charIndex}
                  className={`char ${isVisible ? 'animate' : ''}`}
                  style={{ '--char-index': wordIndex * 10 + charIndex }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          ))}
        </h2>

        {/* Description */}
        <p className="join-description">
          At WomenToCode, we believe in empowering women to lead through innovation and 
          creativity. Whether you're a beginner, developer, designer, or visionary — this is 
          your chance to be part of something bigger.
        </p>

        {/* CTA Button */}
        <a href="#" className="join-btn">
          <span className="btn-icon">✦</span>
          <span>BECOME A MEMBER</span>
        </a>

      </div>
    </section>
  )
}

export default JoinCTA
