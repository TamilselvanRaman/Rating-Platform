const prisma = require('../utils/prisma');

const createStore = async (storeData) => {
  const { name, email, address, ownerId } = storeData;

  // Check if owner exists and is a store owner or admin (or just exists, validation handled elsewhere)
  // Check if owner already has a store? Requirement doesn't explicitly say 1 store per owner, but let's assume multiple is fine or check constraints.
  // Actually, let's just create it.

  const store = await prisma.store.create({
    data: {
      name,
      email,
      address,
      ownerId,
    },
  });

  return store;
};

const getAllStores = async (filters) => {
  const { name, address, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
  const skip = (page - 1) * limit;

  const where = {};
  if (name) where.name = { contains: name, mode: 'insensitive' };
  if (address) where.address = { contains: address, mode: 'insensitive' };

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { [sortBy]: sortOrder },
      include: {
        owner: { select: { name: true, email: true } },
        _count: { select: { ratings: true } },
      },
    }),
    prisma.store.count({ where }),
  ]);

  // Calculate average rating for each store
  const storesWithRating = await Promise.all(
    stores.map(async (store) => {
      const aggregations = await prisma.rating.aggregate({
        where: { storeId: store.id },
        _avg: { rating: true },
      });
      return {
        ...store,
        averageRating: aggregations._avg.rating || 0,
      };
    })
  );

  return {
    stores: storesWithRating,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getStoreById = async (id) => {
  const store = await prisma.store.findUnique({
    where: { id },
    include: {
      owner: { select: { name: true, email: true } },
      ratings: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!store) throw new Error('Store not found');

  const aggregations = await prisma.rating.aggregate({
    where: { storeId: id },
    _avg: { rating: true },
  });

  return {
    ...store,
    averageRating: aggregations._avg.rating || 0,
  };
};

const getMyStore = async (ownerId) => {
  const stores = await prisma.store.findMany({
    where: { ownerId },
    include: {
        ratings: {
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
        }
    }
  });
  
  // Since one user might own multiple stores, but requirement implies "My Store" (singular).
  // If multiple, we return list. If singular, we return first.
  // Let's assume one store per owner for "My Store" dashboard or return all.
  // The requirement says "View users who rated their store" - singular implies one store or aggregated.
  // I will return the list of stores owned by the user.

  const storesWithRating = await Promise.all(
    stores.map(async (store) => {
      const aggregations = await prisma.rating.aggregate({
        where: { storeId: store.id },
        _avg: { rating: true },
      });
      return {
        ...store,
        averageRating: aggregations._avg.rating || 0,
      };
    })
  );

  return storesWithRating;
};

module.exports = {
  createStore,
  getAllStores,
  getStoreById,
  getMyStore,
};
