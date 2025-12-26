const reactionService = require('../services/reaction.service');
const asyncHandler = require('../middlewares/asyncHandler');
const { successResponse, errorResponse } = require('../utils/response');

// Toggle reaction (add/remove)
exports.toggleReaction = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { targetType, targetId, type } = req.body;

  if (!targetType || !targetId || !type) {
    return errorResponse(res, 400, 'targetType، targetId و type الزامی است');
  }

  if (!['like', 'fire', 'suspicious', 'funny'].includes(type)) {
    return errorResponse(res, 400, 'نوع واکنش نامعتبر است');
  }

  const result = await reactionService.toggleReaction(userId, {
    targetType,
    targetId,
    type,
  });

  successResponse(res, 200, result.added ? 'واکنش اضافه شد' : 'واکنش حذف شد', result);
});

// Get reactions for a target
exports.getReactions = asyncHandler(async (req, res) => {
  const { targetType, targetId } = req.query;

  if (!targetType || !targetId) {
    return errorResponse(res, 400, 'targetType و targetId الزامی است');
  }

  const result = await reactionService.getReactions(targetType, targetId);

  successResponse(res, 200, 'واکنش‌ها با موفقیت دریافت شد', result);
});

// Get user's reaction for a target
exports.getUserReaction = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { targetType, targetId } = req.query;

  if (!targetType || !targetId) {
    return errorResponse(res, 400, 'targetType و targetId الزامی است');
  }

  const reaction = await reactionService.getUserReaction(userId, targetType, targetId);

  successResponse(res, 200, 'واکنش کاربر دریافت شد', { reaction });
});

