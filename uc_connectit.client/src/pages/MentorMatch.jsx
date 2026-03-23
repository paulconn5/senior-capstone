import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import MentorCard from '../components/MentorCard'
import './MentorMatch.css'
import useAuth from '../hooks/useAuth'

function MentorMatch() {
  const { token, profile } = useAuth()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // local filter state
  const [educationFilter, setEducationFilter] = useState('all')
  const [fieldFilter, setFieldFilter] = useState('all')
  const [interestFilter, setInterestFilter] = useState('all')

  useEffect(() => {
    async function loadMatches() {
      setLoading(true)
      setError(null)
      if (!token) {
        setMatches([])
        setLoading(false)
        return
      }

      try {
        const res = await fetch('https://localhost:7068/api/matches', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) {
          const text = await res.text().catch(() => '')
          throw new Error(`Failed to load matches: ${res.status} ${text}`)
        }

        const data = await res.json()

        // Map server DTO to MentorCard-friendly objects (preserve score)
        const mapped = data.map(m => ({
          id: m.id,
          name: `${m.firstName || ''} ${m.lastName || ''}`.trim() || 'User',
          photo: m.photo || 'https://via.placeholder.com/150',
          field: m.careerTitle || '',
          education: (m.degrees || []).map(d => d.name).join(', '),
          interests: (m.tags || []).map(t => t.name || t),
          score: m.score ?? 0 
        }))

        setMatches(mapped)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadMatches()
  }, [token])

  const filtered = matches.filter((mentor) => {
    // Education filter
    const educationMatch = educationFilter === 'all' ||
      (educationFilter === 'bachelors' && mentor.education.toLowerCase().includes('bachelor')) ||
      (educationFilter === 'masters' && mentor.education.toLowerCase().includes('master')) ||
      (educationFilter === 'phd' && mentor.education.toLowerCase().includes('phd'))

    // Field filter
    const fieldMatch = fieldFilter === 'all' ||
      (fieldFilter === 'cybersecurity' && mentor.field.toLowerCase().includes('security')) ||
      (fieldFilter === 'cloud' && mentor.field.toLowerCase().includes('cloud')) ||
      (fieldFilter === 'design' && mentor.field.toLowerCase().includes('design')) ||
      (fieldFilter === 'software' && mentor.field.toLowerCase().includes('software')) ||
      (fieldFilter === 'data' && mentor.field.toLowerCase().includes('data')) ||
      (fieldFilter === 'mobile' && mentor.field.toLowerCase().includes('mobile')) ||
      (fieldFilter === 'network' && mentor.field.toLowerCase().includes('network')) ||
      (fieldFilter === 'database' && mentor.field.toLowerCase().includes('database'))

    // Interest filter
    const interestMatch = interestFilter === 'all' ||
      (interestFilter === 'security' && mentor.interests.some(i => i.toLowerCase().includes('security'))) ||
      (interestFilter === 'cloud' && mentor.interests.some(i => i.toLowerCase().includes('cloud') || i.toLowerCase().includes('aws') || i.toLowerCase().includes('azure'))) ||
      (interestFilter === 'design' && mentor.interests.some(i => i.toLowerCase().includes('design') || i.toLowerCase().includes('ux'))) ||
      (interestFilter === 'development' && mentor.interests.some(i => i.toLowerCase().includes('development') || i.toLowerCase().includes('programming') || i.toLowerCase().includes('react')))

    return educationMatch && fieldMatch && interestMatch
  })

  return (
    <div className="mentor-match-page">
      <Navbar />

      <main className="mentor-match-main">
        <div className="hero-section">
          <h2 className="page-title">UC IT Mentor Match</h2>
          <p className="page-subtitle">Connect with experienced IT professionals</p>
        </div>

        <div className="filter-section">
          <h3 className="filter-title">Filter</h3>
          <div className="filter-controls">
            <div className="filter-group">
              <label>Education Level</label>
              <select
                value={educationFilter}
                onChange={(e) => setEducationFilter(e.target.value)}
              >
                <option value="all">All Education Levels</option>
                <option value="bachelors">Bachelor's</option>
                <option value="masters">Master's</option>
                <option value="phd">PhD</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Field of Study</label>
              <select
                value={fieldFilter}
                onChange={(e) => setFieldFilter(e.target.value)}
              >
                <option value="all">All Fields</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="cloud">Cloud Computing</option>
                <option value="design">UX/UI Design</option>
                <option value="software">Software Engineering</option>
                <option value="data">Data Science</option>
                <option value="mobile">Mobile Development</option>
                <option value="network">Network Engineering</option>
                <option value="database">Database Administration</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Interests</label>
              <select
                value={interestFilter}
                onChange={(e) => setInterestFilter(e.target.value)}
              >
                <option value="all">All Interests</option>
                <option value="security">Security</option>
                <option value="cloud">Cloud Technologies</option>
                <option value="design">Design</option>
                <option value="development">Development</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mentors-list-section">
          {loading && <p>Loading matches...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <>
              <p className="mentor-count">Showing {filtered.length} matches</p>
              <div className="mentors-grid">
                {filtered.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default MentorMatch
