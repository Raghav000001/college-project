import React from 'react'
import { createBrowserRouter,createRoutesFromElements,RouterProvider,Route } from 'react-router-dom'
import { SignUp } from './pages/SignUp'
import AdminDashboard from './pages/admin/AdminDashboard'
import Login from './pages/Login'
import Home from './pages/Home'
import Queries from './pages/admin/Queries'
import EmployeeDetailsPage from './pages/admin/EmployeeDetailsPage'
import EmployeeLogin from './pages/employee/Login'
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import EmployeeRatings from './pages/admin/EmployeeRatings'
import AttendanceManagement from './pages/admin/AttendanceManagement'
import AddEmployee from './pages/admin/addemployee'
import SalaryManagementPage from './pages/admin/ManageSalaries'

function App() {
   const routes=createBrowserRouter(createRoutesFromElements(
    <Route>
      {/* //common routes */}
      <Route index element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>

      {/* //employee routes */}
      <Route path='/employee/login' element={<EmployeeLogin/>}/>
      <Route path='/employee/dashboard' element={<EmployeeDashboard/>}/>
 
      {/* //admin routes */}
      <Route path='/admin/employees' element={<AddEmployee/>}/>
      <Route path='/sign-up' element={<SignUp/>}/>
      <Route path='/admin/ratings' element={<EmployeeRatings/>}/>
      <Route path="/employee/:id" element={<EmployeeDetailsPage />} /> 
      <Route path="/admin/attendance" element={<AttendanceManagement/>} /> 
       <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
       <Route path='/admin/queries' element={< Queries/>}/>
       <Route path='/admin/salary' element={< SalaryManagementPage/>}/>
    </Route>
   ))


  return (
    <div>
      <RouterProvider router={routes}/>
    </div>
  )
}

export default App