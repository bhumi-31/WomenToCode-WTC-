import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { teamMembers } from '../data/teamData'
import Navbar from './Navbar'
import './Team.css'

function Team() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0)
    
    // Trigger animations
    setTimeout(() => setLoaded(true), 100)
  }, [])

  return (
    <div className="team-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="team-hero">
        <div className="team-hero-content">
          <span className="team-badge">✦ MEET THE TEAM</span>
          <h1 className="team-title">
            <span className="line">THE WOMEN</span>
            <span className="line gradient">BEHIND</span>
            <span className="line">WOMENTOCODE</span>
          </h1>
          <p className="team-subtitle">
            Passionate leaders, educators, and innovators driving change in tech
          </p>
        </div>
        <div className="team-hero-bg"></div>
      </section>

      {/* Team Grid */}
      <section className="team-grid-section">
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <Link 
              to={`/team/${member.id}`} 
              key={member.id}
              className={`team-card ${loaded ? 'visible' : ''}`}
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className="card-image-container">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="card-image"
                />
                <div className="card-overlay">
                  <span className="view-profile">View Profile →</span>
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-name">{member.name}</h3>
                <p className="card-role">{member.role}</p>
              </div>
              <div className="card-glow"></div>
            </Link>
          ))}
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="join-team-section">
        <div className="join-team-content">
          <h2>Want to Join Our Team?</h2>
          <p>We're always looking for passionate individuals to help us empower more women in tech.</p>
          <a href="#" className="join-team-btn">View Open Positions</a>
        </div>
      </section>
    </div>
  )
}

export default Team
