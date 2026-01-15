import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Onboarding from './pages/Onboarding'
import './styles/App.css'  // or './App.css' if that's where it actually is

const GOOGLE_CLIENT_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE'

function App() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    )
}

export default App
