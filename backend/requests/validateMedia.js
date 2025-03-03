const { check, validationResult } = require('express-validator');
const { errorResponse } = require('../helpers/responseHelper');

// Validation rules for Admin Login
const validateMedia = [
    check("title").notEmpty().withMessage("Title is required").isString(),
    check("download_limit").notEmpty().withMessage("Download limit is required").isInt().withMessage("Download limit must be an integer"),
    check("category_id").notEmpty().withMessage("Category ID is required").isInt().withMessage("Category ID must be an integer"),
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

module.exports = { validateMedia };
