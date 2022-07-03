const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
    quiz: {
      type: mongoose.Types.ObjectId,
      ref: 'quiz',
    },
    answer: {
      type: Object,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Result = mongoose.model('result', resultSchema);
module.exports = { Result };
