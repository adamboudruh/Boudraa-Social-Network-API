const { Schema, Types } = require('mongoose');

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
    }
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

thoughtSchema.methods.getDate = function () {
  // The 'this' keyword is used to specify the properties belonging to the particular instance
  console.log(
    `This department has the name ${this.name} and a total stock of ${this.totalStock}`
  );
};

thoughtSchema
  .virtual('friendCount')
  // Getter
  .get(function () {
    return ``;
  });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;
