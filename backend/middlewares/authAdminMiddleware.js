const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const TokenBlacklist = require('../models/TokenBlacklist');
const { errorResponse,successResponse } = require('../helpers/responseHelper');

const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return errorResponse(res, 'Access denied', {}, 403);
  }
  try {
    const checktoken = token?.split(" ")[1];
    const blacklistedToken = await TokenBlacklist.query().findOne({ token:checktoken });

    if (blacklistedToken) {
      return errorResponse(res, 'Access denied', {}, 403);
    }
    const decoded = await promisify(jwt.verify)(
      token.replace('Bearer ', ''),
      process.env.JWT_SECRET
    );
    req.admin = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid token', {}, 401);
  }
};

module.exports = { verifyToken};
