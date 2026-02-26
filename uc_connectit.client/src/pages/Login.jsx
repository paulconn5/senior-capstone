import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [requiresVerification, setRequiresVerification] = useState(false)
    const [verificationToken, setVerificationToken] = useState('')
    const [pendingUserId, setPendingUserId] = useState(null)

    const navigate = useNavigate()

    // Login handler
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('Please fill in all fields.')
            return
        }

        if (!email.includes('@')) {
            setError('Please enter a valid email address.')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('https://localhost:7068/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            if (!response.ok) {
                setError('Invalid email or password.')
                setIsLoading(false)
                return
            }

            const data = await response.json()

            // Account requires verification
            if (data.requiresVerification) {
                setRequiresVerification(true)
                setPendingUserId(data.userId)
                setIsLoading(false)
                return
            }

            // Verified user: store token + user
            if (data.token) {
                localStorage.setItem('token', data.token)
            }
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user))
            }
            navigate('/dashboard')

        } catch (err) {
            setError('Login failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    // Verification Token Handler
    const handleTokenSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!verificationToken) {
            setError('Please enter your verification token.')
            return
        }

        try {
            const response = await fetch('https://localhost:7068/api/auth/verify-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: pendingUserId,
                    token: verificationToken
                })
            })

            if (!response.ok) {
                setError('Invalid or expired token.')
                return
            }

            // After verification, log the user in automatically
            const loginResponse = await fetch('https://localhost:7068/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            if (!loginResponse.ok) {
                setError('Login failed after verification.')
                return
            }

            const userData = await loginResponse.json()

            if (userData.token) {
                localStorage.setItem('token', userData.token)
            }
            if (userData.user) {
                localStorage.setItem('user', JSON.stringify(userData.user))
            }

            navigate('/dashboard')

        } catch {
            setError('Verification failed. Please try again.')
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>UC ConnectIT</h1>
                <h2>{requiresVerification ? 'Verify Account' : 'Sign In'}</h2>

                {!requiresVerification ? (
                    <>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                />
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <button type="submit" className="login-button" disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        {/* Register Section */}
                        <div className="register-section">
                            <p>Don't have an account?</p>
                            <button
                                type="button"
                                className="register-button"
                                onClick={() => navigate('/onboarding')}
                            >
                                Register
                            </button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleTokenSubmit}>
                        <div className="form-group">
                            <label>Enter Verification Token</label>
                            <input
                                type="text"
                                value={verificationToken}
                                onChange={(e) => setVerificationToken(e.target.value)}
                                placeholder="6-digit token"
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="login-button">
                            Verify Account
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Login