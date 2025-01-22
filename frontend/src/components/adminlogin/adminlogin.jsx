import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminCredentials from '../../../../backend/admindata';
import './adminlogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if the entered credentials match any stored admin credentials
    const user = adminCredentials.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      navigate('/Adminhall');
    } else {
      setError('Invalid email or password');
      alert('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="left-photo">
          <img src="/asserts/loginSvg.png" alt="Login illustration" />
        </div>

        <div className="login-right-section">
          <h1>Admin Login</h1>
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              className="input"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="input"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn green-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
