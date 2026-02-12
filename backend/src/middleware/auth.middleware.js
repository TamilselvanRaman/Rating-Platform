const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { errorResponse } = require('../utils/response.util');

const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return errorResponse(res, 'Not authorized to access this route', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        // Exclude password
      },
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Not authorized to access this route', 401, error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
       return errorResponse(res, 'User not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `User role ${req.user.role} is not authorized to access this route`,
        403
      );
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
