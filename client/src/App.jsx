
import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams
} from 'react-router-dom';
import './App.css';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const internships = [
  {
    id: 'web-development',
    title: 'Web Development Intern',
    company: 'Tech Solutions',
    duration: '3 months',
    location: 'Remote',
    description:
      'Build responsive web applications using modern frontend and backend technologies.'
  },
  {
    id: 'data-science',
    title: 'Data Science Intern',
    company: 'Data Innovations',
    duration: '4 months',
    location: 'Hybrid',
    description:
      'Work with datasets, analyze trends, and develop data-driven solutions.'
  },
  {
    id: 'java-development',
    title: 'Java Development Intern',
    company: 'CodeWorks',
    duration: '3 months',
    location: 'On-site',
    description:
      'Learn Java programming and contribute to backend application development.'
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Intern',
    company: 'Creative Studio',
    duration: '2 months',
    location: 'Remote',
    description:
      'Design intuitive interfaces and improve user experiences.'
  }
];

function BackButton() {
  return (
    <Link to="/" className="button button-secondary back-button">
      ← Back to Internships
    </Link>
  );
}

function InternshipList() {
  return (
    <main className="container">
      <header className="hero">
        <p className="eyebrow">YOUR CAREER STARTS HERE</p>
        <h1>Student Internship Portal</h1>
        <p className="subtitle">
          Discover opportunities. Build your skills. Shape your future.
        </p>
      </header>

      <h2>Available Internships</h2>

      <div className="grid">
        {internships.map((item) => (
          <article className="card" key={item.id}>
            <span className="tag">{item.location}</span>
            <h3>{item.title}</h3>
            <p className="company">{item.company}</p>
            <p>{item.description}</p>
            <p>
              <strong>Duration:</strong> {item.duration}
            </p>
            <Link className="button" to={`/internships/${item.id}`}>
              View Details →
            </Link>
          </article>
        ))}
      </div>

      <div className="bottom-link">
        <Link to="/applications" className="button">
          View Submitted Applications →
        </Link>
      </div>
    </main>
  );
}

function InternshipDetails() {
  const { id } = useParams();
  const internship = internships.find((item) => item.id === id);

  if (!internship) {
    return (
      <main className="container">
        <BackButton />
        <h2>Internship not found</h2>
      </main>
    );
  }

  return (
    <main className="container">
      <BackButton />

      <article className="card details">
        <span className="tag">{internship.location}</span>
        <h1>{internship.title}</h1>
        <h3>{internship.company}</h3>
        <p>{internship.description}</p>
        <p>
          <strong>Duration:</strong> {internship.duration}
        </p>
        <p>
          <strong>Location:</strong> {internship.location}
        </p>

        <Link className="button" to={`/apply/${internship.id}`}>
          Apply Now →
        </Link>
      </article>
    </main>
  );
}

function ApplicationForm() {
  const { id } = useParams();

  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [selectedInternship, setSelectedInternship] = useState(id || '');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setIsError(false);

    if (
      !studentName.trim() ||
      !email.trim() ||
      !rollNumber.trim() ||
      !selectedInternship
    ) {
      setMessage('Please complete all fields.');
      setIsError(true);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentName: studentName.trim(),
          email: email.trim(),
          rollNumber: rollNumber.trim(),
          selectedInternship
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Application submission failed.');
      }

      setMessage('Application submitted successfully!');
      setStudentName('');
      setEmail('');
      setRollNumber('');
    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to the backend. Check the backend URL and server.'
          : error.message || 'Something went wrong. Please try again.'
      );
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container form-container">
      <BackButton />

      <h1>Internship Application</h1>
      <p className="subtitle">
        Enter your details to apply for an internship.
      </p>

      <form className="application-form" onSubmit={handleSubmit}>
        <label htmlFor="studentName">Student Name</label>
        <input
          id="studentName"
          name="studentName"
          type="text"
          value={studentName}
          onChange={(event) => setStudentName(event.target.value)}
          minLength={2}
          maxLength={100}
          autoComplete="name"
          required
        />

        <label htmlFor="email">Email ID</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          maxLength={254}
          autoComplete="email"
          required
        />

        <label htmlFor="rollNumber">Roll Number</label>
        <input
          id="rollNumber"
          name="rollNumber"
          type="text"
          value={rollNumber}
          onChange={(event) => setRollNumber(event.target.value)}
          minLength={1}
          maxLength={30}
          pattern="[A-Za-z0-9/_-]+"
          title="Use letters, numbers, hyphens, underscores, or slashes."
          required
        />

        <label htmlFor="selectedInternship">Select Internship</label>
        <select
          id="selectedInternship"
          name="selectedInternship"
          value={selectedInternship}
          onChange={(event) => setSelectedInternship(event.target.value)}
          required
        >
          <option value="">Choose an internship</option>
          {internships.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title} — {item.company}
            </option>
          ))}
        </select>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className={isError ? 'error' : 'success'}
          >
            {message}
          </p>
        )}
      </form>
    </main>
  );
}

function ApplicationsList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadApplications() {
      try {
        const response = await fetch(`${API_URL}/api/applications`, {
          signal: controller.signal
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || 'Could not retrieve applications.'
          );
        }

        setApplications(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Could not retrieve applications.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadApplications();

    return () => controller.abort();
  }, []);

  return (
    <main className="container">
      <BackButton />

      <h1>Submitted Applications</h1>
      <p className="subtitle">
        View student applications stored in the database.
      </p>

      {loading && <p>Loading applications...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && applications.length === 0 && (
        <p className="empty-state">No applications submitted yet.</p>
      )}

      <div className="grid">
        {applications.map((app) => {
          const internship = internships.find(
            (item) => item.id === app.selectedInternship
          );

          return (
            <article className="card application-card" key={app._id}>
              <h3>{app.studentName}</h3>
              <p>
                <strong>Email:</strong> {app.email}
              </p>
              <p>
                <strong>Roll number:</strong> {app.rollNumber}
              </p>
              <p>
                <strong>Internship:</strong>{' '}
                {internship?.title || app.selectedInternship}
              </p>
              {app.createdAt && (
                <p>
                  <strong>Submitted:</strong>{' '}
                  {new Date(app.createdAt).toLocaleString()}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InternshipList />} />
        <Route path="/internships/:id" element={<InternshipDetails />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/apply/:id" element={<ApplicationForm />} />
        <Route path="/applications" element={<ApplicationsList />} />
        <Route
          path="*"
          element={
            <main className="container">
              <h1>Page not found</h1>
              <Link to="/" className="button">
                Return to Home
              </Link>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
