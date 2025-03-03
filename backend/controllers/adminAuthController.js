const Admin = require('../models/Admin');
const TokenBlacklist = require('../models/TokenBlacklist');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { errorResponse,successResponse } = require('../helpers/responseHelper');

// Admin Login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await Admin.query().findOne({ email });
        if (!admin) {
            return errorResponse(res, 'Invalid credentials', {}, 401);
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return errorResponse(res, 'Invalid Password', {}, 401);
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRATION || '1h' }
        );

        // Return token in Bearer format
        return successResponse(res, 'Login successful', { token }, 200);
    } catch (error) {
        return errorResponse(res, 'Something Went Wrong', { error: error.message }, 500);
    }
};

const logout = async (req, res) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        await TokenBlacklist.query().insert({ token });
        return successResponse(res, 'Logged out successfully', {}, 200);
    } catch (err) {
        return errorResponse(res, 'Something Went Wrong', { error: error.message }, 500);
    }
  };

module.exports = {loginAdmin,logout };
