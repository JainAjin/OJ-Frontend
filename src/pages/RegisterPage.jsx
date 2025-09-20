import React from 'react'
import { Link } from 'react-router-dom'     
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Hook for programmatic navigation
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // This function is called when the user clicks the "REGISTER" button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the browser from reloading the page
    setError(''); // Clear previous errors
    setSuccessMessage(''); // Clear previous success messages

    try {
      // 1. Make a POST request to your backend registration endpoint
      const response = await fetch(`${API_URL}/auth/signIn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell the backend we are sending JSON data
        },
        // 2. Convert the form data from state into a JSON string
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        // 3. If registration is successful
        setSuccessMessage('Registration successful! Redirecting to login...');
        // Redirect the user to the login page after a 2-second delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // 4. If the backend returns an error (e.g., username already exists)
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      // 5. This catches network errors (e.g., if the backend server is not running)
      setError('An error occurred. Could not connect to the server.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-md w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Create an Account</h2>

        {/* Display success or error messages */}
        {successMessage && <p className="bg-green-100 text-green-700 p-3 rounded-md text-center">{successMessage}</p>}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="sr-only">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Use 8+ characters with a mix of letters, numbers & symbols.</p>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
            >
              REGISTER
            </button>
          </div>
          <p className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage