const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');

const getAllUsers = async (filters) => {
  const { name, email, role, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
  const skip = (page - 1) * limit;

  const where = {};
  if (name) where.name = { contains: name, mode: 'insensitive' };
  if (email) where.email = { contains: email, mode: 'insensitive' };
  if (role) where.role = role.toUpperCase();

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
        createdAt: true,
        _count: {
          select: { stores: true, ratings: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      stores: true,
      ratings: {
        include: { store: { select: { name: true } } },
      },
    },
  });

  if (!user) throw new Error('User not found');

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const createUser = async (userData) => {
  const { name, email, password, address, role } = userData;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      address,
      role: role || 'USER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      address: true,
      createdAt: true,
    },
  });

  return user;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
