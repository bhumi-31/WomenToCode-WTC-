import { useState, useEffect, useRef } from 'react'
import './WhatWeOffer.css'

const offerings = [
  {
    id: 1,
    title: "Hands-on Coding Sessions",
    description: "Regular coding classes and practice sessions to strengthen core technical skills",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=800&fit=crop"
  },
  {
    id: 2,
    title: "Workshops & Tech Events",
    description: "Expert-led workshops on trending technologies and real-world applications",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=800&fit=crop"
  },
  {
    id: 3,
    title: "Mentorship & Career Guidance",
    description: "Support from seniors, mentors, and industry professionals",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=800&fit=crop"
  },
  {
    id: 4,
    title: "Internship & Opportunity Guidance",
    description: "Updates and guidance on internships, hackathons, scholarships, GSoC, Outreachy, and tech programs",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=800&fit=crop"
  },
  {
    id: 5,
    title: "Project-Based Learning",
    description: "Real-world projects to build practical experience and strong portfolios",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=800&fit=crop"
  },
  {
    id: 6,
    title: "Placement Preparation Support",
    description: "Resume building, mock interviews, and interview preparation sessions",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=800&fit=crop"
  },
  {
    id: 7,
    title: "Open-Source Exposure",
    description: "Guidance on contributing to open-source projects and communities",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=800&fit=crop"
  },
  {
    id: 8,
    title: "Leadership & Growth",
    description: "Chances to lead teams, organize events, and build confidence",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=800&fit=crop"
  },
  {
    id: 9,
    title: "Safe & Inclusive Environment",
    description: "A supportive community where women can learn, ask questions, and grow without hesitation",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=800&fit=crop"
  },
  {
    id: 10,
    title: "Networking & Peer Learning",
    description: "Connect with like-minded peers and expand professional networks",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=800&fit=crop"
  }
]

function WhatWeOffer() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setTimeout(() => setLoaded(true), 100)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleCardClick = (index) => {
    if (isAnimating || index === activeIndex) return
    
    setIsAnimating(true)
    setActiveIndex(index)
    
    setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  const handleNext = () => {
    if (isAnimating) return
    const nextIndex = (activeIndex + 1) % offerings.length
    handleCardClick(nextIndex)
  }

  const handlePrev = () => {
    if (isAnimating) return
    const prevIndex = (activeIndex - 1 + offerings.length) % offerings.length
    handleCardClick(prevIndex)
  }

  const getCardStyle = (index) => {
    const diff = index - activeIndex
    const totalCards = offerings.length
    
    // Handle wrap-around for circular carousel
    let adjustedDiff = diff
    if (diff > totalCards / 2) adjustedDiff = diff - totalCards
    if (diff < -totalCards / 2) adjustedDiff = diff + totalCards

    const isActive = index === activeIndex
    const isPrev1 = adjustedDiff === -1
    const isPrev2 = adjustedDiff === -2
    const isNext1 = adjustedDiff === 1
    const isNext2 = adjustedDiff === 2
    const isHidden = Math.abs(adjustedDiff) > 2

    if (isHidden) {
      return {
        transform: 'translateX(0) translateZ(-500px) rotateY(0deg) scale(0.5)',
        opacity: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }
    }

    if (isActive) {
      return {
        transform: 'translateX(0) translateZ(0) rotateY(0deg) scale(1)',
        opacity: 1,
        zIndex: 5
      }
    }

    if (isPrev1) {
      return {
        transform: 'translateX(-65%) translateZ(-100px) rotateY(25deg) scale(0.85)',
        opacity: 0.7,
        zIndex: 4
      }
    }

    if (isPrev2) {
      return {
        transform: 'translateX(-90%) translateZ(-200px) rotateY(35deg) scale(0.7)',
        opacity: 0.4,
        zIndex: 3
      }
    }

    if (isNext1) {
      return {
        transform: 'translateX(65%) translateZ(-100px) rotateY(-25deg) scale(0.85)',
        opacity: 0.7,
        zIndex: 4
      }
    }

    if (isNext2) {
      return {
        transform: 'translateX(90%) translateZ(-200px) rotateY(-35deg) scale(0.7)',
        opacity: 0.4,
        zIndex: 3
      }
    }

    return {
      transform: 'translateX(0) translateZ(-300px) scale(0.6)',
      opacity: 0,
      zIndex: 1
    }
  }

  // Title text for typewriter effect
  const line1 = "EMPOWERING WOMEN"
  const line2 = "WITH REAL SKILLS"

  return (
    <section 
      id="offerings" 
      ref={sectionRef}
      className={`what-we-offer ${loaded ? 'loaded' : ''} ${isVisible ? 'visible' : ''}`}
    >
      {/* Dark Overlay Background - Same as Hero */}
      <div className="offer-bg-overlay"></div>

      {/* Header with Typewriter Animation */}
      <div className="offer-header">
        <span className="offer-badge">✦ WHAT WE OFFER</span>
        <h2 className="offer-title">
          <span className="line typewriter">
            {line1.split('').map((char, i) => (
              <span 
                key={i} 
                className="char"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
          <span className="line gradient typewriter">
            {line2.split('').map((char, i) => (
              <span 
                key={i} 
                className="char"
                style={{ animationDelay: `${(line1.length * 0.05) + (i * 0.05)}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </h2>
      </div>

      {/* 3D Carousel */}
      <div className="carousel-container">
        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button className="carousel-nav prev" onClick={handlePrev} aria-label="Previous">
            <span>‹</span>
          </button>

          {/* Cards Stack */}
          <div className="cards-stack">
            {offerings.map((offering, index) => (
              <div
                key={offering.id}
                className={`offer-card ${index === activeIndex ? 'active' : ''}`}
                style={getCardStyle(index)}
                onMouseEnter={() => {
                  if (index !== activeIndex) {
                    handleCardClick(index)
                  }
                }}
              >
                <div className="card-inner">
                  <div 
                    className="card-bg"
                    style={{ backgroundImage: `url(${offering.image})` }}
                  ></div>
                  <div className="card-overlay"></div>
                  <div className="card-content">
                    <span className="card-icon">{offering.icon}</span>
                    <h3 className="card-title">{offering.title}</h3>
                    <p className="card-description">{offering.description}</p>
                  </div>
                  <div className="card-shine"></div>
                </div>
              </div>
            ))}
          </div>

          <button className="carousel-nav next" onClick={handleNext} aria-label="Next">
            <span>›</span>
          </button>
        </div>

        {/* Active Card Label */}
        <div className="active-label">
          <span className="label-number">0{activeIndex + 1}</span>
          <span className="label-divider">/</span>
          <span className="label-total">{offerings.length}</span>
        </div>

        {/* Dots Navigation */}
        <div className="carousel-dots">
          {offerings.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleCardClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhatWeOffer
