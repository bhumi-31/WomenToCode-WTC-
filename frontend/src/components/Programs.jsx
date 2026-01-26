import { useState, useEffect, useRef } from 'react'
import './Programs.css'

const programsData = [
  {
    id: 1,
    title: "CODEHER",
    subtitle: "BOOTCAMP",
    description: "12-week intensive full-stack development program. From zero to deployment.",
    image: "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 2,
    title: "MENTORSHIP",
    subtitle: "PROGRAM",
    description: "1-on-1 guidance from industry experts. Personalized career roadmaps.",
    image: "https://images.pexels.com/photos/7176319/pexels-photo-7176319.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 3,
    title: "WOMEN",
    subtitle: "HACKATHONS",
    description: "Women-only coding competitions. Build, compete, and win prizes.",
    image: "https://images.pexels.com/photos/7102/notes-macbook-study-conference.jpg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 4,
    title: "WEEKLY",
    subtitle: "WORKSHOPS",
    description: "Free sessions on trending technologies. Learn from the best.",
    image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
]

function Programs() {
  const programsRef = useRef(null)
  const programsScrollRef = useRef(null)
  const [programsVisible, setProgramsVisible] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Mouse drag handlers for horizontal scroll
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - programsScrollRef.current.offsetLeft)
    setScrollLeft(programsScrollRef.current.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - programsScrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    programsScrollRef.current.scrollLeft = scrollLeft - walk
  }

  useEffect(() => {
    const programsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setProgramsVisible(true)
          } else {
            setProgramsVisible(false)
          }
        })
      },
      { threshold: 0.15 }
    )
    
    if (programsRef.current) {
      programsObserver.observe(programsRef.current)
    }
    
    return () => {
      if (programsRef.current) {
        programsObserver.unobserve(programsRef.current)
      }
    }
  }, [])

  return (
    <section id="programs" className="programs" ref={programsRef}>
      <div className="programs-container">
        <div className={`programs-header ${programsVisible ? 'animate-in' : ''}`}>
          <span className="section-tag">E X P L O R E</span>
          <h2 className="programs-title">
            <span>OUR</span>
            <span>PROGRAMS</span>
          </h2>
        </div>

        <div 
          className={`programs-scroll-container ${programsVisible ? 'animate-in' : ''}`}
          ref={programsScrollRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div className="programs-track">
            {programsData.map((program, index) => (
              <div 
                key={program.id} 
                className={`program-card ${programsVisible ? 'animate-in' : ''}`}
                style={{ animationDelay: `${0.3 + index * 0.15}s` }}
              >
                <div className="program-image-wrapper">
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="program-image"
                  />
                </div>
                <div className="program-content">
                  <h3 className="program-name">
                    <span>{program.title}</span>
                    <span>{program.subtitle}</span>
                  </h3>
                  <p className="program-description">{program.description}</p>
                  <a href="#" className="program-link">
                    LEARN MORE
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="programs-hint">
          <span>← DRAG TO EXPLORE →</span>
        </div>
      </div>
    </section>
  )
}

export default Programs
