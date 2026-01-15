import { useState } from 'react'
import { HiUser, HiBell, HiShieldCheck, HiPaintBrush, HiLockClosed } from 'react-icons/hi2'
import Navbar from '../components/Navbar'
import './Settings.css'

function Settings() {
  const [formData, setFormData] = useState({
    fullName: 'Daniel Thompson',
    email: 'thompsda@mail.uc.edu',
    major: 'Cybersecurity',
    year: 'Freshman'
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    messageNotifications: true
  })

  const [privacy, setPrivacy] = useState({
    publicProfile: true
  })

  const [appearance, setAppearance] = useState({
    darkMode: false
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleToggle = (section, key) => {
    if (section === 'notifications') {
      setNotifications(prev => ({
        ...prev,
        [key]: !prev[key]
      }))
    } else if (section === 'privacy') {
      setPrivacy(prev => ({
        ...prev,
        [key]: !prev[key]
      }))
    } else if (section === 'appearance') {
      setAppearance(prev => ({
        ...prev,
        [key]: !prev[key]
      }))
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    console.log('Saving settings:', { formData, notifications, privacy, appearance })
    alert('Settings saved successfully!')
  }

  const handleCancel = () => {
    console.log('Cancelled')
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="major">Major</label>
              <input
                type="text"
                id="major"
                name="major"
                value={formData.major}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">Year</label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
              >
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
          </div>

          {/* Notifications */}
          <div className="settings-section">
            <div className="section-header">
              <HiBell className="section-icon" />
              <h2>Notifications</h2>
            </div>

            <div className="toggle-group">
              <div className="toggle-info">
                <h3>Email Notifications</h3>
                <p>Receive updates via email</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={() => handleToggle('notifications', 'emailNotifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-group">
              <div className="toggle-info">
                <h3>Message Notifications</h3>
                <p>Get notified of new messages</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.messageNotifications}
                  onChange={() => handleToggle('notifications', 'messageNotifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          {/* Privacy */}
          <div className="settings-section">
            <div className="section-header">
              <HiShieldCheck className="section-icon" />
              <h2>Privacy</h2>
            </div>

            <div className="toggle-group">
              <div className="toggle-info">
                <h3>Public Profile</h3>
                <p>Allow others to view your profile</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={privacy.publicProfile}
                  onChange={() => handleToggle('privacy', 'publicProfile')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          {/* Appearance */}
          <div className="settings-section">
            <div className="section-header">
              <HiPaintBrush className="section-icon" />
              <h2>Appearance</h2>
            </div>

            <div className="toggle-group">
              <div className="toggle-info">
                <h3>Dark Mode</h3>
                <p>Switch to dark theme</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={appearance.darkMode}
                  onChange={() => handleToggle('appearance', 'darkMode')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          {/* Security */}
          <div className="settings-section">
            <div className="section-header">
              <HiLockClosed className="section-icon" />
              <h2>Security</h2>
            </div>

            <button type="button" className="security-option">
              Change Password
            </button>

            <button type="button" className="security-option">
              Two-Factor Authentication
            </button>

            <button type="button" className="security-option">
              Connected Devices
            </button>
          </div>

          {/* Action Buttons */}
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
