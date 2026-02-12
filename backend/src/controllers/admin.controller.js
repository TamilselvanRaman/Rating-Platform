const prisma = require('../utils/prisma');
const { successResponse, errorResponse } = require('../utils/response.util');

const getDashboardStats = async (req, res, next) => {
  try {
    const [userCount, storeCount, ratingCount] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    // Breakdown of users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true,
      },
    });

    const stats = {
      totalUsers: userCount,
      totalStores: storeCount,
      totalRatings: ratingCount,
      userRoleDistribution: usersByRole.reduce((acc, curr) => {
        acc[curr.role] = curr._count.role;
        return acc;
      }, {}),
    };

    return successResponse(res, 'Dashboard stats retrieved', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
