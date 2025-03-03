const { check, validationResult } = require('express-validator');
const { errorResponse } = require('../helpers/responseHelper');

// Validation rules for Admin Login
const validateAdminLogin = [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', errors.array().map(err => ({
                field: err.path,
                message: err.msg
            })), 422); // 422: Unprocessable Entity
        }
        next(); // Continue to controller if validation passes
    }
];

module.exports = { validateAdminLogin };
