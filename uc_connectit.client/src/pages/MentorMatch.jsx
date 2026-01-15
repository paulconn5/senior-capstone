import { useState } from 'react'
import Navbar from '../components/Navbar'
import MentorCard from '../components/MentorCard'
import './MentorMatch.css'

function MentorMatch() {
  const [educationFilter, setEducationFilter] = useState('all')
  const [fieldFilter, setFieldFilter] = useState('all')
  const [interestFilter, setInterestFilter] = useState('all')

  // Sample mentor data
  const mentors = [
    {
      id: 1,
      name: 'David Miller',
      photo: 'https://via.placeholder.com/150',
      field: 'Cybersecurity',
      education: "Master's in Cybersecurity",
      interests: ['Security Architecture', 'Risk Management', 'Network Security', 'Incident Response', 'Threat Analysis']
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      photo: 'https://via.placeholder.com/150',
      field: 'Cloud Computing',
      education: 'MS in Cloud Architecture',
      interests: ['AWS', 'Azure', 'Cloud Migration', 'DevOps']
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      photo: 'https://via.placeholder.com/150',
      field: 'UX/UI Design',
      education: "Bachelor's in Web Design & Development",
      interests: ['User Research', 'Wireframing', 'Figma', 'Responsive Design']
    },
    {
      id: 4,
      name: 'James Liu',
      photo: 'https://via.placeholder.com/150',
      field: 'Software Engineering',
      education: 'MS in Computer Science',
      interests: ['React', 'Node.js', 'System Design', 'Agile']
    },
    {
      id: 5,
      name: 'Dr. Amanda Foster',
      photo: 'https://via.placeholder.com/150',
      field: 'Data Science',
      education: 'PhD in Data Analytics',
      interests: ['Machine Learning', 'Python', 'Data Visualization', 'Big Data']
    },
    {
      id: 6,
      name: 'Kevin Patel',
      photo: 'https://via.placeholder.com/150',
      field: 'Mobile Development',
      education: 'BS in Software Development',
      interests: ['iOS', 'Swift', 'Android', 'Flutter']
    },
    {
      id: 7,
      name: 'Lisa Martinez',
      photo: 'https://via.placeholder.com/150',
      field: 'Database Administration',
      education: 'MS in Database Systems',
      interests: ['SQL', 'MongoDB', 'Performance Tuning', 'Database Design']
    },
    {
      id: 8,
      name: 'Robert Kim',
      photo: 'https://via.placeholder.com/150',
      field: 'Network Engineering',
      education: 'BS in Network Administration',
      interests: ['Cisco', 'Network Security', 'Infrastructure', 'Cloud Networking']
    }
  ]

  // Filter mentors based on selected criteria
  const filteredMentors = mentors.filter((mentor) => {
    // Education filter
    const educationMatch = educationFilter === 'all' ||
      (educationFilter === 'bachelors' && (mentor.education.includes('Bachelor') || mentor.education.includes('BS'))) ||
      (educationFilter === 'masters' && (mentor.education.includes('Master') || mentor.education.includes('MS'))) ||
      (educationFilter === 'phd' && mentor.education.includes('PhD'))

    // Field filter
    const fieldMatch = fieldFilter === 'all' ||
      (fieldFilter === 'cybersecurity' && mentor.field.toLowerCase().includes('security')) ||
      (fieldFilter === 'cloud' && mentor.field.toLowerCase().includes('cloud')) ||
      (fieldFilter === 'design' && mentor.field.toLowerCase().includes('design')) ||
      (fieldFilter === 'software' && mentor.field.toLowerCase().includes('software')) ||
      (fieldFilter === 'data' && mentor.field.toLowerCase().includes('data')) ||
      (fieldFilter === 'mobile' && mentor.field.toLowerCase().includes('mobile')) ||
      (fieldFilter === 'network' && mentor.field.toLowerCase().includes('network')) ||
      (fieldFilter === 'database' && mentor.field.toLowerCase().includes('database'))

    // Interest filter - check if any mentor interest contains the filter keyword
    const interestMatch = interestFilter === 'all' ||
      (interestFilter === 'security' && mentor.interests.some(interest =>
        interest.toLowerCase().includes('security') || interest.toLowerCase().includes('hacking'))) ||
      (interestFilter === 'cloud' && mentor.interests.some(interest =>
        interest.toLowerCase().includes('cloud') || interest.toLowerCase().includes('aws') || interest.toLowerCase().includes('azure'))) ||
      (interestFilter === 'design' && mentor.interests.some(interest =>
        interest.toLowerCase().includes('design') || interest.toLowerCase().includes('ux') || interest.toLowerCase().includes('ui'))) ||
      (interestFilter === 'development' && mentor.interests.some(interest =>
        interest.toLowerCase().includes('development') || interest.toLowerCase().includes('programming') ||
        interest.toLowerCase().includes('react') || interest.toLowerCase().includes('node')))

    return educationMatch && fieldMatch && interestMatch
  })

  return (
    <div className="mentor-match-page">
      <Navbar />

      <main className="mentor-match-main">
        <div className="hero-section">
          <h2 className="page-title">UC IT Mentor Match</h2>
          <p className="page-subtitle">Connect with experienced IT professionals</p>
        </div>

        <div className="filter-section">
          <h3 className="filter-title">Filter Mentors</h3>
          <div className="filter-controls">
            <div className="filter-group">
              <label>Education Level</label>
              <select
                value={educationFilter}
                onChange={(e) => setEducationFilter(e.target.value)}
              >
                <option value="all">All Education Levels</option>
                <option value="bachelors">Bachelor's</option>
                <option value="masters">Master's</option>
                <option value="phd">PhD</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Field of Study</label>
              <select
                value={fieldFilter}
                onChange={(e) => setFieldFilter(e.target.value)}
              >
                <option value="all">All Fields</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="cloud">Cloud Computing</option>
                <option value="design">UX/UI Design</option>
                <option value="software">Software Engineering</option>
                <option value="data">Data Science</option>
                <option value="mobile">Mobile Development</option>
                <option value="network">Network Engineering</option>
                <option value="database">Database Administration</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Interests</label>
              <select
                value={interestFilter}
                onChange={(e) => setInterestFilter(e.target.value)}
              >
                <option value="all">All Interests</option>
                <option value="security">Security</option>
                <option value="cloud">Cloud Technologies</option>
                <option value="design">Design</option>
                <option value="development">Development</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mentors-list-section">
          <p className="mentor-count">Showing {filteredMentors.length} mentors</p>
          <div className="mentors-grid">
            {filteredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default MentorMatch
