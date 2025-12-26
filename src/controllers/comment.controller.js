const commentService = require('../services/comment.service');
const asyncHandler = require('../middlewares/asyncHandler');
const { successResponse, errorResponse } = require('../utils/response');

// Create a comment
exports.createComment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const comment = await commentService.createComment(userId, req.body);

  successResponse(res, 201, 'نظر با موفقیت ثبت شد', { comment });
});

// Get comments for an entity
exports.getComments = asyncHandler(async (req, res) => {
  const { entityType, entityId } = req.query;
  const { page, limit } = req.query;

  if (!entityType || !entityId) {
    return errorResponse(res, 400, 'entityType و entityId الزامی است');
  }

  const result = await commentService.getComments(entityType, entityId, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  successResponse(res, 200, 'نظرات با موفقیت دریافت شد', result);
});

// Delete a comment
exports.deleteComment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  await commentService.deleteComment(id, userId);

  successResponse(res, 200, 'نظر با موفقیت حذف شد');
});

