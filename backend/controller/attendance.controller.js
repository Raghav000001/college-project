import { getConnection } from "../db/db.js";
import { ObjectId } from "mongodb";

export const markAttendance = async (req, res) => {
    try {
        const { employeeId, status, date } = req.body;
        
        if (!employeeId || !status) {
            return res.status(400).json({
                success: false,
                message: "Employee ID and attendance status are required"
            });
        }
        
        // Validate status value
        if (!['present', 'absent', 'late'].includes(status.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: "Status must be 'present', 'absent', or 'late'"
            });
        }
        
        // Validate ObjectId format
        if (!ObjectId.isValid(employeeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID format"
            });
        }
        
        // Get today's date (YYYY-MM-DD format) if not provided
        const attendanceDate = date || new Date().toISOString().split('T')[0];
        
        // Connect to collections
        const attendanceCollection = await getConnection("attendance");
        const employeeCollection = await getConnection("employee");
        
        // Verify employee exists
        const employee = await employeeCollection.findOne({ 
            _id: new ObjectId(employeeId) 
        });
        
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }
        
        // Check if attendance already marked for today
        const existingAttendance = await attendanceCollection.findOne({
            employeeId: new ObjectId(employeeId),
            date: attendanceDate
        });
        
        if (existingAttendance) {
            // Update existing attendance
            const result = await attendanceCollection.updateOne(
                { _id: existingAttendance._id },
                { 
                    $set: { 
                        status: status.toLowerCase(),
                        updatedAt: new Date()
                    } 
                }
            );
            
            return res.status(200).json({
                success: true,
                message: "Attendance updated successfully",
                data: result
            });
        }
        
        // Create new attendance record
        const attendanceData = {
            employeeId: new ObjectId(employeeId),
            employeeName: `${employee.firstName} ${employee.lastName}`,
            status: status.toLowerCase(),
            date: attendanceDate,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await attendanceCollection.insertOne(attendanceData);
        
        res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            data: result
        });
        
    } catch (error) {
        console.log(error, "Error in mark attendance function");
        res.status(500).json({
            success: false,
            message: "Failed to mark attendance",
            error: error.message
        });
    }
}

//  attendance history for an employee
export const getEmployeeAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Employee ID is required"
            });
        }
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID format"
            });
        }
        
        const attendanceCollection = await getConnection("attendance");
        
        const attendance = await attendanceCollection.find({
            employeeId: new ObjectId(id)
        }).sort({ date: -1 }).toArray();
        
        res.status(200).json({
            success: true,
            data: attendance
        });
        
    } catch (error) {
        console.log(error, "Error in get employee attendance function");
        res.status(500).json({
            success: false,
            message: "Failed to retrieve attendance records",
            error: error.message
        });
    }
}

// Get all attendance records (for admin)
export const getAllAttendance = async (req, res) => {
    try {
        const attendanceCollection = await getConnection("attendance");
        
        // Optional query parameters for filtering
        const { month, year } = req.query;
        
        let query = {};
        
        // If month and year are provided, filter by date
        if (month && year) {
            // Create date range for the specified month and year
            const startDate = `${year}-${month.padStart(2, '0')}-01`;
            const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
            const endDate = `${year}-${month.padStart(2, '0')}-${lastDay}`;
            
            query.date = { $gte: startDate, $lte: endDate };
        }
        
        const attendance = await attendanceCollection.find(query)
            .sort({ date: -1 })
            .toArray();
        
        res.status(200).json({
            success: true,
            data: attendance
        });
        
    } catch (error) {
        console.log(error, "Error in get all attendance function");
        res.status(500).json({
            success: false,
            message: "Failed to retrieve attendance records",
            error: error.message
        });
    }
}