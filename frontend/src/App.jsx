import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import WhatWeOffer from './components/WhatWeOffer'
import EventsPreview from './components/EventsPreview'
import JoinCTA from './components/JoinCTA'
import Footer from './components/Footer'
import Events from './components/Events'
import Team from './components/Team'
import TeamMember from './components/TeamMember'
import Contact from './components/Contact'
import Projects from './components/Projects'
import Gallery from './components/Gallery'
import Articles from './components/Articles'
import Login from './components/Login'
import Signup from './components/Signup'
import AuthCallback from './components/AuthCallback'
import Profile from './components/Profile'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'

// Admin Components
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminUsers from './components/admin/AdminUsers'
import AdminMessages from './components/admin/AdminMessages'
import AdminTeam from './components/admin/AdminTeam'
import AdminEvents from './components/admin/AdminEvents'
import AdminProjects from './components/admin/AdminProjects'
import AdminGallery from './components/admin/AdminGallery'
import AdminArticles from './components/admin/AdminArticles'

// Home page component
function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <WhatWeOffer />
      <EventsPreview />
      <JoinCTA />
      <Footer />
    </>
  )
}

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team/:memberId" element={<TeamMember />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="team" element={<AdminTeam />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="articles" element={<AdminArticles />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
