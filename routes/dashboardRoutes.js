const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { getSummary, getCategorySummary, getRecentActivity, getMonthlyTrends } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const dashboardLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests. Please try again later"
    }
});

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard endpoints for financial records
 */

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get total income, total expense, and net balance
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               totalIncome: 5000
 *               totalExpense: 2000
 *               netBalance: 3000
 *       500:
 *         description: Server error
 */
router.get('/summary', authMiddleware, dashboardLimiter, getSummary);

/**
 * @swagger
 * /dashboard/categorySummary:
 *   get:
 *     summary: Get category-wise total amounts (admin & analyst only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page (default 5)
 *     responses:
 *       200:
 *         description: Category summary fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               page: 1
 *               limit: 5
 *               summary:
 *                 - _id: "Salary"
 *                   totalAmount: 3000
 *                 - _id: "Food"
 *                   totalAmount: 500
 *       500:
 *         description: Server error
 */
router.get('/categorySummary', authMiddleware, roleMiddleware(["admin","analyst"]), dashboardLimiter, getCategorySummary);

/**
 * @swagger
 * /dashboard/recentActivity:
 *   get:
 *     summary: Get recent records (admin & analyst only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page (default 10)
 *     responses:
 *       200:
 *         description: Recent activity fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               page: 1
 *               limit: 10
 *               totalRecords: 50
 *               totalPages: 5
 *               records:
 *                 - _id: "643f2f1a..."
 *                   type: "income"
 *                   category: "Salary"
 *                   amount: 3000
 *                   date: "2026-04-01"
 *                   createdBy:
 *                     name: "Admin User"
 *                     email: "admin@test.com"
 *                 - _id: "643f2f1b..."
 *                   type: "expense"
 *                   category: "Food"
 *                   amount: 500
 *                   date: "2026-04-02"
 *                   createdBy:
 *                     name: "Admin User"
 *                     email: "admin@test.com"
 *       500:
 *         description: Server error
 */
router.get('/recentActivity', authMiddleware, roleMiddleware(["admin","analyst"]), dashboardLimiter, getRecentActivity);

/**
 * @swagger
 * /dashboard/monthlyTrends:
 *   get:
 *     summary: Get monthly income, expense, and net balance trends (admin & analyst only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly trends fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               trends:
 *                 - month: "2026-01"
 *                   totalIncome: 5000
 *                   totalExpense: 2000
 *                   netBalance: 3000
 *                 - month: "2026-02"
 *                   totalIncome: 4000
 *                   totalExpense: 2500
 *                   netBalance: 1500
 *       500:
 *         description: Server error
 */
router.get('/monthlyTrends', authMiddleware, roleMiddleware(["admin","analyst"]), dashboardLimiter, getMonthlyTrends);

module.exports = router;