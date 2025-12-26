const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { protect } = require('../middlewares/auth.middleware');

// All routes require authentication
router.post('/', protect, commentController.createComment);
router.get('/', commentController.getComments);
router.delete('/:id', protect, commentController.deleteComment);

module.exports = router;

