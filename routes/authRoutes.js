const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {
  registerUser,
  loginUser,
  getUser,
  updateUserRole,
  updateUserStatus
} = require('../controllers/authController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later"
  }
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 example: viewer
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 */
router.post("/register", authMiddleware, roleMiddleware(["admin"]), registerUser);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@test.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: User inactive
 */
router.post("/login", authLimiter, loginUser);


/**
 * @swagger
 * /auth/getUser:
 *   get:
 *     summary: Get all users (Admin only) with pagination
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: Users fetched successfully
 */
router.get("/getUser", authMiddleware, roleMiddleware(["admin"]), getUser);


/**
 * @swagger
 * /auth/updateRole/{id}/role:
 *   patch:
 *     summary: Update user role
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [viewer, analyst, admin]
 *                 example: analyst
 *     responses:
 *       200:
 *         description: Role updated successfully
 */
router.patch("/updateRole/:id/role", authMiddleware, roleMiddleware(["admin"]), updateUserRole);


/**
 * @swagger
 * /auth/updateRole/{id}/status:
 *   patch:
 *     summary: Update user status
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: active
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.patch("/updateRole/:id/status", authMiddleware, roleMiddleware(["admin"]), updateUserStatus);


module.exports = router;