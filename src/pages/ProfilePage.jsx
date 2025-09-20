import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
   const navigate = useNavigate();
   const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please log in to view your profile.');
        }
        // CORRECTED FETCH URL:
        // This endpoint should be designed on your backend to return the profile
        // of the user associated with the provided JWT.
        const userId= localStorage.getItem('User_ID');
        const response = await fetch(`${API_URL}/auth/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          navigate('/error');
        }

        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []); // Empty array ensures this runs only once on component mount.

  if (loading) {
    return <div className="p-8 text-center">Loading Profile...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!userProfile) {
    return <div className="p-8 text-center">Could not load user profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: User Details */}
        <div className="md:col-span-2 space-y-4">
          <div>
           {/* <p className="text-sm text-gray-500">{userProfile.rank || 'Newbie'}</p> */}
            <h1 className="text-3xl font-bold text-gray-800">{userProfile.username}</h1>
          </div>
{/* 
          <div className="space-y-2 text-sm text-gray-700 border-t pt-4">
            <p><strong>Contest rating:</strong> {userProfile.rating || 873}</p>
            <p><strong>Contribution:</strong> {userProfile.contribution || 0}</p>
            <p><strong>Friend of:</strong> {userProfile.friends || 1} user</p>
          </div> */}

          <div className="space-y-2 text-sm border-t pt-4 text-blue-600 hover:underline">
            {/* <Link to="#" className="flex items-center text-blue-600 hover:underline">
              <span>&#9733;</span><span className="ml-2">My friends</span>
            </Link>
            <Link to="#" className="flex items-center text-blue-600 hover:underline">
              <span>&#9881;</span><span className="ml-2">Change settings</span>
            </Link> */}
            <Link to="/submissions">Your Submissions</Link>
          </div>
          
          <div className="space-y-2 text-sm border-t pt-4">
             <p><strong>Email:</strong> {userProfile.email}</p>
             <p><strong>Last visit:</strong> online now</p>
          </div>
        </div>

        {/* Right Column: Profile Picture */}
        <div className="md:col-span-1">
          <img 
            src={userProfile.imageUrl || "https://placehold.co/400x400/e2e8f0/64748b?text=Avatar"} 
            alt="User profile" 
            className="w-full h-auto rounded-lg shadow-md"
          />
          <div className="text-center mt-2 text-sm">
            <Link to="#" className="text-blue-600 hover:underline">Change photo</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage