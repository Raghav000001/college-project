import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';

function SalaryManagementPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salaryStats, setSalaryStats] = useState({
    totalSalary: 0,
    averageSalary: 0,
    employeeCount: 0
  });
  
  // For bonus/deduction modal
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [adjustmentType, setAdjustmentType] = useState('bonus');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/show-employees', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add temporary fields for bonuses and deductions
      const employeesWithAdjustments = data.map(emp => ({
        ...emp,
        bonuses: emp.bonuses || [],
        deductions: emp.deductions || [],
        salary: emp.salary ? parseFloat(emp.salary) : 0
      }));
      
      setEmployees(employeesWithAdjustments);
      calculateSalaryStats(employeesWithAdjustments);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError(`Failed to load employees: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateSalaryStats = (employeeData) => {
    const validEmployees = employeeData.filter(emp => emp.salary && !isNaN(parseFloat(emp.salary)));
    const count = validEmployees.length;
    
    if (count === 0) {
      setSalaryStats({
        totalSalary: 0,
        averageSalary: 0,
        employeeCount: 0
      });
      return;
    }
    
    const total = validEmployees.reduce((sum, emp) => {
      const baseSalary = parseFloat(emp.salary) || 0;
      const bonusTotal = (emp.bonuses || []).reduce((sum, bonus) => sum + parseFloat(bonus.amount || 0), 0);
      const deductionTotal = (emp.deductions || []).reduce((sum, deduction) => sum + parseFloat(deduction.amount || 0), 0);
      return sum + baseSalary + bonusTotal - deductionTotal;
    }, 0);
    
    setSalaryStats({
      totalSalary: total,
      averageSalary: total / count,
      employeeCount: count
    });
  };

  const openAdjustmentModal = (employee, type) => {
    setSelectedEmployee(employee);
    setAdjustmentType(type);
    setAdjustmentAmount('');
    setAdjustmentReason('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const handleAdjustmentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || !adjustmentAmount || isNaN(parseFloat(adjustmentAmount)) || parseFloat(adjustmentAmount) <= 0) {
      return;
    }
    const amount = parseFloat(adjustmentAmount);
    try {
      const response = await fetch(`http://localhost:3000/employee/${selectedEmployee._id}/adjustment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: adjustmentType,
          amount,
          reason: adjustmentReason,
          date: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Refresh employee data after update
      await fetchEmployees();
      
      closeModal();
    } catch (error) {
      console.error("Error applying adjustment:", error);
      setError(`Failed to apply ${adjustmentType}: ${error.message}`);
    }
  };


  const calculateTotalCompensation = (employee) => {
    const baseSalary = parseFloat(employee.salary) || 0;
    const bonusTotal = (employee.bonuses || []).reduce((sum, bonus) => sum + parseFloat(bonus.amount || 0), 0);
    const deductionTotal = (employee.deductions || []).reduce((sum, deduction) => sum + parseFloat(deduction.amount || 0), 0);
    
    return baseSalary + bonusTotal - deductionTotal;
  };

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
          <h1 className="text-3xl font-bold text-gray-800">Salary Management</h1>
        </div>
        
        {/* Salary Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Monthly Payroll</h3>
            <p className="text-3xl font-bold text-blue-600">${salaryStats.totalSalary.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">For {salaryStats.employeeCount} employees</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Salary</h3>
            <p className="text-3xl font-bold text-green-600">${salaryStats.averageSalary.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            <p className="text-sm text-gray-500 mt-1">Per employee</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Headcount</h3>
            <p className="text-3xl font-bold text-purple-600">{salaryStats.employeeCount}</p>
            <p className="text-sm text-gray-500 mt-1">Active employees</p>
          </div>
        </div>
        
        {/* Employee Salary Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Employee Salaries</h2>
            <p className="text-sm text-gray-500 mt-1">Manage base salaries, bonuses, and deductions</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Salary
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bonuses
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deductions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Compensation
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => {
                  const bonusTotal = (employee.bonuses || []).reduce((sum, bonus) => sum + parseFloat(bonus.amount || 0), 0);
                  const deductionTotal = (employee.deductions || []).reduce((sum, deduction) => sum + parseFloat(deduction.amount || 0), 0);
                  
                  return (
                    <tr key={employee._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            {employee.profileImage ? (
                              <img src={employee.profileImage} alt={`${employee.firstName} ${employee.lastName}`} className="h-10 w-10 rounded-full" />
                            ) : (
                              <span>{employee.firstName?.[0]}{employee.lastName?.[0]}</span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.position}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${parseFloat(employee.salary || 0).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-green-600 font-medium">
                          +${bonusTotal.toLocaleString()}
                        </span>
                        {employee.bonuses && employee.bonuses.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            ({employee.bonuses.length} {employee.bonuses.length === 1 ? 'bonus' : 'bonuses'})
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-red-600 font-medium">
                          -${deductionTotal.toLocaleString()}
                        </span>
                        {employee.deductions && employee.deductions.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            ({employee.deductions.length} {employee.deductions.length === 1 ? 'deduction' : 'deductions'})
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${calculateTotalCompensation(employee).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openAdjustmentModal(employee, 'bonus')}
                            className="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded"
                          >
                            + Bonus
                          </button>
                          <button
                            onClick={() => openAdjustmentModal(employee, 'deduction')}
                            className="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded"
                          >
                            - Deduction
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Bonus/Deduction Modal */}
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {adjustmentType === 'bonus' ? 'Add Bonus' : 'Add Deduction'} for {selectedEmployee.firstName} {selectedEmployee.lastName}
              </h3>
            </div>
            
            <form onSubmit={handleAdjustmentSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    value={adjustmentAmount}
                    onChange={(e) => setAdjustmentAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <textarea
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={adjustmentType === 'bonus' ? "Performance bonus, holiday bonus, etc." : "Absence, advance payment, etc."}
                    required
                  ></textarea>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    adjustmentType === 'bonus' 
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  }`}
                >
                  {adjustmentType === 'bonus' ? 'Add Bonus' : 'Apply Deduction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalaryManagementPage;