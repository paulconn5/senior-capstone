import { HiPencil, HiEnvelope, HiBriefcase } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Profile.css'
import useAuth from '../hooks/useAuth'

function Profile() {
    const { profile, loading } = useAuth()
    const navigate = useNavigate()

    if (loading) {
        return (
            <div className="profile-page">
                <Navbar />
                <main className="profile-main">Loading...</main>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="profile-page">
                <Navbar />
                <main className="profile-main">No profile available.</main>
            </div>
        )
    }

    const initials = (() => {
        const name = `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
        if (!name) return ''
        const parts = name.split(/\s+/)
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
    })()

    const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim()

    return (
        <div className="profile-page">
            <Navbar />

            <main className="profile-main">
                <div className="profile-card">
                    <div className="profile-card-header">
                        <button className="edit-profile-button" onClick={() => navigate('/settings')}>
                            <HiPencil /> Edit Profile
                        </button>
                    </div>

                    <div className="profile-card-content">
                        {/* Profile intials */}
                        <div className="profile-photo-wrapper" title={fullName} aria-hidden>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '100%',
                                    fontSize: '2rem',
                                    fontWeight: 700,
                                    color: '#444'
                                }}
                            >
                                {initials}
                            </div>
                        </div>

                        <h1 className="profile-name">
                            {fullName || 'User'}
                        </h1>

                        <p className="profile-subtitle">
                            {profile.degreeLevel || ''} {profile.role ? `• ${profile.role}` : ''}
                        </p>

                        <div className="profile-info-grid">
                            {/* Career field */}
                            {profile.careerTitle && (
                                <div className="info-card">
                                    <HiBriefcase className="info-icon" />
                                    <div className="info-text">
                                        <h3>Career</h3>
                                        <p>{profile.careerTitle}</p>
                                    </div>
                                </div>
                            )}

                            <div className="info-card">
                                <HiEnvelope className="info-icon" />
                                <div className="info-text">
                                    <h3>Email</h3>
                                    <p>{profile.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="about-me-section">
                            <h2>About Me</h2>
                            <p>{profile.aboutMe || 'No bio provided yet.'}</p>
                        </div>

                        <div className="interests-section">
                            <h2>Degrees</h2>
                            <div className="interests-tags">
                                {(profile.degrees || []).map((d, index) => (
                                    <span key={index} className="interest-tag">
                                        {d.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="interests-section">
                            <h2>Skills / Interests</h2>
                            <div className="interests-tags">
                                {(profile.tags || []).map((tag, index) => (
                                    <span key={index} className="interest-tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    )
}

export default Profile