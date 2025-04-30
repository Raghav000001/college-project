import { getConnection } from "../db/db.js";
import { ObjectId } from "mongodb";

export const addLeaveRequest = async (req, res) => {
  try {
    const collection = await getConnection("leaveRequests");
    const {
      employeeId,
      employeeName,
      leaveType,
      startDate,
      endDate,
      duration,
      reason,
      status,
    } = req.body;

    // Validate required fields
    if (!employeeId || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new leave request document
    const newLeaveRequest = {
      employeeId,
      employeeName,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      duration,
      reason,
      status,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newLeaveRequest);

    res.status(201).json({
      message: "Leave request submitted successfully",
      leaveRequest: { ...newLeaveRequest, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Error creating leave request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getLeaveRequest = async (req, res) => {
  try {
    const collection = await getConnection("leaveRequests");
    const { employeeId } = req.params;
    const leaveRequests = await collection
      .find({ employeeId })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      message: "Leave requests retrieved successfully",
      data: leaveRequests,
    });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getLeaveRequests = async (req, res) => {
  try {
    const collection = await getConnection("leaveRequests");
    const { startDate, endDate, status } = req.query;
    // Build filter object
    const filter = {};

    if (startDate && endDate) {
      filter.startDate = { $gte: new Date(startDate) };
      filter.endDate = { $lte: new Date(endDate) };
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    // Connect to MongoDB and find documents
    const leaveRequests = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error("Error fetching all leave requests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateLeaveRequest = async (req, res) => {
  try {
    const collection = await getConnection("leaveRequests");
    const { id } = req.params;
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    new ObjectId(id);

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    console.log(result);
    if (!result) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.status(200).json({
      message: `Leave request ${status} successfully`,
      leaveRequest: result,
    });
  } catch (error) {
    console.error("Error updating leave request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};