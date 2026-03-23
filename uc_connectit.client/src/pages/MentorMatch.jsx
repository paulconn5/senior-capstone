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

        // Map server DTO to MentorCard
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

  const subtitle = (profile && profile.role && profile.role.toLowerCase() === 'mentor')
    ? 'Connect with IT students'
    : 'Connect with experienced IT professionals'

  return (
    <div className="mentor-match-page">
      <Navbar />

      <main className="mentor-match-main">
        <div className="hero-section">
          <h2 className="page-title">UC IT Mentor Match</h2>
          <p className="page-subtitle">{subtitle}</p>
        </div>

        <div className="mentors-list-section">
          {loading && <p>Loading matches...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <>
              <p className="mentor-count">Showing {matches.length} matches</p>
              <div className="mentors-grid">
                {matches.map((mentor) => (
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
