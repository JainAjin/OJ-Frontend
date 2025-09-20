import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const AddProblemPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(1000); // Default to 1000 ms
  const [memoryLimit, setMemoryLimit] = useState(256); // Default to 256 KB
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  // State for handling feedback to the user
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to add a problem.');
      }

      // 1. Construct the JSON payload from the form state
      const problemData = {
        title,
        description,
        timeLimit,
        memoryLimit,
      };

      // 2. Make an authenticated POST request to the backend
      const response = await fetch(`${API_URL}/problem/addProblem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(problemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add the problem.');
      }

      // 3. Handle a successful response
      setSuccessMessage('Problem added successfully! Redirecting to the problem list...');
      setTimeout(() => {
        navigate('/problems');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-2xl w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Add a New Problem</h2>
        
        {successMessage && <p className="bg-green-100 text-green-700 p-3 rounded-md text-center">{successMessage}</p>}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              required
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700">Time Limit (ms)</label>
              <input
                id="timeLimit"
                type="number"
                required
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value, 10))}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="memoryLimit" className="block text-sm font-medium text-gray-700">Memory Limit (KB)</label>
              <input
                id="memoryLimit"
                type="number"
                required
                value={memoryLimit}
                onChange={(e) => setMemoryLimit(parseInt(e.target.value, 10))}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {isLoading ? 'Submitting...' : 'Add Problem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProblemPage