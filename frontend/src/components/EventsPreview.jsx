import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { eventsData } from '../data/eventsData'
import './EventsPreview.css'

function EventsPreview() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
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

  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setActiveIndex(prev => (prev === 0 ? eventsData.length - 1 : prev - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setActiveIndex(prev => (prev === eventsData.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleDateClick = (index) => {
    if (isAnimating || index === activeIndex) return
    setIsAnimating(true)
    setActiveIndex(index)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const activeEvent = eventsData[activeIndex]

  return (
    <section 
      id="events" 
      className={`events-preview ${isVisible ? 'visible' : ''}`}
      ref={sectionRef}
    >
      <div className={`events-container ${isVisible ? 'animate-in' : ''}`}>
        {/* Header */}
        <div className="events-header">
          <h2 className="events-tag">
            {'UPCOMING EVENTS'.split('').map((char, index) => (
              <span 
                key={index} 
                className={`char ${isVisible ? 'animate' : ''}`}
                style={{ '--char-index': index }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h2>
          <div className={`events-nav-arrows ${isVisible ? 'animate-in' : ''}`}>
            <button 
              className="nav-arrow prev" 
              onClick={handlePrev}
              aria-label="Previous event"
            >
              ←
            </button>
            <button 
              className="nav-arrow next" 
              onClick={handleNext}
              aria-label="Next event"
            >
              →
            </button>
          </div>
        </div>

        {/* Main Event Card */}
        <div className={`event-showcase ${isVisible ? 'animate-in' : ''}`}>
          {/* Big Date Background */}
          <div className={`event-date-bg ${isVisible ? 'animate-in' : ''}`}>
            <span className="date-day">{activeEvent.date}</span>
            <span className="date-month">{activeEvent.month}</span>
          </div>

          {/* Event Content */}
          <div className={`event-content ${isAnimating ? 'animating' : ''}`}>
            {/* Speaker Image */}
            <div className={`speaker-image-wrapper ${isVisible ? 'animate-in' : ''}`}>
              <img 
                src={activeEvent.speaker.image} 
                alt={activeEvent.speaker.name}
                className="speaker-image"
              />
              <div className="speaker-image-glow"></div>
            </div>

            {/* Event Details */}
            <div className={`event-details ${isVisible ? 'animate-in' : ''}`}>
              <div className="speaker-info anim-item" style={{ '--item-index': 0 }}>
                <h3 className="speaker-name">{activeEvent.speaker.name}</h3>
                <p className="speaker-role">{activeEvent.speaker.role}</p>
              </div>

              <div className="event-title-wrapper anim-item" style={{ '--item-index': 1 }}>
                <span className="event-type">{activeEvent.type}</span>
                <h2 className="event-title">{activeEvent.title}</h2>
              </div>

              <p className="event-description anim-item" style={{ '--item-index': 2 }}>{activeEvent.description}</p>

              <div className="event-meta anim-item" style={{ '--item-index': 3 }}>
                <div className="meta-item">
                  <span className="meta-icon">📍</span>
                  <span>{activeEvent.location}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">⏱</span>
                  <span>{activeEvent.time}</span>
                </div>
              </div>

              <a href={activeEvent.registrationLink} className="register-btn anim-item" style={{ '--item-index': 4 }}>
                <span className="btn-icon">✦</span>
                <span>REGISTER NOW</span>
              </a>
            </div>
          </div>
        </div>

        {/* Mini Date Cards */}
        <div className={`event-timeline ${isVisible ? 'animate-in' : ''}`}>
          {eventsData.map((event, index) => (
            <button
              key={event.id}
              className={`timeline-item ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleDateClick(index)}
              style={{ '--timeline-index': index }}
            >
              <span className="timeline-date">{event.date}</span>
              <span className="timeline-month">{event.month}</span>
            </button>
          ))}
        </div>

        {/* View All Link */}
        <Link to="/events" className={`view-all-link ${isVisible ? 'animate-in' : ''}`}>
          VIEW ALL EVENTS
          <span className="arrow">→</span>
        </Link>
      </div>
    </section>
  )
}

export default EventsPreview
