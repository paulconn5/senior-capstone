import { useState, useEffect } from 'react'
import { HiUser } from 'react-icons/hi2'
import Navbar from '../components/Navbar'
import './Settings.css'
import useAuth from '../hooks/useAuth'

function Settings() {
  const { profile, token } = useAuth()


  const [availableDegrees, setAvailableDegrees] = useState([])
  const [availableTags, setAvailableTags] = useState([])

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    year: '',
    about: '',
    careerTitle: ''
  })

  const [selectedDegreeIds, setSelectedDegreeIds] = useState([])
  const [selectedTagIds, setSelectedTagIds] = useState([])

  // Load degrees + tags for selects
  useEffect(() => {
    async function fetchData() {
      try {
        const [degRes, tagRes] = await Promise.all([
          fetch('https://localhost:7068/api/degrees'),
          fetch('https://localhost:7068/api/tags')
        ])

        const degData = await degRes.json()
        const tagData = await tagRes.json()

        setAvailableDegrees(degData)
        setAvailableTags(tagData)
      } catch (err) {
        console.error('Error loading dropdown data:', err)
      }
    }

    fetchData()
  }, [])

  // Populate form when profile changeS
  useEffect(() => {
    if (!profile) return

    setFormData({
      fullName: `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim(),
      email: profile.email ?? '',
      year: profile.degreeLevel ?? '',
      about: profile.aboutMe ?? '',
      careerTitle: profile.careerTitle ?? ''
    })

    // profile.degrees is normalized to {id, name}
    const degIds = (profile.degrees || []).map(d => d.id).filter(Boolean)
    setSelectedDegreeIds(degIds)

    // profile.tags is a list of names (string)
    if (availableTags.length > 0) {
      const nameToId = {}
      availableTags.forEach(t => {
        nameToId[t.name] = t.id
      })
      const tagIds = (profile.tags || [])
        .map(t => nameToId[t])
        .filter(Boolean)
      setSelectedTagIds(tagIds)
    } else {
      // clear selection until tags loaded
      setSelectedTagIds([])
    }
  }, [profile, availableTags])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  function handleMultiSelectDegrees(e) {
    const selected = Array.from(e.target.selectedOptions).map(o => parseInt(o.value))
    setSelectedDegreeIds(selected)
  }

  function handleMultiSelectTags(e) {
    const selected = Array.from(e.target.selectedOptions).map(o => parseInt(o.value))
    setSelectedTagIds(selected)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!profile || !token) {
      alert('Not authenticated')
      return
    }

    const body = {
      FullName: formData.fullName,
      AboutMe: formData.about,
      CareerTitle: formData.careerTitle,
      DegreeLevel: formData.year,
      GraduationDate: formData.graduationDate ? parseInt(formData.graduationDate) : undefined,
      DegreeIds: selectedDegreeIds,
      TagIds: selectedTagIds
    }

    try {
      const res = await fetch(`https://localhost:7068/api/users/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        console.error('Save failed:', res.status, text)
        throw new Error('Failed to save')
      }

      // update local stored user name
      try {
        const raw = localStorage.getItem('user')
        if (raw) {
          const obj = JSON.parse(raw)
          const parts = (formData.fullName || '').trim().split(' ', 2)
          obj.FirstName = parts[0] || obj.FirstName
          obj.LastName = parts[1] || obj.LastName
          // also persist careerTitle locally for initial fallback
          obj.CareerTitle = formData.careerTitle || obj.CareerTitle
          localStorage.setItem('user', JSON.stringify(obj))
        }
      } catch (err) {
        console.error(err)
      }

      alert('Settings saved successfully!')
      // force a full reload so useAuth gets the updated profile
      window.location.href = '/profile'
    } catch (err) {
      console.error(err)
      alert('Failed to save settings')
    }
  }

  const handleCancel = () => {
    if (!profile) return
    setFormData({
      fullName: `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim(),
      email: profile.email ?? '',
      year: profile.degreeLevel ?? '',
      about: profile.aboutMe ?? '',
      careerTitle: profile.careerTitle ?? ''
    })
    setSelectedDegreeIds((profile.degrees || []).map(d => d.id).filter(Boolean))
    // reset tags mapping
    if (availableTags.length > 0) {
      const nameToId = {}
      availableTags.forEach(t => {
        nameToId[t.name] = t.id
      })
      const tagIds = (profile.tags || []).map(t => nameToId[t]).filter(Boolean)
      setSelectedTagIds(tagIds)
    } else {
      setSelectedTagIds([])
    }
  }

  return (
    <div className="settings-page">
      <Navbar />

      <main className="settings-main">
        <h1 className="settings-title">Settings</h1>

        <form className="settings-form" onSubmit={handleSave}>
          {/* Account Settings */}
          <div className="settings-section">
            <div className="section-header">
              <HiUser className="section-icon" />
              <h2>Account Settings</h2>
            </div>

            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Graduation Year</label>
              <input
                type="number"
                name="graduationDate"
                value={formData.graduationDate ?? ''}
                onChange={handleInputChange}
                placeholder="e.g. 2026"
              />
            </div>

            <div className="form-group">
              <label>Degree(s)</label>
              <select
                multiple
                value={selectedDegreeIds.map(String)}
                onChange={handleMultiSelectDegrees}
                size={5}
              >
                {availableDegrees.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <span className="hint">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</span>
            </div>

            <div className="form-group">
              <label>Interests / Skills</label>
              <select
                multiple
                value={selectedTagIds.map(String)}
                onChange={handleMultiSelectTags}
                size={5}
              >
                {availableTags.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <span className="hint">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</span>
            </div>

            <div className="form-group">
              <label>Career Title (optional)</label>
              <input
                name="careerTitle"
                value={formData.careerTitle}
                onChange={handleInputChange}
                placeholder="e.g. Senior Cloud Engineer"
              />
            </div>

            <div className="form-group">
              <label htmlFor="about">About</label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>

          {/* Submit / cancel */}
          <div className="settings-actions">
            <button type="submit" className="btn-save">
              Save Changes
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Settings
