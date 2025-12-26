const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ['comment', 'player', 'rumor'],
      required: true,
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['like', 'fire', 'suspicious', 'funny'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate reactions
reactionSchema.index({ user: 1, targetType: 1, targetId: 1, type: 1 }, { unique: true });

// Index for efficient queries
reactionSchema.index({ targetType: 1, targetId: 1, type: 1 });

const Reaction = mongoose.model('Reaction', reactionSchema);

module.exports = Reaction;

