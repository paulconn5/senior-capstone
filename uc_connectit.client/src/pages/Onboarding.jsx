// src/pages/Onboarding.jsx
import { useEffect, useState } from 'react';
import './Onboarding.css';

function Onboarding() {
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [degrees, setDegrees] = useState([]);
    const [tags, setTags] = useState([]);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'student',
        degree_level: '',
        graduation_date: '',
        degreeIds: [],
        tagIds: [],
        about_me: '',
        career_title: ''
    });

    // Load degrees + tags from backend
    useEffect(() => {
        async function fetchData() {
            try {
                const [degRes, tagRes] = await Promise.all([
                    fetch('https://localhost:7068/api/degrees'),
                    fetch('https://localhost:7068/api/tags')
                ]);

                const degData = await degRes.json();
                const tagData = await tagRes.json();

                setDegrees(degData);
                setTags(tagData);
            } catch (err) {
                console.error('Error loading dropdown data:', err);
            }
        }

        fetchData();
    }, []);

    function handleRoleChange(newRole) {
        setRole(newRole);
        setFormData(prev => ({ ...prev, role: newRole }));
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleMultiSelectDegrees(e) {
        const selected = Array.from(e.target.selectedOptions).map(o => parseInt(o.value));
        setFormData(prev => ({ ...prev, degreeIds: selected }));
    }

    function handleMultiSelectTags(e) {
        const selected = Array.from(e.target.selectedOptions).map(o => parseInt(o.value));
        setFormData(prev => ({ ...prev, tagIds: selected }));
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
                    degreeLevel: formData.degree_level,
                    graduationDate: parseInt(formData.graduation_date),
                    aboutMe: formData.about_me,
                    degreeIds: formData.degreeIds,
                    tagIds: formData.tagIds,
                    careerTitle: formData.career_title
                })
            });

            let data;
            try {
                data = await response.json();
            } catch {
                data = null;
            }

            console.log('Status:', response.status);
            console.log('Response:', data);

            if (!response.ok) {
                setError(data?.message || `Server responded with status ${response.status}`);
                return;
            }

            alert(`Onboarding complete!\nYour verification token is: ${data.verificationToken}`);
            window.location.href = '/';
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to submit onboarding.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="onboard-container">
            <h1>ConnectIT Onboarding</h1>

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

                <label>Degree Level
                    <select name="degree_level" value={formData.degree_level} onChange={handleChange} required>
                        <option value="">Select one</option>
                        <option value="Associates">Associates</option>
                        <option value="Bachelors">Bachelors</option>
                        <option value="Masters">Masters</option>
                        <option value="PhD">PhD</option>
                    </select>
                </label>

                <label>Graduation Year
                    <input
                        type="number"
                        name="graduation_date"
                        value={formData.graduation_date}
                        onChange={handleChange}
                        placeholder="e.g. 2026"
                        required
                    />
                </label>

                <label>Degree(s)
                    <select multiple value={formData.degreeIds.map(String)} onChange={handleMultiSelectDegrees} size={5}>
                        {degrees.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                    <span className="hint">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</span>
                </label>

                <label>{role === 'student' ? 'Interests' : 'Skills'}
                    <select multiple value={formData.tagIds.map(String)} onChange={handleMultiSelectTags} size={5}>
                        {tags.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    <span className="hint">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</span>
                </label>

                <label>Career Title (optional)
                    <input
                        name="career_title"
                        value={formData.career_title}
                        onChange={handleChange}
                        placeholder="e.g. Senior Cloud Engineer"
                    />
                </label>

                <label>About Me
                    <textarea
                        name="about_me"
                        value={formData.about_me}
                        onChange={handleChange}
                        rows={3}
                    />
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