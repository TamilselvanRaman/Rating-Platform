const { ZodError } = require('zod');
const { Prisma } = require('@prisma/client');
const { errorResponse } = require('../utils/response.util');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Zod Validation Error
  if (err instanceof ZodError) {
    const errorMessages = err.errors.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errorMessages,
    });
  }

  // Prisma Client Known Request Error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return errorResponse(res, 'Unique constraint violation. Resource already exists.', 409);
    }
    if (err.code === 'P2025') {
      return errorResponse(res, 'Record not found.', 404);
    }
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired.', 401);
  }

  // Handle Logic Errors thrown by Services
  if (err.message === 'Email already registered') {
    return errorResponse(res, err.message, 409);
  }
  if (err.message === 'Invalid credentials') {
    return errorResponse(res, err.message, 401);
  }
  if (err.message === 'User not found') {
    return errorResponse(res, err.message, 404);
  }
  if (err.message === 'Incorrect current password') {
    return errorResponse(res, err.message, 400);
  }

  // Default Error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const fs = require('fs');
  const logMessage = `
  Time: ${new Date().toISOString()}
  Error: ${message}
  Stack: ${err.stack}
  Name: ${err.name}
  Code: ${err.code}
  --------------------------------------------------
  `;
  fs.appendFileSync('backend_error.log', logMessage);

  return errorResponse(res, message, statusCode, err);
};

module.exports = errorHandler;
