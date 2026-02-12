const prisma = require('../utils/prisma');

const submitRating = async (userId, ratingData) => {
  const { storeId, rating } = ratingData;

  // Check if store exists
  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!store) {
    throw new Error('Store not found');
  }

  // Check if user has already rated this store
  // Requirements say "Submit rating (1-5)" and "Update rating"
  // If exists, we can update or throw error.
  // The unique constraint in schema handles this.
  // Let's us upsert for better UX or explicit create/update.
  // Given separate routes, let's stick to create here.

  const existingRating = await prisma.rating.findUnique({
    where: {
      userId_storeId: {
        userId,
        storeId,
      },
    },
  });

  if (existingRating) {
     throw new Error('You have already rated this store. Please update your existing rating.');
  }

  const newRating = await prisma.rating.create({
    data: {
      userId,
      storeId,
      rating,
    },
    include: {
        store: { select: { name: true } }
    }
  });

  return newRating;
};

const updateRating = async (userId, ratingId, ratingData) => {
  const { rating } = ratingData;

  const existingRating = await prisma.rating.findUnique({
    where: { id: ratingId },
  });

  if (!existingRating) {
    throw new Error('Rating not found');
  }

  if (existingRating.userId !== userId) {
    throw new Error('Not authorized to update this rating');
  }

  const updatedRating = await prisma.rating.update({
    where: { id: ratingId },
    data: { rating },
    include: {
        store: { select: { name: true } }
    }
  });

  return updatedRating;
};

const getMyRatings = async (userId) => {
  return await prisma.rating.findMany({
    where: { userId },
    include: {
      store: { select: { id: true, name: true, address: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getRatingForStore = async (userId, storeId) => {
    return await prisma.rating.findUnique({
        where: {
            userId_storeId: {
                userId,
                storeId
            }
        }
    });
};

module.exports = {
  submitRating,
  updateRating,
  getMyRatings,
  getRatingForStore
};
