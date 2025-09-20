import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const ProblemPage = () => {
   const { id } = useParams();

    // State to hold the fetched problem data, loading status, and any errors.
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for the code editor and submission form
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('cpp');
    const [submissionStatus, setSubmissionStatus] = useState('');
     const navigate = useNavigate();

    // This effect runs when the component mounts or when the `id` in the URL changes.
    useEffect(() => {
        const fetchProblem = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                   navigate('/error');
                }

                // Note: The URL is updated to match your backend structure.
                const response = await fetch(`http://localhost:8084/problem/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch problem. Server responded with ${response.status}`);
                }

                const data = await response.json();
                setProblem(data);
                setCode(getBoilerplate(language));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, [id]); // Effect depends on the problem ID from the URL

    // Helper function to provide boilerplate code
    const getBoilerplate = (lang) => {
        switch (lang) {
            case 'cpp':
                return `#include <iostream>\nusing namespace std;\nint main(){\n // write your code here \n return 0;\n};`;
            case 'java':
                return `public class Main {\n public static void main(String[] args){\n // write your code here \n}\n};`;
            default:
                return '';
        }
    };

    // This function handles the code submission.
    const handleSubmit = async () => {
        setSubmissionStatus(`Submitting ${language} code...`);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Authentication error. Please log in again.");
            }

            const response = await fetch('http://localhost:8084/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    problem_id:problem,
                    sourceCode: code,
                    language: language,
                    userID: localStorage.getItem('User_ID')
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Submission failed');
            }

            const result = await response.text();
            setSubmissionStatus(`Submission status ${result}.`);
            // Here you would typically start polling a results endpoint.
        } catch (err) {
            setSubmissionStatus(err.message || 'An error occurred during submission.');
        }
    };

    if (loading) return <div className="p-6 text-center bg-[#1e2024] text-gray-300 min-h-screen">Loading Problem...</div>;
    if (error) return <div className="p-6 text-center text-red-400 bg-[#1e2024] min-h-screen">Error: {error}</div>;
    if (!problem) return <div className="p-6 text-center bg-[#1e2024] text-gray-300 min-h-screen">Problem not found.</div>;

    return (
<div className="min-h-screen bg-[#1e2024] text-gray-300 font-sans p-4 flex flex-col">
    {/* The grid now grows to fill the available space within the flex container */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow">
        
        {/* Left Side: Problem Statement */}
        <div className="bg-[#272E3A] p-6 rounded-lg flex flex-col">
            <div className="flex border-b border-gray-700 mb-4 flex-shrink-0">
                <button className="px-4 py-2 text-white border-b-2 border-blue-500 font-semibold">Statement</button>
                {/* Use a proper navigation hook for this button */}
                <button 
                    onClick={() => navigate('/submissions')} 
                    className="px-4 py-2 text-gray-400 hover:text-white"
                >
                    Submissions
                </button>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4 flex-shrink-0">{problem.title}</h1>
            
            {/* Single Scrollable Container for all content */}
            <div className="overflow-y-auto flex-grow prose prose-invert max-w-none text-gray-300">
                <p className='whitespace-break-spaces'>{problem.description}</p>
                
                {/* Sample Test Cases Section */}
                {problem.test && problem.test.filter(t => t.isSample).length > 0 && (
                    <div className="mt-6">
                        <h3 className="font-semibold text-lg text-white">Sample Test Cases</h3>
                        {problem.test.map((test, index) => (
                            test.isSample && (
                                <div key={test.id} className="mt-2 p-3 border border-gray-700 rounded-md bg-[#1e2024]">
                                    <p className="font-semibold text-sm">Sample #{index + 1}</p>
                                    <pre className="bg-[#333A44] p-2 rounded-md whitespace-pre-wrap text-sm mt-1">
                                        <strong>Input:</strong>{"\n"}
                                        {test.input}
                                    </pre>
                                    <pre className="bg-[#333A44] p-2 rounded-md whitespace-pre-wrap mt-2 text-sm">
                                        <strong>Expected Output:</strong>{"\n"}
                                        {test.expected_output}
                                    </pre>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
            
            <div className="border-t border-gray-700 pt-4 text-sm flex-shrink-0 mt-4">
                <p><strong>Time Limit:</strong> {problem.timeLimit} ms</p>
                <p><strong>Memory Limit:</strong> {problem.memoryLimit} KB</p>
            </div>
        </div>

        {/* Right Side: Code Editor (Structure is correct and remains the same) */}
        <div className="bg-[#272E3A] p-1 rounded-lg flex flex-col">
            <div className="flex justify-between items-center bg-[#333A44] p-2 rounded-t-lg flex-shrink-0">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none"
                >
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                </select>
            </div>
            <textarea
                className="w-full flex-grow bg-[#1e2024] p-4 font-mono text-sm resize-none focus:outline-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
            />
            <div className="bg-[#333A44] p-4 flex justify-end space-x-4 rounded-b-lg flex-shrink-0">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-md"
                >
                    Submit
                </button>
            </div>
            {submissionStatus && <p className="text-center text-sm text-gray-400 py-2 flex-shrink-0">{submissionStatus}</p>}
        </div>
    </div>
</div>

    );
}

export default ProblemPage