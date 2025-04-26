import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';

function EmployeeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if id exists before making the request
    if (!id) {
      setError("Employee ID is missing");
      setLoading(false);
      return;
    }

    const fetchEmployee = async () => {
      try {
        console.log(`Fetching employee with ID: ${id}`);
        const response = await fetch(`http://localhost:3000/employee/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log("Employee data received:", data);
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setError(`Failed to load employee data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Error</h1>
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Employee Details</h1>
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        
        {employee && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Employee Profile Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-2xl mb-4">
                    {employee.profileImage ? (
                      <img 
                        src={employee.profileImage} 
                        alt={`${employee.firstName} ${employee.lastName}`} 
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <span>{employee.firstName?.[0]}{employee.lastName?.[0]}</span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold">{employee.firstName} {employee.lastName}</h2>
                  <p className="text-blue-100">{employee.position}</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800">{employee.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-800">{employee.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-gray-800">{employee.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Department</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {employee.department}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Employment Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Employment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Employee ID</p>
                    <p className="text-gray-800 font-medium">{employee._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="text-gray-800 font-medium">{employee.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-gray-800 font-medium">{employee.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Join Date</p>
                    <p className="text-gray-800 font-medium">
                      {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not available'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="text-gray-800 font-medium">
                      {employee.salary ? `$${Number(employee.salary).toLocaleString()}` : 'Not available'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Employment Status</p>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Performance Metrics */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{employee.performance?.rating}</div>
                    <p className="text-sm text-gray-500">Performance Rating</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{employee.performance?.projects}</div>
                    <p className="text-sm text-gray-500">Projects Completed</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{employee.performance?.completedTasks}</div>
                    <p className="text-sm text-gray-500">Tasks Completed</p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Employee
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Generate Report
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Employee
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeDetailsPage;