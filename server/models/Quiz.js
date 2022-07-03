const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    class: {
      type: mongoose.Types.ObjectId,
      ref: 'class',
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'category',
    },
    questions: [
      {
        title: {
          type: String,
          required: true,
        },
        choice: {
          type: Array,
          required: true,
        },
        answer: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      default: 'Open',
    },
    results: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'result',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model('quiz', quizSchema);
module.exports = { Quiz };
