const { Reaction, Comment } = require('../../database/models');
const { ActivityLog } = require('../../database/models');
const activityLogger = require('../../database/middleware/activityLogger');

class ReactionService {
  // Add or update a reaction
  async toggleReaction(userId, data) {
    const { targetType, targetId, type } = data;

    // Check if reaction already exists
    const existingReaction = await Reaction.findOne({
      user: userId,
      targetType,
      targetId,
      type,
    });

    if (existingReaction) {
      // Remove reaction
      await existingReaction.deleteOne();
      await this.updateReactionCounts(targetType, targetId, type, -1);
      return { added: false, reaction: null };
    } else {
      // Check if user has a different reaction on the same target
      const otherReaction = await Reaction.findOne({
        user: userId,
        targetType,
        targetId,
        type: { $ne: type },
      });

      if (otherReaction) {
        // Replace existing reaction
        await otherReaction.deleteOne();
        await this.updateReactionCounts(targetType, targetId, otherReaction.type, -1);
      }

      // Add new reaction
      const reaction = await Reaction.create({
        user: userId,
        targetType,
        targetId,
        type,
      });

      await this.updateReactionCounts(targetType, targetId, type, 1);

      // Log activity
      await activityLogger.logActivity({
        user: userId,
        activityType: 'reaction_added',
        action: `واکنش ${this.getReactionLabel(type)} اضافه شد`,
        targetType,
        targetId,
        metadata: { reactionType: type },
        pointsEarned: 1,
      });

      return { added: true, reaction };
    }
  }

  // Get reactions for a target
  async getReactions(targetType, targetId) {
    const reactions = await Reaction.find({
      targetType,
      targetId,
    })
      .populate('user', 'username displayName avatar')
      .sort({ createdAt: -1 });

    // Group by type
    const grouped = {
      like: reactions.filter((r) => r.type === 'like'),
      fire: reactions.filter((r) => r.type === 'fire'),
      suspicious: reactions.filter((r) => r.type === 'suspicious'),
      funny: reactions.filter((r) => r.type === 'funny'),
    };

    return {
      reactions: grouped,
      counts: {
        like: grouped.like.length,
        fire: grouped.fire.length,
        suspicious: grouped.suspicious.length,
        funny: grouped.funny.length,
      },
      total: reactions.length,
    };
  }

  // Get user's reaction for a target
  async getUserReaction(userId, targetType, targetId) {
    return await Reaction.findOne({
      user: userId,
      targetType,
      targetId,
    });
  }

  // Update reaction counts (for comments)
  async updateReactionCounts(targetType, targetId, reactionType, delta) {
    if (targetType === 'comment') {
      const updateField = `reactionCounts.${reactionType}`;
      await Comment.findByIdAndUpdate(targetId, {
        $inc: { [updateField]: delta },
      });
    }
  }

  // Get reaction label in Persian
  getReactionLabel(type) {
    const labels = {
      like: 'لایک',
      fire: 'داغ',
      suspicious: 'مشکوک',
      funny: 'خنده‌دار',
    };
    return labels[type] || type;
  }
}

module.exports = new ReactionService();

