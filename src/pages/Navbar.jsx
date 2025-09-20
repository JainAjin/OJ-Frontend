import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = ({ token, handleLogout }) => {

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-gray-800">Judge</Link>
            {/* These links will only be shown if a user is logged in */}
            {token && (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/problems" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Problems</Link>
                <Link to="/profile" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* This is the conditional rendering logic. */}
            {token ? (
              // If a token exists, show the Logout button.
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium"
              ><Link to="/login">Logout</Link>
              </button>
            ) : (
              // If no token exists, show the Login and Sign Up links.
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar