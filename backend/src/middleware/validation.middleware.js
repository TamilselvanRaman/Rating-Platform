const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    const parsedData = schema.parse(req.body);
    req.body = parsedData; // Replace body with parsed (and strictly typed) data
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', '),
        errors: error.errors,
      });
    }
    next(error);
  }
};

// Validation Schemas

// Password validation regex: at least 8 chars, 1 uppercase, 1 special char
const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(100, { message: 'Password must be at most 100 characters long' }) // Increased from 16
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' });

const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' }) // Reduced from 20
    .max(60, { message: 'Name must be at most 60 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: passwordSchema,
  address: z.string().max(400, { message: 'Address must be at most 400 characters long' }).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const createUserSchema = z.object({
  name: z.string().min(2).max(60), // Reduced from 20
  email: z.string().email(),
  password: passwordSchema,
  address: z.string().max(400).optional(),
  role: z.enum(['ADMIN', 'USER', 'STORE_OWNER']).optional(),
});

const createStoreSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().max(400).optional(),
  ownerId: z.string().uuid(),
});

const ratingSchema = z.object({
  storeId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: passwordSchema,
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  createUserSchema,
  createStoreSchema,
  ratingSchema,
  updatePasswordSchema,
};
