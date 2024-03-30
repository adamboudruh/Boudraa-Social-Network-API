const { Schema, model, Types } = require('mongoose');
const { reactionSchema } = require('./Reaction');


const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true
    },
    reactions: [
      reactionSchema
    ]
  },
  {
    toJSON: {
      getters: true,
      virtuals: true
    },
    id: false,
  }
);

thoughtSchema
  .virtual('reactionCount')
  // Getter
  .get(function () {
    return this.reactions.length;
  });

thoughtSchema
  .virtual('date')
  .get(function () {
    return this.createdAt.toLocaleTimeString();
  });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;
