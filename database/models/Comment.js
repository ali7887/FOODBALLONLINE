const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: ['player', 'rumor'],
      required: true,
      index: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    reactionCounts: {
      like: { type: Number, default: 0 },
      fire: { type: Number, default: 0 },
      suspicious: { type: Number, default: 0 },
      funny: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
commentSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

// Virtual for reaction total
commentSchema.virtual('totalReactions').get(function () {
  return (
    this.reactionCounts.like +
    this.reactionCounts.fire +
    this.reactionCounts.suspicious +
    this.reactionCounts.funny
  );
});

commentSchema.set('toJSON', { virtuals: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

