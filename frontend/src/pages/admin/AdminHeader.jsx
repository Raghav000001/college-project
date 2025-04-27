import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    // Clear any auth tokens from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Redirect to login page
    navigate('/login')
  }

  return (
    <header className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span className="font-bold text-xl cursor-pointer">Elysium Admin</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/admin/dashboard" className="hover:text-blue-200 transition-colors">Dashboard</Link>
            <Link to="/admin/attendance" className="hover:text-blue-200 transition-colors">Attendance</Link>
            <Link to="/admin/leaves" className="hover:text-blue-200 transition-colors">Leaves</Link>
            <Link to="/admin/ratings" className="hover:text-blue-200 transition-colors">Ratings</Link>
            <Link to="/admin/salary" className="hover:text-blue-200 transition-colors">Salary</Link>
            <Link to="/admin/queries" className="hover:text-blue-200 transition-colors">Queries</Link>
            
            {/* User dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <span>Admin</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-blue-700">
            <Link to="/admin/dashboard" className="block py-2 hover:text-blue-200">Dashboard</Link>
            <Link to="/admin/employees" className="block py-2 hover:text-blue-200">Employees</Link>
            <Link to="/admin/attendance" className="block py-2 hover:text-blue-200">Attendance</Link>
            <Link to="/admin/leaves" className="block py-2 hover:text-blue-200">Leaves</Link>
            <Link to="/admin/salary" className="block py-2 hover:text-blue-200">Salary</Link>
            <Link to="/admin/queries" className="block py-2 hover:text-blue-200">Queries</Link>
            <Link to="/admin/settings" className="block py-2 hover:text-blue-200">Settings</Link>
            <button 
              onClick={handleLogout}
              className="block w-full text-left py-2 hover:text-blue-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default AdminHeader