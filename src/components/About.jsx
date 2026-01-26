import { useState, useEffect, useRef } from 'react'
import './About.css'

function About() {
  const [imageSize, setImageSize] = useState({ width: 320, height: 440, top: 55 })
  const [textOpacity, setTextOpacity] = useState(1)
  const aboutRef = useRef(null)

  useEffect(() => {
    // Target values for smooth lerping
    let targetOpacity = 1
    let targetWidth = 320
    let targetHeight = 440
    let targetTop = 55
    
    // Current animated values
    let currentOpacity = 1
    let currentWidth = 320
    let currentHeight = 440
    let currentTop = 55
    
    const lerp = (start, end, factor) => start + (end - start) * factor
    const lerpFactor = 0.08
    
    let animationId
    
    const animate = () => {
      currentOpacity = lerp(currentOpacity, targetOpacity, lerpFactor)
      currentWidth = lerp(currentWidth, targetWidth, lerpFactor)
      currentHeight = lerp(currentHeight, targetHeight, lerpFactor)
      currentTop = lerp(currentTop, targetTop, lerpFactor)
      
      setTextOpacity(currentOpacity)
      setImageSize({ 
        width: currentWidth, 
        height: currentHeight, 
        top: currentTop 
      })
      
      animationId = requestAnimationFrame(animate)
    }
    
    const handleScroll = () => {
      if (aboutRef.current) {
        const rect = aboutRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        const scrollIntoAbout = -rect.top
        const startEffectAt = 100
        const totalEffectDistance = windowHeight * 0.7
        
        if (scrollIntoAbout > startEffectAt) {
          const effectProgress = scrollIntoAbout - startEffectAt
          const progress = Math.min(Math.max(effectProgress / totalEffectDistance, 0), 1)
          
          targetOpacity = Math.max(1 - (progress * 2.5), 0)
          targetWidth = 320 + (progress * (window.innerWidth - 320))
          targetHeight = 440 + (progress * (window.innerHeight - 440))
          targetTop = 55 - (progress * 5)
        } else {
          targetOpacity = 1
          targetWidth = 320
          targetHeight = 440
          targetTop = 55
        }
      }
    }
    
    animationId = requestAnimationFrame(animate)
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section id="about" className="about" ref={aboutRef}>
      <div className="about-sticky-container">
        {/* Text Content - Fades out on scroll */}
        <div 
          className="about-text-content"
          style={{ opacity: textOpacity }}
        >
          <span className="section-tag">W E L C O M E &nbsp; T O &nbsp; W T C</span>
          <h2 className="about-title">
            <span>THE TEAM</span>
            <span>EMPOWERING</span>
            <span>WOMEN IN TECH</span>
          </h2>
        </div>

        {/* Image that reveals more on scroll */}
        <div 
          className="about-image-container"
          style={{ 
            width: `${imageSize.width}px`, 
            height: `${imageSize.height}px`,
            top: `${imageSize.top}%`
          }}
        >
          <img 
            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920" 
            alt="Women in tech team"
            className="about-image"
          />
        </div>

        {/* Description - Fades out with text */}
        <div 
          className="about-description"
          style={{ opacity: textOpacity, transform: `translateY(${(1 - textOpacity) * 30}px)` }}
        >
          <p>
            At WomenToCode, our strength lies in our people — a passionate 
            community of learners, developers, and innovators who work 
            together to create meaningful impact in tech.
          </p>
        </div>
      </div>
    </section>
  )
}

export default About
