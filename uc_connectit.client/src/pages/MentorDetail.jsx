import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { HiArrowLeft, HiBriefcase, HiAcademicCap, HiEnvelope, HiCalendar } from 'react-icons/hi2'
import Navbar from '../components/Navbar'
import './MentorDetail.css'
import useAuth from '../hooks/useAuth'

function MentorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadUser() {
      setLoading(true)
      setError(null)
      if (!token) {
        setError('Not authenticated.')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`https://localhost:7068/api/users/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) {
          const text = await res.text().catch(() => '')
          throw new Error(`Failed to load profile: ${res.status} ${text}`)
        }

        const data = await res.json()

        // Defensive normalization
        const careerTitle = data.careerTitle ?? data.CareerTitle ?? data.career ?? data.title ?? ''
        const firstName = data.FirstName ?? data.firstName ?? ''
        const lastName = data.LastName ?? data.lastName ?? ''
        const email = data.Email ?? data.email ?? ''
        const aboutMe = data.AboutMe ?? data.aboutMe ?? ''
        const degrees = (data.degrees ?? data.Degrees ?? []).map(d => d?.Name ?? d?.name ?? d)
        const tags = (data.tags ?? data.Tags ?? []).map(t => t?.Name ?? t?.name ?? t)
        const graduationDate = data.GraduationDate ?? data.graduationDate ?? null
        const role = data.Role ?? data.role ?? ''

        setUser({
          id: data.Id ?? data.id ?? id,
          firstName,
          lastName,
          email,
          careerTitle,
          aboutMe,
          degrees,
          tags,
          graduationDate,
          role
        })
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [id, token])

  const handleBack = () => navigate('/dashboard')

  if (loading) {
    return (
      <div className="mentor-detail-page">
        <Navbar />
        <main className="mentor-detail-main">
          <p>Loading profile...</p>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mentor-detail-page">
        <Navbar />
        <main className="mentor-detail-main">
          <button className="back-button" onClick={handleBack}><HiArrowLeft /> Back</button>
          <p className="error">Error loading profile: {error}</p>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mentor-detail-page">
        <Navbar />
        <main className="mentor-detail-main">
          <button className="back-button" onClick={handleBack}><HiArrowLeft /> Back</button>
          <p>No profile available.</p>
        </main>
      </div>
    )
  }

  // Compute initials for the large avatar
  const initials = (() => {
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim()
    if (!name) return ''
    const parts = name.split(/\s+/)
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  })()

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'

  return (
    <div className="mentor-detail-page">
      <Navbar />

      <main className="mentor-detail-main">
        <button className="back-button" onClick={handleBack}>
          <HiArrowLeft /> Back to Matches
        </button>

        <div className="mentor-profile-card">
          <div className="profile-header"></div>
          <div className="profile-content">
            {/* Use initials avatar (styled in MentorCard.css .detail-avatar) */}
            <div className="detail-avatar" aria-hidden title={fullName}>
              {initials}
            </div>

            <h1 className="mentor-name">{fullName}</h1>
            {user.careerTitle && <p className="mentor-title">{user.careerTitle}</p>}

            <div className="mentor-details-grid">
              {user.careerTitle && (
                <div className="detail-card">
                  <HiBriefcase className="detail-icon" />
                  <div className="detail-content">
                    <h3>Career Field</h3>
                    <p>{user.careerTitle}</p>
                  </div>
                </div>
              )}

              <div className="detail-card">
                <HiAcademicCap className="detail-icon" />
                <div className="detail-content">
                  <h3>Degrees</h3>
                  <p>{(user.degrees && user.degrees.length) ? user.degrees.join(', ') : 'N/A'}</p>
                </div>
              </div>

              <div className="detail-card">
                <HiEnvelope className="detail-icon" />
                <div className="detail-content">
                  <h3>Email</h3>
                  <p>{user.email || 'Hidden'}</p>
                </div>
              </div>

              {user.graduationDate && (
                <div className="detail-card">
                  <HiCalendar className="detail-icon" />
                  <div className="detail-content">
                    <h3>Graduation Year</h3>
                    <p>{user.graduationDate}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="interests-section">
              <h3>Interests & Skills</h3>
              <div className="interests-tags">
                {(user.tags || []).map((interest, idx) => (
                  <span key={idx} className="interest-tag">{interest}</span>
                ))}
                {(!user.tags || user.tags.length === 0) && <p>No skills listed.</p>}
              </div>
            </div>

            <div className="about-section">
              <h3>About</h3>
              <p>{user.aboutMe || 'No bio provided.'}</p>
            </div>

            <div className="action-buttons">
              <button className="btn-primary">
                <HiEnvelope /> Message
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MentorDetail
