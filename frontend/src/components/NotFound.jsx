import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-6">
          <div className="text-center">
            <h1 className="text-white text-3xl font-bold">Page Not Found</h1>
            <p className="text-indigo-200 mt-2">The page you're looking for doesn't exist</p>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-8 text-center">
            <div className="text-7xl font-bold text-indigo-600 mb-4">404</div>
            <p className="text-gray-600 mb-6">
              Sorry, we couldn't find the page you're looking for. It might have been removed, 
              had its name changed, or is temporarily unavailable.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors duration-300"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;