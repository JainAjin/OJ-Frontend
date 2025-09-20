import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const LoginPage = ({setToken}) => {
     const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for programmatic navigation
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // This function is called when the user submits the form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission (page reload)
    setError(''); // Clear any previous errors

    try {
      // Make a POST request to your backend's login endpoint
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell the backend we're sending JSON
        },
        // Convert the username and password from state into a JSON string
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // If login is successful, parse the JSON response to get the token
        const data = await response.json();
        
        if (data && data.token) {
          // Save the received token to the browser's local storage
          setToken(data.token);
          localStorage.setItem('token', data.token);
          localStorage.setItem('User_ID', data.user_id);
          // Redirect the user to the problems page
          navigate('/problems');
        } else {
          setError('Login successful, but no token was provided by the server.');
        }
      } else {
        // If the server returns an error (e.g., 401 Unauthorized)
        setError('Login failed. Please check your username and password.');
      }
    } catch (err) {
      // This catches network errors (e.g., server is down)
      setError('An error occurred. Could not connect to the server.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-md w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Login</h2>
        {/* Display the error message if it exists */}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center">{error}</p>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="sr-only">Username or Email</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
            >
              LOGIN
            </button>
          </div>
          <div className="text-center">
            <Link to="#" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage