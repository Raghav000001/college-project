import React, { useState, useEffect } from 'react';
import { Table, Button, DatePicker, Space, message, Select } from 'antd';
import moment from 'moment';
import './LeavesComponent.css';
import AdminHeader from './AdminHeader';
import axios from 'axios';

const { RangePicker } = DatePicker;
const { Option } = Select;

const LeavesComponent = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    moment().subtract(30, "days"),
    moment(),
  ]);
  const [filterStatus, setFilterStatus] = useState("pending");

  useEffect(() => {
    fetchLeaveRequests();
  }, [dateRange, filterStatus]);

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
    }
  };

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
      render: (id, record, index) => {
        // Format employee ID as EMP001, EMP002, etc.
        const formattedId = `EMP${String(index + 1).padStart(3, '0')}`;
        return formattedId;
      }
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      key: "leaveType",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => moment(date).format("DD-MM-YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => moment(date).format("DD-MM-YYYY"),
    },
    {
      title: "Duration (Days)",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={`status-badge ${status.toLowerCase()}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.status === "pending" ? (
          <Space>
            <Button
              type="primary"
              onClick={() => handleStatusChange(record._id, "approved")}
            >
              Approve
            </Button>
            <Button
              danger
              onClick={() => handleStatusChange(record._id, "rejected")}
            >
              Reject
            </Button>
          </Space>
        ) : (
          <span>No actions available</span>
        ),
    },
  ];

  const handleStatusChange = async (leaveId, newStatus) => {
    setLoading(true);
    
    try {
      // Make API request to update status
      const response = await fetch(`http://localhost:3000/leave-requests/update/${leaveId}`, 
        {
          method: "PUT",
          body: JSON.stringify({ status: newStatus }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      console.log(response)
      if (response.status === 200) {
        // Update the local state to reflect the change immediately
        setLeaveRequests(prevRequests => 
          prevRequests.map(request => 
            request._id === leaveId ? { ...request, status: newStatus } : request
          )
        );
        
        message.success(`Leave request ${newStatus} successfully`);
      } else {
        message.error(`Failed to ${newStatus} leave request`);
      }
    } catch (error) {
      console.log(error)
      console.error(`Error ${newStatus} leave request:`, error);
      message.error(`Failed to ${newStatus} leave request: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveRequests = async () => {
    setLoading(true);
    
    try {
      // Format dates for API request
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      
      // Make API request with proper status filter
      const response = await axios.get('http://localhost:3000/leave-requests/all', {
        params: {
          startDate,
          endDate,
          status: filterStatus !== 'all' ? filterStatus : undefined
        }
      });
      
      // Sort the data to ensure consistent employee ID assignment
      const sortedData = response.data.sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      );
      
      setLeaveRequests(sortedData);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      message.error('Failed to fetch leave requests: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminHeader />
      <div className="leaves-container">
        <div className="leaves-header">
          <h1>Employee Leave Requests</h1>
          <div className="filter-controls">
            <Space>
              <div className="flex gap-2 flex-col md:flex-row">
                <div className="flex items-center gap-2 flex-col sm:flex-row">
                  <span>Date Range:</span>
                  <RangePicker
                    value={dateRange}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <div className="flex items-center gap-2 flex-col sm:flex-row">
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
                </div>
                <div className="flex items-center gap-2 flex-col sm:flex-row">
                  <Button type="primary" onClick={fetchLeaveRequests}>
                    Refresh
                  </Button>
                </div>
              </div>
            </Space>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={leaveRequests}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
          locale={{ emptyText: 'No leave requests found' }}
        />
      </div>
    </div>
  );
};

export default LeavesComponent;
