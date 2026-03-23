import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiBriefcase, HiAcademicCap } from 'react-icons/hi2'
import './MentorCard.css'

function MentorCard({ mentor }) {
  const [showAllInterests, setShowAllInterests] = useState(false)
  const navigate = useNavigate()

  const visibleInterests = showAllInterests ? mentor.interests : (mentor.interests || []).slice(0, 3)
  const remainingCount = Math.max(0, (mentor.interests || []).length - 3)

  const handleCardClick = () => {
    navigate(`/mentor/${mentor.id}`)
  }

  const score = typeof mentor.score === 'number' ? mentor.score : null
  const scorePct = score != null ? Math.min(100, Math.max(0, Math.round(score))) : 0

  // Compute initials (first + last initial)
  const initials = (() => {
    const name = (mentor.name || `${mentor.firstName || ''} ${mentor.lastName || ''}`).trim()
    if (!name) return ''
    const parts = name.split(/\s+/)
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  })()

  return (
    <div className="mentor-card" onClick={handleCardClick}>
      <div className="mentor-card-header"></div>
      <div className="mentor-card-body">
        <div className="mentor-photo-wrapper">
          <div className="avatar-initials" title={mentor.name || ''}>
            {initials}
          </div>
        </div>

        <h3 className="mentor-name">{mentor.name}</h3>

        <div className="mentor-info">
          {mentor.field && (
            <div className="info-item">
              <HiBriefcase className="info-icon" />
              <span className="info-text">{mentor.field}</span>
            </div>
          )}

          <div className="info-item">
            <HiAcademicCap className="info-icon" />
            <span className="info-text">{mentor.education}</span>
          </div>
        </div>

        <div className="mentor-interests">
          <h4 className="interests-title">Interests & Skills</h4>
          <div className="interests-tags">
            {visibleInterests.map((interest, index) => (
              <span key={index} className="interest-tag">
                {interest}
              </span>
            ))}
            {!showAllInterests && remainingCount > 0 && (
              <button
                className="interest-more"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowAllInterests(true)
                }}
              >
                +{remainingCount} more
              </button>
            )}
          </div>
        </div>
      </div>

      {score != null && (
        <div className="card-footer">
          <div className="score-row">
            <div className="score-label">Match Score</div>
            <div className="score-pill">{score} pt{score === 1 ? '' : 's'}</div>
          </div>

          <div className="score-bar" aria-hidden>
            <div
              className="score-fill"
              style={{ width: `${scorePct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default MentorCard
