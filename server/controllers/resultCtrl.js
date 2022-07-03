const mongoose = require('mongoose');
const { Result } = require('./../models/Result');

const resultCtrl = {
  getResultByQuiz: async (req, res) => {
    try {
      const submissions = await Result.aggregate([
        {
          $match: { quiz: mongoose.Types.ObjectId(req.params.id) },
        },
        {
          $lookup: {
            from: 'users',
            let: { student_id: '$student' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$student_id'] } } },
              { $project: { name: 1 } },
            ],
            as: 'student',
          },
        },
        { $unwind: '$student' },
        {
          $lookup: {
            from: 'quizzes',
            let: { quiz_id: '$quiz' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$quiz_id'] } } },
              { $project: { questions: 1, title: 1, class: 1 } },
              {
                $lookup: {
                  from: 'classes',
                  let: { class_id: '$class' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$class_id'] } } },
                    { $project: { name: 1, people: 1 } },
                  ],
                  as: 'class',
                },
              },
              { $unwind: '$class' },
            ],
            as: 'quiz',
          },
        },
        { $unwind: '$quiz' },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: '$quiz._id',
            quizName: { $first: '$quiz.title' },
            questions: { $first: '$quiz.questions' },
            class: { $first: '$quiz.class' },
            results: { $push: '$$ROOT' },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            quizName: 1,
            class: 1,
            count: 1,
            questions: 1,
            results: {
              student: 1,
              answer: 1,
              score: 1,
              createdAt: 1,
            },
          },
        },
      ]);

      return res.status(200).json({ submissions: submissions[0] });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = resultCtrl;
