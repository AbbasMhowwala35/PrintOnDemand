const successResponse = (res, message, data = null, statusCode = 200) => {
    res.status(statusCode).json({
        status: 1,
        message,
        data
    });
};

const errorResponse = (res, message, errors = [], statusCode = 400) => {
    res.status(statusCode).json({
        status: 0,
        message,
        errors
    });
};

module.exports = { successResponse, errorResponse };
