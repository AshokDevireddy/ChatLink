import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

console.log("Current URL:", window.location.href);


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    console.log("Current URL on LoginPage load:", window.location.href);
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    console.log("Token received in URL:", urlToken);

    if (urlToken) {
      console.log("Token received in URL:", urlToken);

      setToken(urlToken);
      localStorage.setItem('token', urlToken); // Store the token in local storage
      history.replace('/dashboard'); // Ensure token is set before redirecting
    } else {
      console.log("URL search params:", window.location.search); // Moved inside else
      console.log("Token received in URL:", urlToken);
    }
  }, [setToken, history]);

  console.log("Rendering LoginPage");

  const handleGoogleLogin = () => {
    console.log("Initiating Google login");
    window.location.href = 'http://localhost:5001/auth/google';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      setToken(response.data.token);
      history.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
    console.log("Attempting to login with:", email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>

      <button type="button" onClick={handleGoogleLogin}>Login with Google</button>
      {/* Additional elements... */}
    </form>
  );
}

export default LoginPage;
