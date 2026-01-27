import { useState, useEffect, useRef } from 'react';
import { projectsData, categories } from '../data/projectsData';
import Navbar from './Navbar';
import './Projects.css';

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState(projectsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleChars, setVisibleChars] = useState({ line1: 0, line2: 0, line3: 0 });
  const animationStarted = useRef(false);

  const line1 = "WOMEN";
  const line2 = "BUILDING THE";
  const line3 = "FUTURE";

  // Character by character animation for heading
  useEffect(() => {
    if (animationStarted.current) return;
    animationStarted.current = true;

    let charIndex = 0;
    
    // Animate line 1
    const animateLine1 = setInterval(() => {
      if (charIndex < line1.length) {
        setVisibleChars(prev => ({ ...prev, line1: charIndex + 1 }));
        charIndex++;
      } else {
        clearInterval(animateLine1);
        charIndex = 0;
        
        // Animate line 2
        setTimeout(() => {
          const animateLine2 = setInterval(() => {
            if (charIndex < line2.length) {
              setVisibleChars(prev => ({ ...prev, line2: charIndex + 1 }));
              charIndex++;
            } else {
              clearInterval(animateLine2);
              charIndex = 0;
              
              // Animate line 3
              setTimeout(() => {
                const animateLine3 = setInterval(() => {
                  if (charIndex < line3.length) {
                    setVisibleChars(prev => ({ ...prev, line3: charIndex + 1 }));
                    charIndex++;
                  } else {
                    clearInterval(animateLine3);
                    setTimeout(() => setIsVisible(true), 200);
                  }
                }, 80);
              }, 100);
            }
          }, 50);
        }, 100);
      }
    }, 80);

    return () => {};
  }, []);

  useEffect(() => {
    let filtered = projectsData;
    
    if (activeCategory !== 'All') {
      filtered = filtered.filter(project => project.category === activeCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase())) ||
        project.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProjects(filtered);
  }, [activeCategory, searchQuery]);

  const openProject = (project) => {
    setSelectedProject(project);
    setTimeout(() => setIsModalOpen(true), 10);
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedProject(null);
      document.body.style.overflow = 'auto';
    }, 400);
  };

  const totalProjects = projectsData.length;
  const uniqueCreators = [...new Set(projectsData.map(p => p.creator.name))].length;

  return (
    <section className="projects-section">
      <Navbar />
      <div className="projects-container">
        {/* Header */}
        <div className="projects-header">
          <div className="projects-header-left">
            <span className={`projects-label ${visibleChars.line1 > 0 ? 'visible' : ''}`}>── OUR PROJECTS</span>
            <h1 className="projects-title">
              <span className="title-line">
                {line1.split('').map((char, i) => (
                  <span 
                    key={i} 
                    className={`char-animate ${i < visibleChars.line1 ? 'visible' : ''}`}
                  >
                    {char}
                  </span>
                ))}
              </span>
              <span className="title-line">
                {line2.split('').map((char, i) => (
                  <span 
                    key={i} 
                    className={`char-animate ${i < visibleChars.line2 ? 'visible' : ''}`}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
              <span className="title-line highlight">
                {line3.split('').map((char, i) => (
                  <span 
                    key={i} 
                    className={`char-animate highlight-char ${i < visibleChars.line3 ? 'visible' : ''}`}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </h1>
            <p className={`projects-stats ${isVisible ? 'visible' : ''}`}>
              {totalProjects} projects by {uniqueCreators} incredible women
            </p>
          </div>
          
          <div className={`projects-header-right ${isVisible ? 'visible' : ''}`}>
            <div className="search-container">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search projects, tech, or creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-chips">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`filter-chip ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`project-card ${isVisible ? 'visible' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => openProject(project)}
            >
              <div className="project-image-container">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="project-image"
                />
                <div className="project-overlay">
                  <div className="arrow-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M17 7H7M17 7V17"/>
                    </svg>
                  </div>
                </div>
                {project.featured && (
                  <span className="featured-badge">Featured</span>
                )}
              </div>

              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                
                <div className="project-tech-stack">
                  {project.techStack.slice(0, 3).map((tech, i) => (
                    <span key={i} className="tech-pill">{tech}</span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="tech-pill more">+{project.techStack.length - 3}</span>
                  )}
                </div>

                <div className="project-creator">
                  <img 
                    src={project.creator.image} 
                    alt={project.creator.name}
                    className="creator-image"
                  />
                  <span className="creator-name">{project.creator.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="no-results">
            <p>No projects found matching your criteria.</p>
            <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div className={`project-modal-backdrop ${isModalOpen ? 'open' : ''}`} onClick={closeProject}>
          <div className={`project-modal ${isModalOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeProject}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>

            <div className="modal-content">
              <div className="modal-image-section">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  className="modal-image"
                />
              </div>

              <div className="modal-info-section">
                <span className="modal-category">{selectedProject.category}</span>
                
                <h2 className="modal-title">{selectedProject.title}</h2>
                
                <p className="modal-description">{selectedProject.description}</p>

                <div className="modal-tech-section">
                  <h4 className="modal-section-title">Tech Stack</h4>
                  <div className="modal-tech-stack">
                    {selectedProject.techStack.map((tech, i) => (
                      <span key={i} className="modal-tech-pill">{tech}</span>
                    ))}
                  </div>
                </div>

                <div className="modal-links">
                  {selectedProject.liveDemo && (
                    <a 
                      href={selectedProject.liveDemo} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="modal-link demo"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      Live Demo
                    </a>
                  )}
                  <a 
                    href={selectedProject.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="modal-link github"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                </div>

                <div className="modal-creator">
                  <img 
                    src={selectedProject.creator.image} 
                    alt={selectedProject.creator.name}
                    className="modal-creator-image"
                  />
                  <div className="modal-creator-info">
                    <span className="modal-creator-name">{selectedProject.creator.name}</span>
                    <span className="modal-creator-role">{selectedProject.creator.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
