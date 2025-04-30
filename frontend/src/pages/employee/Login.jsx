import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EmployeeLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
       const response = await fetch("http://localhost:3000/employee/login", {
       method: "POST",
       body: JSON.stringify({email, password}),
       headers: {
           "Content-Type": "application/json"
       }
      });
      const data = await response.json();  

      if (response.ok) {
        // Check if employee data exists
        if (!data || Object.keys(data).length === 0) {
          setError("No employee data found. You do not have access.");
          setIsLoading(false);
          return;
        }
        
        // Store employee data in localStorage
        localStorage.setItem('employeeData', JSON.stringify(data));
        setIsLoading(false);
        alert("Login successfully");
        navigate('/employee/dashboard');
      } else {
        setError(data.message || "No employee found with these credentials. You do not have access.");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error, "error while logging in");
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-6">
          <div className="text-center">
            <h1 className="text-white text-3xl font-bold">Employee Portal</h1>
            <p className="text-indigo-200 mt-2">Sign in to access your dashboard</p>
          </div>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="your.email@company.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">

              </div>
              
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
          
         
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              <button 
                onClick={() => navigate('/')} 
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
              ← Go back to Home Page
               </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeLogin