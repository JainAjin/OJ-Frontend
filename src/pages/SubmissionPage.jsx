import React from 'react'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SubmissionPage = () => {
  // State to hold submission data, loading status, and any errors.
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
   const navigate = useNavigate();

  // The useEffect hook runs once when the component mounts to fetch data.
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const UserID = localStorage.getItem('User_ID');
        if (!token) {
          throw new Error('Please log in to view your submissions.');
        }

        // Make an authenticated GET request to your backend endpoint.
        const response = await fetch(`http://localhost:8084/submit/attempts/${UserID}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          navigate('/error');
        }

        const data = await response.json();
        setSubmissions(data); // Update state with the fetched submissions.
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []); // Empty array ensures this effect runs only once.

  // Helper function to determine the color of the status text.
  const getStatusColor = (status) => {
    if (status.toLowerCase().includes('accepted')) {
      return 'text-green-500';
    }
    if (status.toLowerCase().includes('wrong')) {
      return 'text-red-500';
    }
    if (status.toLowerCase().includes('time')) {
        return 'text-yellow-500';
    }
    return 'text-gray-500'; // Default color for pending, compiling, etc.
  };
  
  if (loading) {
    return <div className="p-8 text-center">Loading Submissions...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Submissions</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.length > 0 ? (
                submissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {/* Assuming the submission object has a nested problem object with a title */}
                      <Link to={`/problems/${sub.problem_id.id}`} className="text-blue-600 hover:underline">
                        {sub.problem_id.title}
                      </Link>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getStatusColor(sub.status)}`}>
                      {sub.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sub.language}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sub.submitted_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    You have no submissions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SubmissionPage