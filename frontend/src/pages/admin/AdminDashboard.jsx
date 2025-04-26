import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate=useNavigate();
  const [selectedDepartments, setselectedDepartments] = useState("");
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalEmployees: employees.length,
    averageSalary:0,
    pendingHikes: 0,
    departments: 0
  });

  
  useEffect(() => {
    const  fetchData =async () => {
      try {
        const response= await fetch("http://localhost:3000/show-employees",{
          method: "GET",
          headers:{
            "Content-Type":"application/json"
          }
        })
        const data = await response.json();
        setEmployees(data);
        setStats({
          totalEmployees:data.length,
          averageSalary: 50000,
          pendingHikes: 2,
          departments: 4
        });
      } catch (error) {
        console.log(error,"error while fetching the data");
        throw error;
      }
    }
    fetchData();
  }, []);

   const handleDelete = async (id) => {
    try {
      const response= await fetch(`http://localhost:3000/delete/${id}`,{
        method: "DELETE",
        body:JSON.stringify({id}),
        headers:{
          "Content-Type":"application/json"
        }
      })
      if (response.ok) {
          setEmployees(employees.filter(employee => employee._id !== id));       
      }
    } catch (error) {
      console.log(error,"error while deleting the data"); 
    }
   }

   const handleSearch =  (e) => {
     setSearchTerm(e.target.value.toLowerCase())
    }

    const filteredEmployees= employees.filter(employee => {
      const matchesSearch=`${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm) 
      const matchesDepartment = selectedDepartments ? employee.department.toLowerCase() === selectedDepartments.toLocaleLowerCase() : true;
      return matchesSearch && matchesDepartment;
        }
    )

   useEffect(() => {
    const totalSalary = employees.reduce((sum, employee) => {
      return sum + (Number(employee.salary) || 0);
    }, 0);
    setStats((prevStats)=> {
       return {
         ...prevStats,
        averageSalary: employees ? totalSalary/employees.length : 0
       }
    })
   }, [employees])



   const handleDepartmentChnage = (e) => {
    setselectedDepartments(e.target.value);
   }
   

   
    
     
      //sort functions
      const sortByName = ()  => {
        const sorted =[...employees].sort((a,b)=> {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
           return nameA.localeCompare(nameB);
        })
        setEmployees(sorted);
      } 

      const sortBySalary=() => {
     const sorted=[...employees].sort((a,b)=>{
     return b.salary - a.salary;
   })
   setEmployees(sorted);
      }

      const sortByJoinDate=()=> {
        const sorted=[...employees].sort((a,b)=> {
          return new Date(a.joinDate) - new Date(b.joinDate);
        })
        setEmployees(sorted);
      }




  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        
        {/* Overview Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalEmployees}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Average Salary</p>
                  <p className="text-2xl font-bold text-gray-800">${stats.averageSalary.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Salary Hikes</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.pendingHikes}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Card 4 */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Departments</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.departments}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Employee Data Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Employee Data</h2>
            <button
             onClick={()=> navigate("/admin/employees")} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300">
              Add New Employee
            </button>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                onChange={handleSearch}
                type="text"
                placeholder="Search employees..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={selectedDepartments}
               onChange={handleDepartmentChnage}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Departments</option>
                <option value="engineering">Engineering</option>
                <option value="hr">Human Resources</option>
                <option value="product">Product</option>
                <option value="design">Design</option>
              </select>
              <select 
              onChange={(e)=> {
                if (e.target.value==="name") sortByName();
                if (e.target.value==="salary") sortBySalary();
                if (e.target.value==="joinDate") sortByJoinDate();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sort By</option>
                <option value="name">Name</option>
                <option value="salary">Salary</option>
                <option value="date">Join Date</option>
              </select>
            </div>
          </div>
          
          {/* Employee Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salary
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                 {
                     filteredEmployees.map((employee, index)=> {
                       return(
                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                  {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{employee.firstName} {employee.lastName}</div>
                                <div className="text-sm text-gray-500">{employee.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{employee.position}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {employee.department}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${Number(employee.salary).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(employee.joinDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                        onClick={() => navigate(`/employee/${employee._id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors duration-150">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </button>
                            <button
                             onClick={()=> handleDelete(employee._id)}
                             className="text-red-600 hover:text-red-900 transition-colors duration-150">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </td>
                        </tr>
                       )
                    })
                 }
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
                    <span className="font-medium">4</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard