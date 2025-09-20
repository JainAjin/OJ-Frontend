import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


const ProblemListPage = () => {
 const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // The useEffect hook runs once when the component mounts to fetch data.
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        // 1. Retrieve the JWT token from localStorage.
        const token = localStorage.getItem('token');
        // if (!token) {
        //   throw new Error('Authentication token not found. Please log in.');
        // }

        // 2. Make an authenticated GET request to the backend.
        // Make sure this URL matches your backend's endpoint for all problems.
        const response = await fetch(`${API_URL}/problem`, {
          headers: {
            // 3. Include the JWT in the Authorization header.
            // 'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch problems. Status: ${response.status}`);
        }

        const data = await response.json();
        setProblems(data); // 4. Update the state with the fetched problems.
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // 5. Set loading to false after the fetch is complete.
      }
    };

    fetchProblems();
  }, []); // The empty dependency array [] ensures this effect runs only once.

  // Display a loading message while data is being fetched.
  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading problems...</div>;
  }

  // Display an error message if the fetch failed.
  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#333A44] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#272E3A] p-6 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-6">Problem Set</h1>
          
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-400 font-bold uppercase px-4 py-2">
            <span>Problem Name</span>
          </div>

          {/* Problems List */}
          <div className="space-y-2">
            {problems.map(p => (
              <Link to={`/problems/${p.id}`} key={p.id} className="grid grid-cols-3 gap-4 items-center bg-[#333A44] p-4 rounded-md hover:bg-[#3d4551] transition">
                <span className="text-blue-400 font-medium">{p.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemListPage