// src/pages/Onboarding.jsx
import { useState } from 'react';
import './Onboarding.css';

// Degree options (students see as "Major", mentors see as "Primary Role / Title")
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

// Tags / Skills / Interests
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
    const [role, setRole] = useState('student'); // student or mentor

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        role: 'student',
        degree: '',
        degree_level: '',
        graduation_date: '',
        tags: [],
        about_me: ''
    });

    // Role toggle handler
    function handleRoleChange(newRole) {
        setRole(newRole);
        setFormData(prev => ({ ...prev, role: newRole }));
    }

    // Standard input/select change
    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Multi-select handler for tags
    function handleMultiSelectChange(e) {
        const { name, options } = e.target;
        const selected = Array.from(options)
            .filter(o => o.selected)
            .map(o => o.value);
        setFormData(prev => ({ ...prev, [name]: selected }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log('Onboarding submitted:', formData);

        // TODO: send to backend API
        // await fetch('/api/onboarding', { method: 'POST', ... })

        alert('Onboarding submitted (placeholder). Redirecting to dashboard...');
        window.location.href = '/dashboard';
    }

    return (
        <div className="onboard-container">
            <h1>ConnectIT Onboarding</h1>
            <p className="onboard-subtitle">
                Tell us about yourself so we can match you with the right {role === 'student' ? 'mentor' : 'students'}.
            </p>

            {/* Role Selector */}
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

                {/* First Name */}
                <label>
                    First Name
                    <input
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </label>

                {/* Last Name */}
                <label>
                    Last Name
                    <input
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </label>

                {/* Degree / Role */}
                <label>
                    {role === 'student' ? 'Major' : 'Primary Role / Title'}
                    <select
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select one</option>
                        {DEGREE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </label>

                {/* Degree Level */}
                <label>
                    Degree Level
                    <select
                        name="degree_level"
                        value={formData.degree_level}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select one</option>
                        <option value="Associates">Associates</option>
                        <option value="Bachelors">Bachelors</option>
                        <option value="Masters">Masters</option>
                        <option value="PhD">PhD</option>
                    </select>
                </label>

                {/* Graduation Year */}
                <label>
                    {role === 'student' ? 'Expected Graduation Year' : 'Graduation Year'}
                    <input
                        type="number"
                        name="graduation_date"
                        value={formData.graduation_date}
                        onChange={handleChange}
                        placeholder="e.g. 2026"
                        required
                    />
                </label>

                {/* Tags (Skills / Interests) */}
                <label>
                    {role === 'student' ? 'Interests (select all that apply)' : 'Skills (select all that apply)'}
                    <select
                        name="tags"
                        multiple
                        value={formData.tags}
                        onChange={handleMultiSelectChange}
                        size={5}
                    >
                        {TAG_OPTIONS.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                    </select>
                    <span className="hint">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</span>
                </label>

                {/* About Me / Goals */}
                <label>
                    What are your goals for this mentorship?
                    <textarea
                        name="about_me"
                        value={formData.about_me}
                        onChange={handleChange}
                        placeholder={
                            role === 'student'
                                ? 'Example: I want guidance on internships, career paths, and technical interview prep.'
                                : 'Example: I want to support students, give career advice, and grow my leadership skills.'
                        }
                        rows={3}
                    />
                </label>

                {/* Submit Button */}
                <button type="submit" className="submit-btn">Continue</button>
            </form>
        </div>
    );
}

export default Onboarding;
