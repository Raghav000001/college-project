import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
    const [attendanceDate, setAttendanceDate] = useState('');
    const [currentUser, setCurrentUser] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [attendanceStatus, setAttendanceStatus] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [leaveLoading, setLeaveLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const employeeData = localStorage.getItem('employeeData')
                if (employeeData) {
                    const parsedData = JSON.parse(employeeData);
                    setCurrentUser(parsedData);
                    // Check if attendance already marked for today
                    checkTodayAttendance(parsedData._id);
                } else {
                    alert("No employee data found");
                    navigate("/employee/login")
                }
            } catch (error) {
                console.log(error, "error while fetching employees");
                throw error;
            } finally {
                setLoading(false);
            }
        }
        fetchEmployees();
    }, [navigate])

    // Check if attendance is already marked for today
    const checkTodayAttendance = async (employeeId) => {
        try {
            const response = await fetch(`http://localhost:3000/employee-attendance/${employeeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                const today = new Date().toISOString().split('T')[0];
                
                // Find if there's an attendance record for today
                const todayAttendance = data.data.find(record => record.date === today);
                
                if (todayAttendance) {
                    setAttendanceStatus(todayAttendance.status);
                    setMessage({
                        text: `You have already marked your attendance as ${todayAttendance.status} today.`,
                        type: 'info'
                    });
                }
            }
        } catch (error) {
            console.error("Error checking today's attendance:", error);
        }
    };

    // Handle marking attendance
    const markAttendance = async (status) => {
        if (attendanceStatus) {
            setMessage({
                text: `You have already marked your attendance as ${attendanceStatus} today.`,
                type: 'warning'
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/mark-attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeeId: currentUser._id,
                    status: status,
                    date: attendanceDate
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setAttendanceStatus(status);
                setMessage({
                    text: 'Attendance marked successfully!',
                    type: 'success'
                });
            } else {
                setMessage({
                    text: data.message || 'Failed to mark attendance',
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
            setMessage({
                text: 'An error occurred while marking attendance',
                type: 'error'
            });
        } finally {
            setLoading(false);
            // Clear message after 5 seconds
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 5000);
        }
    };

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setAttendanceDate(today);

        // Simulate fetching leave history
        setLeaveLoading(true);
        setTimeout(() => {
            // dummy data
            setLeaveHistory([
                { id: 1, startDate: '2023-10-15', endDate: '2023-10-18', reason: 'Family vacation', status: 'Approved' },
                { id: 2, startDate: '2023-09-05', endDate: '2023-09-06', reason: 'Medical appointment', status: 'Approved' },
                { id: 3, startDate: '2023-11-20', endDate: '2023-11-22', reason: 'Personal leave', status: 'Pending' },
            ]);
            setLeaveLoading(false);
        }, 1000);
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('employeeData');
        navigate('/employee/login');
    };

    // Toggle mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Get status badge color
    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
            {/* Header with user info and logout */}
            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {currentUser.image ? (
                                <img
                                    src={currentUser.image}
                                    alt="User avatar"
                                    className="w-10 h-10 rounded-full border-2 border-indigo-500 shadow-md"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium shadow-md">
                                    {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
                                </div>
                            )}
                            <div className="hidden sm:block">
                                <h3 className="font-medium text-gray-800">{currentUser.firstName} {currentUser.lastName}</h3>
                                <p className="text-sm text-gray-500">{currentUser.email}</p>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <button 
                            className="sm:hidden text-gray-600 focus:outline-none"
                            onClick={toggleMenu}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="hidden sm:flex bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>

                    {/* Mobile menu */}
                    {isMenuOpen && (
                        <div className="sm:hidden mt-4 pb-2 border-t border-gray-200 pt-3">
                            <div className="flex flex-col space-y-3">
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-600">Name:</span>
                                    <span className="font-medium">{currentUser.firstName} {currentUser.lastName}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <span className="text-gray-600">Email:</span>
                                    <span>{currentUser.email}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="mt-2 w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <div className="container mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <h1 className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg text-xl sm:text-2xl font-bold shadow-lg transform hover:scale-105 transition-transform duration-300 mb-4 sm:mb-0">
                        Attendance & Leave Management
                    </h1>
                    
                    <div className="text-sm text-gray-600 bg-white p-2 rounded-lg shadow-md">
                        <span className="font-medium">Today:</span> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* Loading indicator */}
                {loading && (
                    <div className="flex justify-center items-center my-6">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                )}

                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg shadow-md border-l-4 transform transition-all duration-300 ${
                        message.type === 'success' ? 'bg-green-50 text-green-800 border-green-500 border-l-4' :
                        message.type === 'error' ? 'bg-red-50 text-red-800 border-red-500 border-l-4' :
                        message.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border-yellow-500 border-l-4' :
                        'bg-blue-50 text-blue-800 border-blue-500 border-l-4'
                    }`}>
                        <div className="flex items-center">
                            {message.type === 'success' && (
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                            {message.type === 'error' && (
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                            {message.type === 'warning' && (
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            )}
                            {message.type === 'info' && (
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            )}
                            {message.text}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {/* Mark Attendance Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center border-b pb-3">
                            <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Employee:</label>
                                <div className="text-lg font-semibold text-indigo-700 bg-indigo-50 p-3 rounded-lg border border-indigo-200 flex items-center">
                                    {currentUser.image ? (
                                        <img src={currentUser.image} alt="Employee" className="w-8 h-8 rounded-full mr-2" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 mr-2">
                                            {currentUser.firstName?.charAt(0)}
                                        </div>
                                    )}
                                    {currentUser.firstName} {currentUser.lastName}
                                </div>
                            </div>

                            {attendanceStatus ? (
                                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-center shadow-sm">
                                    <p className="text-blue-800 font-medium">Your attendance status for today: </p>
                                    <p className={`text-lg font-bold mt-3 ${
                                        attendanceStatus === 'present' ? 'text-green-600' : 
                                        attendanceStatus === 'late' ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                        {attendanceStatus.charAt(0).toUpperCase() + attendanceStatus.slice(1)}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full">
                                    <button 
                                        type="button"
                                        onClick={() => markAttendance('present')}
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                        {loading ? 'Marking...' : 'Present'}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => markAttendance('late')}
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                        {loading ? 'Marking...' : 'Late'}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => markAttendance('absent')}
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                        {loading ? 'Marking...' : 'Absent'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Request Leave Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center border-b pb-3">
                            <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Request Leave
                        </h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Employee:</label>
                                <div className="text-lg font-semibold text-indigo-700 bg-indigo-50 p-3 rounded-lg border border-indigo-200 flex items-center">
                                    {currentUser.image ? (
                                        <img src={currentUser.image} alt="Employee" className="w-8 h-8 rounded-full mr-2" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 mr-2">
                                            {currentUser.firstName?.charAt(0)}
                                        </div>
                                    )}
                                    {currentUser.firstName} {currentUser.lastName}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Start Date:</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">End Date:</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Reason:</label>
                                <textarea
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    rows="3"
                                    placeholder="Please provide your leave reason..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Submit Request
                            </button>
                        </form>
                    </div>
                </div>

                {/* Leave History Section */}
                <div className="mt-8 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center border-b pb-3">
                        <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Leave History
                    </h2>

                    {leaveLoading ? (
                        <div className="flex justify-center items-center my-6">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : leaveHistory.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="mt-2">No leave history found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto -mx-4 sm:-mx-0">
                            <div className="inline-block min-w-full align-middle">
                                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4">Start Date</th>
                                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4">End Date</th>
                                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4 hidden sm:table-cell">Reason</th>
                                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {leaveHistory.map((leave) => (
                                                <tr key={leave.id} className="hover:bg-gray-50">
                                                    <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700 sm:px-4 sm:py-4">{formatDate(leave.startDate)}</td>
                                                    <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700 sm:px-4 sm:py-4">{formatDate(leave.endDate)}</td>
                                                    <td className="px-3 py-3 text-xs sm:text-sm text-gray-700 max-w-xs truncate hidden sm:table-cell sm:px-4 sm:py-4">{leave.reason}</td>
                                                    <td className="px-3 py-3 whitespace-nowrap sm:px-4 sm:py-4">
                                                        <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(leave.status)}`}>
                                                            {leave.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;