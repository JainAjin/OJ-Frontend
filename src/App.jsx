import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProblemListPage from './pages/ProblemListPage';
import ProblemPage from './pages/ProblemPage';
import ProfilePage from './pages/ProfilePage';
import SubmissionPage from './pages/SubmissionPage';
import { useState, useEffect,useNavigate } from 'react';
import ErrorPage from './pages/ErrorPage';
import AddProblemPage from './pages/AddProblemPage';
import AddTestsPage from './pages/AddTestsPage';

function App() {
   const [token, setToken] = useState(localStorage.getItem('token'));
   const [userId,setUserId] = useState(localStorage.getItem('User_ID'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    localStorage.removeItem('User_ID');
    setUserId(null);
    // Optionally, you can also use a navigation hook here to
    // navigate to login page...
  };
  return (
    <div className="min-h-screen bg-white">
      <Navbar token={token} handleLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/" element={<ProblemListPage />} />
          <Route path="/problems" element={<ProblemListPage />} />
          <Route path="/login" element={<LoginPage setToken={setToken}/>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/problems/:id" element={<ProblemPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/submissions" element={<SubmissionPage />} />
          <Route path="/addproblem" element={<AddProblemPage />} />
          <Route path="/addtest" element={<AddTestsPage/>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

