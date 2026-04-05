const Record = require('../model/Record');
const User = require('../model/User');
const mongoose = require("mongoose");


// CREATE RECORD
exports.createRecord = async (req, res) => {
    try {
        // Use the user ID from the authenticated request
        const createdBy = req.user.id;

        const record = await Record.create({ ...req.body, createdBy });

        return res.status(201).json({
            success: true,
            message: "Record created successfully",
            record
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};



// VIEW ALL RECORDS
exports.viewRecord = async (req, res) => {
    try {
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 10;
        const skip=(page-1)*limit;
        const records = await Record.find()
        .skip(skip)
        .limit(limit)
        .sort({createAt:-1});
        const totalRecords=await Record.countDocuments();
        return res.status(200).json({
            success: true,
            page,
            limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            records
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};



// VIEW SPECIFIC RECORD
exports.viewSpecificRecord = async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid record ID"
            });
        }

        const record = await Record.findById(id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Record fetched successfully",
            record
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};



// DELETE RECORD
exports.deleteRecord = async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid record ID"
            });
        }

        const record = await Record.findByIdAndDelete(id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Record deleted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};



// UPDATE RECORD (PATCH)
exports.updateRecordPartial = async (req, res) => {
    try {

        const { id } = req.params;

        // Validate record ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid record ID"
            });
        }

        const allowedFields = ["amount", "type", "category", "date", "notes"];
        const updateData = {};

        // Pick only allowed fields
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        // If nothing to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided to update"
            });
        }

        const updatedRecord = await Record.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedRecord) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Record updated successfully",
            updatedRecord
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

exports.viewFilterRecord = async (req, res) => {
    try {

        const { type, category, date } = req.query;

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        if (type) {
            filter.type = type;
        }

        if (category) {
            filter.category = category;
        }

        if (date) {
            filter.date = date;
        }

        const totalRecords = await Record.countDocuments(filter);

        const records = await Record.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            message: "Records fetched successfully",
            page,
            limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            records
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};