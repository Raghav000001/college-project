import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Select } from 'antd';
import AdminHeader from './AdminHeader';
import axios from 'axios';

const { Option } = Select;

const LeavesComponent = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("pending");

  useEffect(() => {
    fetchLeaveRequests();
  }, [filterStatus]);

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
      render: (id, record, index) => {
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
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => new Date(date).toLocaleDateString(),
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
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
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
              className="bg-green-500 hover:bg-green-600 border-none"
            >
              Approve
            </Button>
            <Button
              danger
              onClick={() => handleStatusChange(record._id, "rejected")}
              className="hover:bg-red-600"
            >
              Reject
            </Button>
          </Space>
        ) : (
          <span className="text-gray-500 italic">No actions available</span>
        ),
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (leaveId, newStatus) => {
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:3000/leave-requests/update/${leaveId}`, 
        {
          method: "PUT",
          body: JSON.stringify({ status: newStatus }),
          headers: {
            "Content-Type": "application/json",
          },
        });

      if (response.status === 200) {
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
      console.error(`Error ${newStatus} leave request:`, error);
      message.error(`Failed to ${newStatus} leave request: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveRequests = async () => {
    setLoading(true);
    
    try {
      const response = await axios.get('http://localhost:3000/leave-requests/all', {
        params: {
          status: filterStatus !== 'all' ? filterStatus : undefined
        }
      });
      
      const sortedData = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
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
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Status:</span>
              <Select
                value={filterStatus}
                onChange={(value) => setFilterStatus(value)}
                className="w-32"
              >
                <Option value="all">All</Option>
                <Option value="pending">Pending</Option>
                <Option value="approved">Approved</Option>
                <Option value="rejected">Rejected</Option>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={leaveRequests}
              rowKey="_id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                className: 'pagination-centered'
              }}
              className="min-w-full"
              scroll={{ x: true }}
              locale={{ emptyText: 'No leave requests found' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeavesComponent;