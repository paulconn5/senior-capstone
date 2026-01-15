import { useParams, useNavigate } from 'react-router-dom'
import { HiArrowLeft, HiBriefcase, HiAcademicCap, HiEnvelope, HiCalendar, HiCheckCircle } from 'react-icons/hi2'
import Navbar from '../components/Navbar'
import './MentorDetail.css'

function MentorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Sample mentor data (in a real app, fetch based on id)
  const mentor = {
    id: 1,
    name: 'David Miller',
    photo: 'https://via.placeholder.com/150',
    title: 'Senior Cybersecurity Director at Great American Insurance Group',
    field: 'Cybersecurity',
    education: "Master's in Cybersecurity",
    interests: ['Security Architecture', 'Risk Management', 'Network Security', 'Incident Response', 'Threat Analysis', 'Compliance'],
    about: "I'm a Senior Cybersecurity Director at Great American Insurance Group with over 15 years of experience in information security. I'm passionate about mentoring the next generation of cybersecurity professionals and helping students navigate their career paths. I have extensive experience in security architecture, risk management, and building security programs. I'm here to help you understand the cybersecurity landscape, explore different career opportunities, and connect you with valuable industry contacts."
  }

  const benefits = [
    'Get personalized career guidance from an experienced professional',
    'Learn about the latest trends and technologies in IT',
    'Receive advice on skill development and certifications',
    'Build your professional network in the industry'
  ]

  return (
    <div className="mentor-detail-page">
      <Navbar />

      <main className="mentor-detail-main">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          <HiArrowLeft /> Back to Mentors
        </button>

        <div className="mentor-profile-card">
          <div className="profile-header"></div>
          <div className="profile-content">
            <div className="profile-photo-wrapper">
              <img src={mentor.photo} alt={mentor.name} className="profile-photo" />
            </div>

            <h1 className="mentor-name">{mentor.name}</h1>
            <p className="mentor-title">{mentor.title}</p>

            <div className="mentor-details-grid">
              <div className="detail-card">
                <HiBriefcase className="detail-icon" />
                <div className="detail-content">
                  <h3>Career Field</h3>
                  <p>{mentor.field}</p>
                </div>
              </div>

              <div className="detail-card">
                <HiAcademicCap className="detail-icon" />
                <div className="detail-content">
                  <h3>Education Level</h3>
                  <p>{mentor.education}</p>
                </div>
              </div>
            </div>

            <div className="interests-section">
              <h3>Interests & Skills</h3>
              <div className="interests-tags">
                {mentor.interests.map((interest, index) => (
                  <span key={index} className="interest-tag">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="about-section">
              <h3>About</h3>
              <p>{mentor.about}</p>
            </div>

            <div className="action-buttons">
              <button className="btn-primary">
                <HiEnvelope /> Request Mentorship
              </button>
              <button className="btn-secondary">
                <HiCalendar /> Schedule Meeting
              </button>
            </div>
          </div>
        </div>

        <div className="why-connect-section">
          <h2>Why Connect?</h2>
          <ul className="benefits-list">
            {benefits.map((benefit, index) => (
              <li key={index}>
                <HiCheckCircle className="check-icon" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}

export default MentorDetail
