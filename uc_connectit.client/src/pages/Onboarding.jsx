// src/pages/Onboarding.jsx
import { useState } from 'react';
import './Onboarding.css';

const STUDENT_MAJORS = [
    'Information Technology',
    'Computer Science',
    'Cybersecurity',
    'Data Science',
    'Software Development',
    'Networking & Systems',
    'Other'
];

const MENTOR_ROLES = [
    'Software Engineer',
    'Cybersecurity Analyst',
    'Data Engineer / Scientist',
    'Cloud / DevOps Engineer',
    'IT Manager / Lead',
    'Product Manager',
    'Other'
];

const SKILL_OPTIONS = [
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
    'Project Management'
];

const INTEREST_OPTIONS = [
    'Web Development',
    'Mobile Development',
    'Cloud Computing',
    'Cybersecurity',
    'AI / Machine Learning',
    'Data Science / Analytics',
    'Game Development',
    'IT Management / Leadership',
    'Research / Academia'
];

const MEETING_FREQUENCY = [
    'Once per month',
    'Twice per month',
    'Once per week',
    'Multiple times per week'
];

const EXPERIENCE_LEVELS_STUDENT = [
    'First-year / Exploring',
    'Some coursework completed',
    'Completed internships / co-ops',
    'Near graduation, job searching'
];

const EXPERIENCE_LEVELS_MENTOR = [
    '0–2 years (early career)',
    '3–5 years',
    '6–10 years',
    '10+ years (senior / lead)'
];

function Onboarding() {
    const [role, setRole] = useState('student'); // "student" or "mentor"

    const [formData, setFormData] = useState({
        fullName: '',
        role: 'student',
        major: '',
        mentorRole: '',
        graduationYear: '',
        company: '',
        yearsExperience: '',
        skills: [],
        interests: [],
        meetingFrequency: '',
        experienceLevel: '',
        goals: ''
    });

    function handleRoleChange(newRole) {
        setRole(newRole);
        setFormData(prev => ({
            ...prev,
            role: newRole
        }));
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // multi-select change handler for <select multiple>
    function handleMultiSelectChange(e) {
        const { name, options } = e.target;
        const selected = Array.from(options)
            .filter(o => o.selected)
            .map(o => o.value);

        setFormData(prev => ({
            ...prev,
            [name]: selected
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        console.log('Onboarding submitted:', formData);

        // TODO: send to backend later
        // await fetch('/api/onboarding', { method: 'POST', ... })

        alert('Onboarding submitted (placeholder). Redirecting to dashboard...');
        window.location.href = '/dashboard';
    }

    const experienceOptions =
        role === 'student' ? EXPERIENCE_LEVELS_STUDENT : EXPERIENCE_LEVELS_MENTOR;

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

                {/* Shared: Name */}
                <label>
                    Full Name
                    <input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                </label>

                {/* Student-only fields */}
                {role === 'student' && (
                    <>
                        <label>
                            Major
                            <select
                                name="major"
                                value={formData.major}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select your major</option>
                                {STUDENT_MAJORS.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Expected Graduation Year
                            <input
                                type="number"
                                name="graduationYear"
                                value={formData.graduationYear}
                                onChange={handleChange}
                                placeholder="e.g. 2026"
                                required
                            />
                        </label>
                    </>
                )}

                {/* Mentor-only fields */}
                {role === 'mentor' && (
                    <>
                        <label>
                            Primary Role / Title
                            <select
                                name="mentorRole"
                                value={formData.mentorRole}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select your role</option>
                                {MENTOR_ROLES.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Company / Organization
                            <input
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Where do you work?"
                                required
                            />
                        </label>

                        <label>
                            Years of Experience
                            <input
                                type="number"
                                name="yearsExperience"
                                value={formData.yearsExperience}
                                onChange={handleChange}
                                min="0"
                                placeholder="e.g. 3"
                            />
                        </label>
                    </>
                )}

                {/* Shared: Experience Level (but with different options per role) */}
                <label>
                    Experience Level
                    <select
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select one</option>
                        {experienceOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </label>

                {/* Skills multi-select */}
                <label>
                    Key Skills (select all that apply)
                    <select
                        name="skills"
                        multiple
                        value={formData.skills}
                        onChange={handleMultiSelectChange}
                        size={5}
                    >
                        {SKILL_OPTIONS.map(skill => (
                            <option key={skill} value={skill}>{skill}</option>
                        ))}
                    </select>
                    <span className="hint">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</span>
                </label>

                {/* Interests multi-select */}
                <label>
                    Interests (select all that apply)
                    <select
                        name="interests"
                        multiple
                        value={formData.interests}
                        onChange={handleMultiSelectChange}
                        size={5}
                    >
                        {INTEREST_OPTIONS.map(interest => (
                            <option key={interest} value={interest}>{interest}</option>
                        ))}
                    </select>
                    <span className="hint">These help us match you with similar focus areas.</span>
                </label>

                {/* Meeting frequency */}
                <label>
                    Preferred Meeting Frequency
                    <select
                        name="meetingFrequency"
                        value={formData.meetingFrequency}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select how often</option>
                        {MEETING_FREQUENCY.map(freq => (
                            <option key={freq} value={freq}>{freq}</option>
                        ))}
                    </select>
                </label>

                {/* Goals (free text but still part of matching) */}
                <label>
                    What are your goals for this mentorship?
                    <textarea
                        name="goals"
                        value={formData.goals}
                        onChange={handleChange}
                        placeholder={
                            role === 'student'
                                ? 'Example: I want guidance on internships, career paths, and technical interview prep.'
                                : 'Example: I want to support students, give career advice, and grow my leadership skills.'
                        }
                        rows={3}
                    />
                </label>

                <button type="submit" className="submit-btn">
                    Continue
                </button>
            </form>
        </div>
    );
}

export default Onboarding;
