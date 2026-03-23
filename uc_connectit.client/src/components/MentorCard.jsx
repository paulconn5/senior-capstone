import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiBriefcase, HiAcademicCap } from 'react-icons/hi2'
import './MentorCard.css'

function MentorCard({ mentor }) {
  const [showAllInterests, setShowAllInterests] = useState(false)
  const navigate = useNavigate()

  // Show first 3 interests, then "+X more" button
  const visibleInterests = showAllInterests ? mentor.interests : mentor.interests.slice(0, 3)
  const remainingCount = mentor.interests.length - 3

  const handleCardClick = () => {
    navigate(`/mentor/${mentor.id}`)
  }

  return (
    <div className="mentor-card" onClick={handleCardClick}>
      <div className="mentor-card-header"></div>
      <div className="mentor-card-body">
        <div className="mentor-photo-wrapper">
          <img src={mentor.photo} alt={mentor.name} className="mentor-photo" />
        </div>

        <h3 className="mentor-name">{mentor.name}</h3>

        <div className="mentor-info">
          {/* Only render career/field when present */}
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
    </div>
  )
}

export default MentorCard
