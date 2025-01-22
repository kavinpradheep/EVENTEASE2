import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { auth, googleProvider } from '../../firebase-config';
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://eventease2.onrender.com/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Account created successfully!');
        navigate('/');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error occurred during registration.');
    }
  };

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('User logged in with Google: ', user);
    } catch (error) {
      console.error('Error during Google sign-in: ', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="left-photo">
          <img src="/asserts/loginSvg.png" alt="Login illustration" />
        </div>
        <div className="login-right-section">
          <h1>Welcome Back!</h1>
          <p>Join us today and unlock your journey.</p>
          <p>
            Already have an account?{' '}
            <span onClick={() => navigate('/login')}>Log In</span>
          </p>
          <p onClick={() => navigate('/Adminlogin')} className="admin-link">
            Admin Login
          </p>

          <form onSubmit={handleSubmit}>
            <div className="name">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="login-input"
                value={form.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="login-input"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="login-input"
              value={form.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="login-input"
              value={form.password}
              onChange={handleChange}
            />
            <button type="submit" className="login-button">Create Account</button>
          </form>


          <div className="or-register">
            <hr />
            <p>Or register with</p>
            <hr />
          </div>

          <button onClick={googleSignIn} className="google-btn">
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
