const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
    createRecord,
    viewRecord,
    viewSpecificRecord,
    deleteRecord,
    updateRecordPartial,
    viewFilterRecord
} = require('../controllers/recordController');

const { createRecordValidator } = require('../middleware/recordValidator');
const { updateRecordValditor } = require('../middleware/updateValidator');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const recordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests, please try later"
    },
});

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: CRUD operations for financial records
 */

/**
 * @swagger
 * /records/addRecord:
 *   post:
 *     summary: Create a new record (admin only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - category
 *               - amount
 *               - date
 *             properties:
 *               type:
 *                 type: string
 *                 example: income
 *               category:
 *                 type: string
 *                 example: Salary
 *               amount:
 *                 type: number
 *                 example: 5000
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-04-01
 *               notes:
 *                 type: string
 *                 example: Monthly salary
 *     responses:
 *       201:
 *         description: Record created successfully
 *       500:
 *         description: Server error
 */
router.post('/addRecord', authMiddleware, roleMiddleware(["admin"]), recordLimiter, createRecordValidator, validate, createRecord);

/**
 * @swagger
 * /records/allRecord:
 *   get:
 *     summary: Get all records (paginated)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Records fetched successfully
 *       500:
 *         description: Server error
 */
router.get('/allRecord', authMiddleware, viewRecord);

/**
 * @swagger
 * /records/viewSpecificRecord/{id}:
 *   get:
 *     summary: Get a specific record by ID
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record fetched successfully
 *       400:
 *         description: Invalid record ID
 *       404:
 *         description: Record not found
 */
router.get('/viewSpecificRecord/:id', authMiddleware, viewSpecificRecord);

/**
 * @swagger
 * /records/deleteRecord/{id}:
 *   delete:
 *     summary: Delete a record (admin only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       400:
 *         description: Invalid record ID
 *       404:
 *         description: Record not found
 */
router.delete('/deleteRecord/:id', authMiddleware, roleMiddleware(["admin"]), recordLimiter, deleteRecord);

/**
 * @swagger
 * /records/updateRecord/{id}:
 *   patch:
 *     summary: Update a record partially (admin only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Record ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               category:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       400:
 *         description: Invalid fields or ID
 *       404:
 *         description: Record not found
 */
router.patch('/updateRecord/:id', authMiddleware, roleMiddleware(["admin"]), recordLimiter, updateRecordValditor, validate, updateRecordPartial);

/**
 * @swagger
 * /records/filter:
 *   get:
 *     summary: Filter records by type, category, or date
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Records fetched successfully
 *       500:
 *         description: Server error
 */
router.get('/filter', authMiddleware, viewFilterRecord);

module.exports = router;

