const express = require('express');
const router = express.Router();
const reactionController = require('../controllers/reaction.controller');
const { protect } = require('../middlewares/auth.middleware');

// Toggle reaction requires authentication
router.post('/toggle', protect, reactionController.toggleReaction);
router.get('/', reactionController.getReactions);
router.get('/user', protect, reactionController.getUserReaction);

module.exports = router;

