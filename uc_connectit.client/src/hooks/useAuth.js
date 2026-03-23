import { useEffect, useState } from 'react'

// Hook that reads auth token and user from localStorage
// and fetches the full profile from the API when available.
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
          // Log details to help debug why the request failed
          const text = await res.text().catch(() => '')
          // eslint-disable-next-line no-console
          console.warn(`useAuth: GET /api/users/${userId} returned ${res.status}`, text)

          // If unauthorized, clear stored token/user to avoid repeated 401s.
          if (res.status === 401) {
            // eslint-disable-next-line no-console
            console.warn('useAuth: clearing local auth (401). You may need to re-login.')
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

          // Debug: log what the API actually returned so we can inspect degrees shape
          // eslint-disable-next-line no-console
          console.debug('useAuth: fetched profile payload:', data)

          // defensive normalization: handle various shapes (PascalCase, camelCase,
          // nested userDegrees, arrays of ids, strings, or objects)
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

          // Debug: show the normalized object that the UI reads from
          // eslint-disable-next-line no-console
          console.debug('useAuth: normalized profile:', normalized)

          setProfile(normalized)
        }
      } catch (e) {
        // eslint-disable-next-line no-console
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
