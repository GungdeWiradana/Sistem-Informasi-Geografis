// Register.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import Swal from 'sweetalert2';

const Register = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/register`, form);
      Swal.fire({
        title: 'Success!',
        text: 'Registration successful! You can now log in.',
        icon: 'success',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#3085d6'
      }).then(() => navigate('/'));
    } catch (err) {
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Create an Account</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="input-group">
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-btn">Register</button>
        <div className="register-link">
          <p>Already have an account? <a href="/">Login here</a></p>
        </div>
      </form>
    </div>
  );
};

export default Register;
