import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in both fields.');
    } else {
      setErrorMessage('');
      console.log('Logging in with:', email, password);
    }
  };

  // Define the googleSignIn function
  const googleSignIn = () => {
    // Your Google sign-in logic here
    console.log("Signing in with Google");
  };

  return (
    <div className='login-page'>
      <div className="login-right-section">
        <h1>Log in to Your Account</h1>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">
            <input
              type="email"
              id="email"
              className='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label htmlFor="password">
            <input
              type="password"
              id="password"
              className='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="create-account">
            Log in
          </button>
        </form>

        <div className="or-register">
          <hr />
          <p>Or log in with</p>
          <hr />
        </div>

        <button onClick={googleSignIn} className="google-btn">
        Login with Google
        </button>

        <p>Don't have an account? <span>Create one</span></p>
      </div>
    </div>
  );
};

export default LoginForm;