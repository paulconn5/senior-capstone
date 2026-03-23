import { useEffect, useState } from 'react'

// Hook that reads auth token and user from localStorag and fetches the full profile from the API when available.
export default function useAuth() {
  const [token, setToken] = useState(null)
  const [localUser, setLocalUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('token')
    const raw = localStorage.getItem('user')
    setToken(t)
    try {
      setLocalUser(raw ? JSON.parse(raw) : null)
    } catch (e) {
      setLocalUser(null)
    }
  }, [])

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true)
      if (!token || !localUser) {
        setProfile(localUser)
        setLoading(false)
        return
      }

      const userId = localUser.Id || localUser.id || localUser.userId
      if (!userId) {
        setProfile(localUser)
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`https://localhost:7068/api/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) {
          const text = await res.text().catch(() => '')
          // If unauthorized, clear stored token to avoid repeated 401
          if (res.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setToken(null)
            setLocalUser(null)
            setProfile(null)
          } else {
            setProfile(localUser)
          }
        } else {
          const data = await res.json()

          // Normalize API response
          const rawDegrees =
            data.degrees ??
            data.Degrees ??
            data.userDegrees ??
            data.UserDegrees ??
            localUser.degrees ??
            []

          const normalizedDegrees = (Array.isArray(rawDegrees) ? rawDegrees : []).map(d => {
            if (!d) return { name: '' }

            // If the API returned just an id (number), we can't show a name
            if (typeof d === 'number') return { id: d, name: '' }

            // If the array element is a primitive string, use it as name
            if (typeof d === 'string') return { name: d }

            // If the degree object is nested like { Degree: { Id, Name } }
            if (d.Degree && (d.Degree.Name || d.Degree.Id)) {
              return {
                id: d.Degree.Id ?? d.Degree.id,
                name: d.Degree.Name ?? d.Degree.name ?? ''
              }
            }

            // Common shapes: { Id, Name } or { id, name } or { id, name: ... }
            return {
              id: d.Id ?? d.id ?? d.id,
              name: d.Name ?? d.name ?? ''
            }
          })

          const normalized = {
            id: data.Id ?? data.id ?? localUser.id,
            email: data.Email ?? data.email ?? localUser.email,
            firstName: data.FirstName ?? data.firstName ?? localUser.firstName,
            lastName: data.LastName ?? data.lastName ?? localUser.lastName,
            role: data.Role ?? data.role ?? localUser.role,
            aboutMe: data.AboutMe ?? data.aboutMe ?? localUser.aboutMe,
            degrees: normalizedDegrees,
            degreeLevel: data.DegreeLevel ?? data.degreeLevel ?? localUser.degreeLevel,
            graduationDate: data.GraduationDate ?? data.graduationDate ?? localUser.graduationDate,
            careerTitle: data.CareerTitle ?? data.careerTitle ?? localUser.careerTitle ?? localUser.CareerTitle ?? '',
            tags: (data.tags || data.Tags || localUser.tags || localUser.Tags || []).map(
              t => {
                if (!t) return ''
                if (typeof t === 'string') return t
                if (typeof t === 'number') return String(t)
                if (t.Tag && (t.Tag.Name || t.Tag.name)) return t.Tag.Name ?? t.Tag.name
                return t.Name ?? t.name ?? String(t)
              }
            )
          }

          setProfile(normalized)
        }
      } catch (e) {
        console.error('useAuth: fetchProfile error', e)
        setProfile(localUser)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token, localUser])

  return { token, localUser, profile, loading }
}
