// src/pages/Onboarding.jsx
import { useState } from 'react';
import './Onboarding.css';

const DEGREE_OPTIONS = [
    'Information Technology',
    'Data Tech',
    'Game Dev',
    'Computer Science',
    'Cybersecurity',
    'Data Science',
    'Software Application Development',
    'Networking & Systems',
    'Other'
];

const TAG_OPTIONS = [
    'JavaScript',
    'C# / .NET',
    'Python',
    'Java',
    'SQL / Databases',
    'Cloud (Azure / AWS / GCP)',
    'Cybersecurity',
    'Networking',
    'Data Analytics',
    'DevOps / CI/CD',
    'UI/UX',
    'Project Management',
    'Web Development',
    'Mobile Development',
    'AI / Machine Learning',
    'Game Development',
    'IT Management / Leadership',
    'Research / Academia'
];

function Onboarding() {
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'student',
        degree: '',
        degree_level: '',
        graduation_date: '',
        tags: [],
        about_me: ''
    });

    function handleRoleChange(newRole) {
        setRole(newRole);
        setFormData(prev => ({ ...prev, role: newRole }));
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleMultiSelectChange(e) {
        const { options } = e.target;
        const selected = Array.from(options)
            .filter(o => o.selected)
            .map(o => o.value);
        setFormData(prev => ({ ...prev, tags: selected }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('https://localhost:7068/api/auth/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.first_name,
                    lastName: formData.last_name,
                    role: formData.role,
                    degree: formData.degree,
                    degreeLevel: formData.degree_level,
                    graduationDate: formData.graduation_date,
                    aboutMe: formData.about_me,
                    tags: formData.tags
                })
            });

            let data;
            try {
                data = await response.json(); // try parsing JSON
            } catch {
                data = null;
            }

            // Debug logs
            console.log('Status:', response.status);
            console.log('OK:', response.ok);
            console.log('Response body:', data);

            if (!response.ok) {
                setError(data?.message || `Server responded with status ${response.status}`);
                setLoading(false);
                return;
            }

            alert(data?.message || 'Onboarding complete! Redirecting to dashboard...');
            window.location.href = '/dashboard';
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to submit onboarding. Check console for details.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="onboard-container">
            <h1>ConnectIT Onboarding</h1>
            <p className="onboard-subtitle">
                Tell us about yourself so we can match you with the right {role === 'student' ? 'mentor' : 'students'}.
            </p>

            <div className="role-toggle">
                <button
                    type="button"
                    className={role === 'student' ? 'role-btn active' : 'role-btn'}
                    onClick={() => handleRoleChange('student')}
                >
                    I am a Student
                </button>
                <button
                    type="button"
                    className={role === 'mentor' ? 'role-btn active' : 'role-btn'}
                    onClick={() => handleRoleChange('mentor')}
                >
                    I am a Mentor
                </button>
            </div>

            <form onSubmit={handleSubmit} className="onboard-form">
                <label>Email
                    <input name="email" type="email" value={formData.email} onChange={handleChange} required />
                </label>
                <label>Password
                    <input name="password" type="password" value={formData.password} onChange={handleChange} required />
                </label>
                <label>First Name
                    <input name="first_name" value={formData.first_name} onChange={handleChange} required />
                </label>
                <label>Last Name
                    <input name="last_name" value={formData.last_name} onChange={handleChange} required />
                </label>
                <label>{role === 'student' ? 'Major' : 'Primary Role / Title'}
                    <select name="degree" value={formData.degree} onChange={handleChange} required>
                        <option value="">Select one</option>
                        {DEGREE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </label>
                <label>Degree Level
                    <select name="degree_level" value={formData.degree_level} onChange={handleChange} required>
                        <option value="">Select one</option>
                        <option value="Associates">Associates</option>
                        <option value="Bachelors">Bachelors</option>
                        <option value="Masters">Masters</option>
                        <option value="PhD">PhD</option>
                    </select>
                </label>
                <label>{role === 'student' ? 'Expected Graduation Year' : 'Graduation Year'}
                    <input type="number" name="graduation_date" value={formData.graduation_date} onChange={handleChange} placeholder="e.g. 2026" required />
                </label>
                <label>{role === 'student' ? 'Interests (select all that apply)' : 'Skills (select all that apply)'}
                    <select name="tags" multiple value={formData.tags} onChange={handleMultiSelectChange} size={5}>
                        {TAG_OPTIONS.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                    </select>
                    <span className="hint">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</span>
                </label>
                <label>What are your goals for this mentorship?
                    <textarea name="about_me" value={formData.about_me} onChange={handleChange} rows={3}
                        placeholder={role === 'student'
                            ? 'Example: I want guidance on internships, career paths, and technical interview prep.'
                            : 'Example: I want to support students, give career advice, and grow my leadership skills.'} />
                </label>

                {error && <p className="error">{error}</p>}

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Submitting...' : 'Continue'}
                </button>
            </form>
        </div>
    );
}

export default Onboarding;
