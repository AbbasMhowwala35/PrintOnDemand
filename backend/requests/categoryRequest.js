const { check, validationResult } = require('express-validator');
const { errorResponse } = require('../helpers/responseHelper');

// Validation rules for Admin Login
const validateCategory = [
    check('name').notEmpty().withMessage('Category Name is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', errors.array().map(err => ({
                field: err.path,
                message: err.msg
            })), 422);
        }
        next();
    }
];

module.exports = { validateCategory };
