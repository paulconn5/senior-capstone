import { HiPencil, HiEnvelope, HiMapPin } from 'react-icons/hi2'
import Navbar from '../components/Navbar'
import './Profile.css'

function Profile() {
  const user = {
    name: 'Daniel Thompson',
    major: 'Cybersecurity',
    year: 'Freshman',
    photo: 'https://via.placeholder.com/150',
    email: 'thompsda@mail.uc.edu',
    location: 'Cincinnati, OH',
    about: 'First-year Cybersecurity student eager to learn about career pathways in cybersecurity and security best practices. Looking for guidance on co-op opportunities and connections with industry professionals.',
    interests: ['Cybersecurity', 'Network Security', 'Ethical Hacking', 'Python', 'Penetration Testing'],
    stats: {
      mentors: 1,
      connections: 4,
      messages: 2
    }
  }

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
              <img src={user.photo} alt={user.name} className="profile-photo" />
            </div>

            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-subtitle">{user.major} • {user.year}</p>

            <div className="profile-info-grid">
              <div className="info-card">
                <HiEnvelope className="info-icon" />
                <div className="info-text">
                  <h3>Email</h3>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="info-card">
                <HiMapPin className="info-icon" />
                <div className="info-text">
                  <h3>Location</h3>
                  <p>{user.location}</p>
                </div>
              </div>
            </div>

            <div className="about-me-section">
              <h2>About Me</h2>
              <p>{user.about}</p>
            </div>

            <div className="interests-section">
              <h2>My Interests & Skills</h2>
              <div className="interests-tags">
                {user.interests.map((interest, index) => (
                  <span key={index} className="interest-tag">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-number">{user.stats.mentors}</div>
                <div className="stat-label">Mentors</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{user.stats.connections}</div>
                <div className="stat-label">Connections</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{user.stats.messages}</div>
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
