import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

import Login from './pages/Login'
import MentorMatch from './pages/MentorMatch'
import MentorDetail from './pages/MentorDetail'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import Onboarding from './pages/Onboarding'
import PrivateRoute from './components/PrivateRoute'
import './styles/App.css'  // or './App.css' if that's where it actually is

const GOOGLE_CLIENT_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE'

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MentorMatch />
              </PrivateRoute>
            }
          />
          <Route
            path="/mentor/:id"
            element={
              <PrivateRoute>
                <MentorDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <Messages />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
