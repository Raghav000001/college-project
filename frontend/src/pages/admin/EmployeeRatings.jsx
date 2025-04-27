import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import { useNavigate } from 'react-router-dom';

function EmployeeRatings() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [ratingPeriod, setRatingPeriod] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/show-employees", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      
      const data = await response.json();
      setEmployees(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees. Please try again later.");
      setLoading(false);
    }
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    // Reset form when selecting a new employee
    setRating(0);
    setFeedback('');
    setRatingPeriod('');
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    
    if (!selectedEmployee || rating === 0 || !ratingPeriod) {
      setError("Please select an employee, provide a rating, and specify the rating period.");
      return;
    }

    try {
      const ratingData = {
        employeeId: selectedEmployee._id,
        rating,
        feedback,
        period: ratingPeriod,
        date: new Date().toISOString()
      };

      const response = await fetch("http://localhost:3000/add-rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ratingData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      setSuccess("Rating submitted successfully!");
      // Reset form
      setSelectedEmployee(null);
      setRating(0);
      setFeedback('');
      setRatingPeriod('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting rating:", error);
      setError("Failed to submit rating. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Employee Ratings</h1>
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-300"
          >
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
            <p>{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee List */}
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-1">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Select Employee</h2>
            
            {loading ? (
              <p className="text-gray-500">Loading employees...</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {employees.map(employee => (
                  <div 
                    key={employee._id}
                    onClick={() => handleEmployeeSelect(employee)}
                    className={`p-3 rounded-md cursor-pointer transition-colors duration-200 ${
                      selectedEmployee && selectedEmployee._id === employee._id 
                        ? 'bg-blue-100 border border-blue-300' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {employee.profileImage ? (
                          <img 
                            src={employee.profileImage} 
                            alt={`${employee.firstName} ${employee.lastName}`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{employee.position}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rating Form */}
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {selectedEmployee 
                ? `Rate ${selectedEmployee.firstName} ${selectedEmployee.lastName}` 
                : 'Select an employee to rate'}
            </h2>

            {selectedEmployee ? (
              <form onSubmit={handleSubmitRating} className="space-y-6">
                {/* Rating Period */}
                <div>
                  <label htmlFor="ratingPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                    Rating Period
                  </label>
                  <select
                    id="ratingPeriod"
                    value={ratingPeriod}
                    onChange={(e) => setRatingPeriod(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Period</option>
                    <option value="Q1">Q1 (Jan-Mar)</option>
                    <option value="Q2">Q2 (Apr-Jun)</option>
                    <option value="Q3">Q3 (Jul-Sep)</option>
                    <option value="Q4">Q4 (Oct-Dec)</option>
                    <option value="Mid-Year">Mid-Year Review</option>
                    <option value="Annual">Annual Review</option>
                  </select>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Performance Rating
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className="focus:outline-none"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-8 w-8 ${
                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                          }`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                    <span className="ml-2 text-gray-700">
                      {rating > 0 ? `${rating}/5` : 'Not rated'}
                    </span>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback & Comments
                  </label>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide detailed feedback about the employee's performance..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    Submit Rating
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>Please select an employee from the list to provide a rating.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeRatings;