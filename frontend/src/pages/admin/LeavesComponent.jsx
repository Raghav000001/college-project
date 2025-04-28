import React, { useState, useEffect } from 'react';
import { Table, Button, DatePicker, Space, message, Select } from 'antd';
import moment from 'moment';
import './LeavesComponent.css';
import AdminHeader from './AdminHeader';

const { RangePicker } = DatePicker;
const { Option } = Select;

// Static data for leave requests
const staticLeaveData = [
  {
    id: 1,
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    leaveType: 'Sick Leave',
    startDate: '2023-06-10',
    endDate: '2023-06-12',
    duration: 3,
    reason: 'Medical appointment and recovery',
    status: 'pending'
  },
  {
    id: 2,
    employeeId: 'EMP002',
    employeeName: 'Jane Smith',
    leaveType: 'Vacation',
    startDate: '2025-03-30',
    endDate: '2023-06-22',
    duration: 8,
    reason: 'Family vacation',
    status: 'pending'
  },
  {
    id: 3,
    employeeId: 'EMP003',
    employeeName: 'Robert Johnson',
    leaveType: 'Personal Leave',
    startDate: '2023-06-05',
    endDate: '2023-06-07',
    duration: 3,
    reason: 'Personal matters',
    status: 'rejected'
  },
  {
    id: 4,
    employeeId: 'EMP004',
    employeeName: 'Emily Davis',
    leaveType: 'Sick Leave',
    startDate: '2025-04-18',
    endDate: '2023-06-19',
    duration: 2,
    reason: 'Fever and cold',
    status: 'pending'
  },
  {
    id: 5,
    employeeId: 'EMP005',
    employeeName: 'Michael Wilson',
    leaveType: 'Vacation',
    startDate: '2023-07-01',
    endDate: '2023-07-10',
    duration: 10,
    reason: 'Summer vacation',
    status: 'pending'
  }
];

const LeavesComponent = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    moment().subtract(30, 'days'),
    moment()
  ]);
  const [filterStatus, setFilterStatus] = useState('pending');
  console.log(dateRange)

  useEffect(() => {
    fetchLeaveRequests();
  }, [dateRange, filterStatus]);

  const fetchLeaveRequests = () => {
    setLoading(true);
    
    // Filter the static data based on date range and status
    const filteredData = staticLeaveData.filter(leave => {
      const startDate = moment(leave.startDate);
      console.log(startDate)
      const isInDateRange = startDate.isBetween(dateRange[0], dateRange[1], null, '[]');
      console.log(isInDateRange)
      const matchesStatus = filterStatus === 'all' || leave.status === filterStatus;
      console.log(matchesStatus)
      
      return isInDateRange && matchesStatus;
    });
    
    // Simulate API delay
    setTimeout(() => {
      setLeaveRequests(filteredData);
      setLoading(false);
    }, 500);
  };

  const handleStatusChange = (leaveId, newStatus) => {
    setLoading(true);
    
    // Update the status in our static data
    const updatedLeaveRequests = leaveRequests.map(leave => 
      leave.id === leaveId ? { ...leave, status: newStatus } : leave
    );
    
    // Simulate API delay
    setTimeout(() => {
      setLeaveRequests(updatedLeaveRequests);
      message.success(`Leave request ${newStatus}`);
      setLoading(false);
    }, 500);
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
    }
  };

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      key: 'leaveType',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => moment(date).format('DD-MM-YYYY')
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => moment(date).format('DD-MM-YYYY')
    },
    {
      title: 'Duration (Days)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`status-badge ${status.toLowerCase()}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        record.status === 'pending' ? (
          <Space>
            <Button 
              type="primary" 
              onClick={() => handleStatusChange(record.id, 'approved')}
            >
              Approve
            </Button>
            <Button 
              danger 
              onClick={() => handleStatusChange(record.id, 'rejected')}
            >
              Reject
            </Button>
          </Space>
        ) : (
          <span>No actions available</span>
        )
      ),
    },
  ];

  return (
    <div>
      <AdminHeader />
      <div className="leaves-container">
      <div className="leaves-header">
        <h1>Employee Leave Requests</h1>
        <div className="filter-controls">
          <Space>
            <span>Date Range:</span>
            <RangePicker 
              value={dateRange}
              onChange={handleDateRangeChange}
            />
            <span>Status:</span>
            <Select 
              value={filterStatus} 
              onChange={(value) => setFilterStatus(value)}
              style={{ width: 120 }}
            >
              <Option value="all">All</Option>
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
            <Button type="primary" onClick={fetchLeaveRequests}>
              Refresh
            </Button>
          </Space>
        </div>
      </div>
      
      <Table
        columns={columns}
        dataSource={leaveRequests}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        // scroll={{ x: 1200 }}
      />
    </div>
    </div>
  );
};

export default LeavesComponent;