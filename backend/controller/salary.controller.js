import { getConnection } from "../db/db.js";
import { ObjectId } from "mongodb";

export const manageSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, amount, reason, date } = req.body;

        // Validate inputs
        if (!id || !type || !amount) {
            return res.status(400).json({
                success: false,
                message: "Employee ID, adjustment type, and amount are required"
            });
        }

        // Validate amount is a positive number
        const adjustmentAmount = parseFloat(amount);
        if (isNaN(adjustmentAmount) || adjustmentAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a positive number"
            });
        }

        // Validate type is either 'bonus' or 'deduction'
        if (type !== 'bonus' && type !== 'deduction') {
            return res.status(400).json({
                success: false,
                message: "Type must be either 'bonus' or 'deduction'"
            });
        }

        // Validate employee ID format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID format"
            });
        }

        // Get employee collection
        const employeeCollection = await getConnection("employee");

        // Check if employee exists
        const employee = await employeeCollection.findOne({ _id: new ObjectId(id) });
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        // Create adjustment object
        const adjustmentData = {
            amount: adjustmentAmount,
            reason: reason || "",
            date: date || new Date().toISOString(),
            createdAt: new Date()
        };

        // Update employee document based on adjustment type
        let updateResult;
        if (type === 'bonus') {
            // Add to bonuses array
            updateResult = await employeeCollection.updateOne(
                { _id: new ObjectId(id) },
                { 
                    $push: { bonuses: adjustmentData },
                    $set: { updatedAt: new Date() }
                }
            );
        } else {
            // Add to deductions array
            updateResult = await employeeCollection.updateOne(
                { _id: new ObjectId(id) },
                { 
                    $push: { deductions: adjustmentData },
                    $set: { updatedAt: new Date() }
                }
            );
        }

        if (updateResult.modifiedCount === 0) {
            return res.status(500).json({
                success: false,
                message: "Failed to update employee salary"
            });
        }

        // Get updated employee data
        const updatedEmployee = await employeeCollection.findOne({ _id: new ObjectId(id) });

        return res.status(200).json({
            success: true,
            message: `Salary ${type} applied successfully`,
            data: updatedEmployee
        });

    } catch (error) {
        console.error(`Error in manageSalary: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};