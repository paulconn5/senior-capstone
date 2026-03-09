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
          setProfile(localUser)
        } else {
          const data = await res.json()
          // convert PascalCase server fields to camelCase for the client
          const normalized = {
            id: data.Id ?? data.id ?? localUser.id,
            email: data.Email ?? data.email ?? localUser.email,
            firstName: data.FirstName ?? data.firstName ?? localUser.firstName,
            lastName: data.LastName ?? data.lastName ?? localUser.lastName,
            role: data.Role ?? data.role ?? localUser.role,
            aboutMe: data.AboutMe ?? data.aboutMe ?? localUser.aboutMe,
            degree: data.Degree ?? data.degree ?? localUser.degree,
            degreeLevel: data.DegreeLevel ?? data.degreeLevel ?? localUser.degreeLevel,
            graduationDate: data.GraduationDate ?? data.graduationDate ?? localUser.graduationDate,
            tags: (data.tags || localUser.tags || []).map(t => t.Name ?? t.name ?? t)
          }
          setProfile(normalized)
        }
      } catch (e) {
        setProfile(localUser)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token, localUser])

  return { token, localUser, profile, loading }
}
