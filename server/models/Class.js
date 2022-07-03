const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
    restrict: {
      type: Boolean,
      default: false,
    },
    quizzes: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'quiz',
      },
    ],
    people: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model('class', classSchema);
module.exports = { Class };
