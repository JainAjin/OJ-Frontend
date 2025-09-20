import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const AddTestsPage = () => {
  const [problemId, setProblemId] = useState('');
  const [input, setInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [isSample, setIsSample] = useState(false);
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
        throw new Error('You must be logged in to add a test case.');
      }
      const ProblemResponse = await fetch(`${API_URL}/problem/${problemId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await ProblemResponse.json();
      // 1. Construct the JSON payload from the form state
      const testCaseData = {
        input,
        expected_output: expectedOutput, // Ensure key matches backend expectation
        isSample,
        problem_id:data,
      };

      // 2. Make an authenticated POST request to the backend
      const response = await fetch(`${API_URL}/test/addtest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(testCaseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add the test case.');
      }

      // 3. Handle a successful response
      setSuccessMessage('Test case added successfully! You can add another or navigate away.');
      // Clear the form for the next entry
      setInput('');
      setExpectedOutput('');
      setIsSample(false);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-2xl w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Add a New Test Case</h2>
        
        {successMessage && <p className="bg-green-100 text-green-700 p-3 rounded-md text-center">{successMessage}</p>}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="problemId" className="block text-sm font-medium text-gray-700">Problem ID</label>
            <input
              id="problemId"
              type="number"
              required
              placeholder="Enter the ID of the problem"
              value={problemId}
              onChange={(e) => setProblemId(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="input" className="block text-sm font-medium text-gray-700">Input</label>
            <textarea
              id="input"
              required
              rows="6"
              placeholder='e.g., 5\n1 2 3 4 5'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
           <div>
            <label htmlFor="expectedOutput" className="block text-sm font-medium text-gray-700">Expected Output</label>
            <textarea
              id="expectedOutput"
              required
              rows="6"
              placeholder='e.g., 15'
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div className="flex items-center">
            <input
              id="isSample"
              type="checkbox"
              checked={isSample}
              onChange={(e) => setIsSample(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isSample" className="ml-2 block text-sm text-gray-900">Is this a sample test case? (Visible to users)</label>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {isLoading ? 'Submitting...' : 'Add Test Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTestsPage