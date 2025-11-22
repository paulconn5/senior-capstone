import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Login from './pages/Login'
import MentorMatch from './pages/MentorMatch'
import MentorDetail from './pages/MentorDetail'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import './styles/App.css'


// You'll need to replace this with your actual Google Client ID
// Get it from: https://console.cloud.google.com/apis/credentials
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE'

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<MentorMatch />} />
          <Route path="/mentor/:id" element={<MentorDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
