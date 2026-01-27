import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { eventsData } from '../data/eventsData'
import Navbar from './Navbar'
import './Events.css'

function Events() {
  const [loaded, setLoaded] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    window.scrollTo(0, 0)
    setTimeout(() => setLoaded(true), 100)
  }, [])

  const filteredEvents = filter === 'all' 
    ? eventsData 
    : eventsData.filter(event => event.type.toLowerCase() === filter)

  return (
    <div className="events-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className={`events-hero ${loaded ? 'loaded' : ''}`}>
        <div className="events-hero-content">
          <span className="events-badge">✦ EVENTS & WORKSHOPS</span>
          <h1 className="events-page-title">
            <span className="line">LEARN.</span>
            <span className="line gradient">GROW.</span>
            <span className="line">CONNECT.</span>
          </h1>
          <p className="events-page-subtitle">
            Join our workshops, talks, and hackathons to level up your skills
          </p>
        </div>
        <div className="events-hero-bg"></div>
      </section>

      {/* Filter Tabs */}
      <section className="events-filter-section">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Events
          </button>
          <button 
            className={`filter-tab ${filter === 'workshop' ? 'active' : ''}`}
            onClick={() => setFilter('workshop')}
          >
            Workshops
          </button>
          <button 
            className={`filter-tab ${filter === 'talk' ? 'active' : ''}`}
            onClick={() => setFilter('talk')}
          >
            Talks
          </button>
          <button 
            className={`filter-tab ${filter === 'hackathon' ? 'active' : ''}`}
            onClick={() => setFilter('hackathon')}
          >
            Hackathons
          </button>
        </div>
      </section>

      {/* Events Grid */}
      <section className="events-grid-section">
        <div className="events-grid">
          {filteredEvents.map((event, index) => (
            <div 
              key={event.id}
              className={`event-card ${loaded ? 'visible' : ''}`}
              style={{ '--delay': `${index * 0.1}s` }}
            >
              {/* Date Badge */}
              <div className="event-card-date">
                <span className="card-day">{event.date}</span>
                <span className="card-month">{event.month}</span>
              </div>

              {/* Speaker */}
              <div className="event-card-speaker">
                <img 
                  src={event.speaker.image} 
                  alt={event.speaker.name}
                  className="card-speaker-img"
                />
                <div className="card-speaker-info">
                  <h4>{event.speaker.name}</h4>
                  <p>{event.speaker.role}</p>
                </div>
              </div>

              {/* Content */}
              <div className="event-card-content">
                <span className="card-type">{event.type}</span>
                <h3 className="card-title">{event.title}</h3>
                <p className="card-description">{event.description}</p>
                
                <div className="card-meta">
                  <span>📍 {event.location}</span>
                  <span>⏱ {event.time}</span>
                </div>

                <a href={event.registrationLink} className="card-register-btn">
                  Register →
                </a>
              </div>

              <div className="event-card-glow"></div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="no-events">
            <p>No events found in this category.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="events-cta-section">
        <div className="events-cta-content">
          <h2>Want to Host an Event?</h2>
          <p>Have an idea for a workshop or talk? We'd love to help you share your knowledge!</p>
          <Link to="/contact" className="events-cta-btn">Get in Touch</Link>
        </div>
      </section>
    </div>
  )
}

export default Events
