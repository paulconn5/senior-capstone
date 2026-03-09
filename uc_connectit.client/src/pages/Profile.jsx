import { HiPencil, HiEnvelope, HiMapPin } from 'react-icons/hi2'
import Navbar from '../components/Navbar'
import './Profile.css'
import useAuth from '../hooks/useAuth'
import { useState, useEffect } from 'react'

function Profile() {
  const { profile, loading } = useAuth()
  const [view, setView] = useState({
    name: '',
    major: '',
    year: '',
    photo: 'https://via.placeholder.com/150',
    email: '',
    location: 'Cincinnati, OH',
    about: '',
    interests: [],
    stats: { mentors: 0, connections: 0, messages: 0 }
  })

  useEffect(() => {
    if (!profile) return
    setView(prev => ({
      ...prev,
      name: `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || prev.name || 'User',
      major: profile.degree ?? prev.major,
      year: profile.degreeLevel ?? prev.year,
      photo: profile.photo ?? prev.photo,
      email: profile.email ?? prev.email,
      location: profile.location ?? prev.location,
      about: profile.aboutMe ?? prev.about,
      interests: profile.tags ?? prev.interests
    }))
  }, [profile])

  if (loading) return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-main">Loading...</main>
    </div>
  )

  if (!profile) return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-main">No profile available.</main>
    </div>
  )

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-main">
        <div className="profile-card">
          <div className="profile-card-header">
            <button className="edit-profile-button">
              <HiPencil /> Edit Profile
            </button>
          </div>

          <div className="profile-card-content">
            <div className="profile-photo-wrapper">
              <img src={view.photo} alt={view.name} className="profile-photo" />
            </div>

            <h1 className="profile-name">{view.name}</h1>
            <p className="profile-subtitle">{view.major} • {view.year}</p>

            <div className="profile-info-grid">
              <div className="info-card">
                <HiEnvelope className="info-icon" />
                <div className="info-text">
                  <h3>Email</h3>
                  <p>{view.email}</p>
                </div>
              </div>

              <div className="info-card">
                <HiMapPin className="info-icon" />
                <div className="info-text">
                  <h3>Location</h3>
                  <p>{view.location}</p>
                </div>
              </div>
            </div>

            <div className="about-me-section">
              <h2>About Me</h2>
              <p>{view.about}</p>
            </div>

            <div className="interests-section">
              <h2>My Interests & Skills</h2>
              <div className="interests-tags">
                {(view.interests || []).map((interest, index) => (
                  <span key={index} className="interest-tag">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-number">{view.stats.mentors}</div>
                <div className="stat-label">Mentors</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{view.stats.connections}</div>
                <div className="stat-label">Connections</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{view.stats.messages}</div>
                <div className="stat-label">Messages</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
