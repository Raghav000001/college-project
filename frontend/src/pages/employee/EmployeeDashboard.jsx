import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [stDate, setStDate] = useState();
  const [enDate, setEnDate] = useState();
  const [reason, setReason] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeeData = localStorage.getItem("employeeData");
        if (employeeData) {
          const parsedData = JSON.parse(employeeData);
          setCurrentUser(parsedData);
          console.log(parsedData);
          // Check if attendance already marked for today
          checkTodayAttendance(parsedData._id);
          // Fetch leave history
          fetchLeaveHistory(parsedData._id);
        } else {
          alert("No employee data found");
          navigate("/employee/login");
        }
      } catch (error) {
        console.log(error, "error while fetching employees");
        throw error;
      }
    };
    fetchEmployees();
  }, [navigate]);

  // Check if attendance is already marked for today
  const checkTodayAttendance = async (employeeId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/employee-attendance/${employeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const today = new Date().toISOString().split("T")[0];

        // Find if there's an attendance record for today
        console.log(response);
        console.log(data);
        const todayAttendance = data.data.find(
          (record) => record.date === today
        );
        console.log(todayAttendance);

        if (todayAttendance) {
          setAttendanceStatus(todayAttendance.status);
          setMessage({
            text: `You have already marked your attendance as ${todayAttendance.status} today.`,
            type: "info",
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
        type: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/mark-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: currentUser._id,
          status: status,
          date: attendanceDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAttendanceStatus(status);
        setMessage({
          text: "Attendance marked successfully!",
          type: "success",
        });
      } else {
        setMessage({
          text: data.message || "Failed to mark attendance",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setMessage({
        text: "An error occurred while marking attendance",
        type: "error",
      });
    } finally {
      setLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setAttendanceDate(today);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("employeeData");
    navigate("/employee/login");
  };

  const handleRequestLeave = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!stDate || !enDate || !reason) {
      setMessage({
        text: "Please fill all the required fields",
        type: "error",
      });
      return;
    }

    // Calculate duration in days
    const start = new Date(stDate);
    const end = new Date(enDate);
    const durationInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Check if dates are valid
    if (start > end) {
      setMessage({
        text: "End date cannot be before start date",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/leave-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: currentUser._id,
          employeeName: `${currentUser.firstName} ${
            currentUser.lastName || ""
          }`,
          leaveType: "Personal Leave", // You can add a dropdown for different leave types
          startDate: stDate,
          endDate: enDate,
          duration: durationInDays,
          reason: reason,
          status: "pending",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          text: "Leave Request Submitted Successfully",
          type: "success",
        });
        // Reset form fields
        setStDate("");
        setEnDate("");
        setReason("");
      } else {
        setMessage({
          text: data.message || "Failed to submit leave request",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting leave:", error);
      setMessage({
        text: "An error occurred while submitting leave request",
        type: "error",
      });
    } finally {
      setLoading(false);
      fetchLeaveHistory(currentUser._id);
    }
  };

  const fetchLeaveHistory = async (employeeId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/leave-requests/employee/${employeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLeaveHistory(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching leave history:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header with user info and logout */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentUser.image ? (
                <img
                  src={currentUser.image}
                  alt="User avatar"
                  className="w-10 h-10 rounded-full border-2 border-blue-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full border-2 border-blue-500 bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  {currentUser.firstName?.charAt(0)}
                  {currentUser.lastName?.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-800">
                  {currentUser.firstName}
                </h3>
                <p className="text-sm text-gray-500">{currentUser.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
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

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border-green-300"
                : message.type === "error"
                ? "bg-red-100 text-red-800 border-red-300"
                : message.type === "warning"
                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                : "bg-blue-100 text-blue-800 border-blue-300"
            } border`}
          >
            {message.text}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mark Attendance Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Mark Your Attendance
            </h2>
            <div className="space-y-4">
              {/* Add date selector for attendance */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Today's Date:
                </label>
                <input
                  type="date"
                  value={attendanceDate}
                  readOnly
                  disabled
                  className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 text-gray-700"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  {" "}
                  Employee:
                </label>
                <h2 className="text-lg font-semibold text-indigo-700 bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                  {" "}
                  {currentUser.firstName}{" "}
                </h2>
              </div>

              {attendanceStatus ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="text-blue-800">
                    Your attendance status for today:{" "}
                  </p>
                  <p
                    className={`text-lg font-bold mt-2 ${
                      attendanceStatus === "present"
                        ? "text-green-600"
                        : attendanceStatus === "late"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {attendanceStatus.charAt(0).toUpperCase() +
                      attendanceStatus.slice(1)}
                  </p>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => markAttendance("present")}
                    disabled={loading}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Marking..." : "Present"}
                  </button>
                  <button
                    type="button"
                    onClick={() => markAttendance("late")}
                    disabled={loading}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Marking..." : "Late"}
                  </button>
                  <button
                    type="button"
                    onClick={() => markAttendance("absent")}
                    disabled={loading}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Marking..." : "Absent"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Request Leave Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Request Leave
            </h2>
            <form className="space-y-4" onSubmit={handleRequestLeave}>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Employee:
                </label>
                <h2 className="text-lg font-semibold text-indigo-700 bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                  {currentUser.firstName}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => setStDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    End Date:
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => setEnDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Reason:
                </label>
                <textarea
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Please provide your leave reason..."
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Submit Leave Request
              </button>
            </form>
          </div>
        </div>

        {/* Leave History Section - Keeping this section, removed Attendance History */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Your Leave History
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Start Date</th>
                  <th className="py-3 px-6 text-left">End Date</th>
                  <th className="py-3 px-6 text-left">Reason</th>
                  <th className="py-3 px-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {leaveHistory.length > 0 ? (
                  leaveHistory.map((leave) => (
                    <tr
                      key={leave._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-6 text-left">
                        {new Date(leave.startDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-6 text-left">{leave.reason}</td>
                      <td className="py-3 px-6 text-left">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            leave.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : leave.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {leave.status.charAt(0).toUpperCase() +
                            leave.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b border-gray-200">
                    <td
                      colSpan="4"
                      className="py-3 px-6 text-center text-gray-500"
                    >
                      No leave history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;