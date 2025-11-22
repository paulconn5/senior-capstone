import { Link, useLocation } from 'react-router-dom'
import { HiHome, HiUser, HiChatBubbleLeftRight, HiCog6Tooth } from 'react-icons/hi2'
import './Navbar.css'

function Navbar() {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Home', Icon: HiHome },
    { path: '/profile', label: 'My Profile', Icon: HiUser },
    { path: '/messages', label: 'Messages', Icon: HiChatBubbleLeftRight },
    { path: '/settings', label: 'Settings', Icon: HiCog6Tooth }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <h1>UC IT Mentor Match</h1>
          <p className="navbar-subtitle">University of Cincinnati School of IT</p>
        </div>

        <div className="navbar-links">
          {navItems.map((item) => {
            const { Icon } = item
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="navbar-user">
          <div className="user-avatar">
            <HiUser />
          </div>
          <div className="user-info">
            <p className="user-name">Daniel Thompson</p>
            <p className="user-role">Cybersecurity Student</p>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
