import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
    const [attendanceDate, setAttendanceDate] = useState('');
    const [currentUser,setCurrentUser]=useState("")
    const navigate=useNavigate();


 
   useEffect(() => {
    const fetchEmployees=async ()=> {
        try {
            const employeeData=localStorage.getItem('employeeData')
            if (employeeData) {
             const parsedData=JSON.parse(employeeData);
              setCurrentUser(parsedData);
              console.log(parsedData);
              
            } else {
              alert("No employee data found");
              navigate("/employee/login")
            }   
        } catch (error) {
          console.log(error, "error while fetching employees");
          throw error;
        }
   }
   fetchEmployees();
   }, [navigate])
   

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setAttendanceDate(today);
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    // Add your logout logic here
    alert("Logout functionality will be implemented here");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header with user info and logout */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={currentUser.image} 
                alt="User avatar" 
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
              <div>
                <h3 className="font-medium text-gray-800">{currentUser.firstName}</h3>
                <p className="text-sm text-gray-500">{currentUser.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg text-2xl font-bold shadow-lg">
            Attendance & Leave Management
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mark Attendance Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Mark Your Attendance
            </h2>
            <div className="space-y-4">
              {/* Add date selector for attendance */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Today's Date:</label>
                <input 
                  type="date" 
                  value={attendanceDate}
                  readOnly
                  disabled
                  className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 text-gray-700"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2"> Employee:</label>
                <h2 className="text-lg font-semibold text-indigo-700 bg-indigo-50 p-3 rounded-lg border border-indigo-200"> {currentUser.firstName} </h2>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                  Present
                </button>
                <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                  Late
                </button>
                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                  Absent
                </button>
              </div>
            </div>
          </div>

          {/* Request Leave Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Request Leave
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Employee:</label>
                <h2 className="text-lg font-semibold text-indigo-700 bg-indigo-50 p-3 rounded-lg border border-indigo-200">{currentUser.firstName}</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Start Date:</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">End Date:</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Reason:</label>
                <textarea
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Please provide your leave reason..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit Leave Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
   
  