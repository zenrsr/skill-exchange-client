import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';

const parseSkills = (value) =>
  value
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)
    .map((name) => ({ name, level: 'beginner', experienceYears: 0 }));

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    skillsOffered: '',
    skillsWanted: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        skillsOffered: parseSkills(form.skillsOffered),
        skillsWanted: parseSkills(form.skillsWanted),
      });
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to register';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>Create your Skill Exchange profile</h1>
      <p className="text-muted mb-lg">Tell us the skills you can teach and what you want to learn.</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            placeholder="Alex Learner"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            minLength={6}
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="skillsOffered">Skills you can teach (comma separated)</label>
          <input
            id="skillsOffered"
            name="skillsOffered"
            placeholder="Spanish conversation, UX research"
            value={form.skillsOffered}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="skillsWanted">Skills you want to learn</label>
          <input
            id="skillsWanted"
            name="skillsWanted"
            placeholder="Python automation, Public speaking"
            value={form.skillsWanted}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Register'}
        </button>
      </form>
      <p className="text-center mt-md">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
