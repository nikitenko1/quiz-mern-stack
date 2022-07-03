const { Quiz } = require('./../models/Quiz');
const { Class } = require('./../models/Class');
const { Result } = require('./../models/Result');

const quizCtrl = {
  createQuiz: async (req, res) => {
    try {
      const { classId, title, category, questions } = req.body;

      if (!title || questions.length === 0)
        return res.status(400).json({ msg: 'Please provide every field.' });
      const newQuiz = new Quiz({
        title,
        class: classId,
        questions,
        category,
      });
      await newQuiz.save();

      await Class.findOneAndUpdate(
        { _id: classId },
        {
          $push: { quizzes: newQuiz._id },
        }
      );

      return res.status(200).json({
        msg: `Quiz with title ${title} has been created.`,
        quiz: newQuiz,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getQuizById: async (req, res) => {
    try {
      const { id } = req.params;
      const quiz = await Quiz.findById(id).populate({
        path: 'class',
        select: 'name',
        populate: {
          path: 'instructor',
          select: 'name',
        },
      });

      if (!quiz)
        return res.status(404).json({ msg: `Quiz with ID ${id} not found.` });

      return res.status(200).json({ quiz });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  udpateQuiz: async (req, res) => {
    try {
      const { title, category, questions } = req.body;

      if (!title || questions.length === 0)
        return res.status(400).json({ msg: 'Please provide every field' });

      const quiz = await Quiz.findOneAndUpdate(
        { _id: req.params.id },
        {
          title,
          questions,
          category,
        },
        { new: true }
      );

      if (!quiz)
        return res
          .status(404)
          .json({ msg: `Quiz with ID ${req.params.id} not found.` });

      return res.status(200).json({
        msg: `Quiz with ID ${req.params.id} has been updated.`,
        quiz,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteQuiz: async (req, res) => {
    try {
      const { id } = req.params;
      const findQuiz = await Quiz.findById(id);
      if (!findQuiz)
        return res.status(404).json({ msg: `Quiz with ID ${id} not found.` });

      await Class.findOneAndUpdate(
        { _id: findQuiz.class },
        // classSchema: quizzes: [ {type: mongoose.Types.ObjectId, ref: 'quiz',},]
        {
          $pull: { quizzes: id },
        }
      );

      // resultSchema: quiz: [ {type: mongoose.Types.ObjectId, ref: 'quiz',},]
      await Result.deleteMany({ quiz: id });

      await Quiz.findOneAndDelete({ _id: id });

      return res.status(200).json({
        msg: 'Quiz has been deleted.',
        quizId: id,
        classId: findQuiz.class,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  changeQuizStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const { id } = req.params;

      const quiz = await Quiz.findOneAndUpdate(
        { _id: id },
        { status },
        { new: true }
      );
      if (!quiz)
        return res.status(404).json({ msg: `Quiz with ID ${id} not found.` });

      return res.status(200).json({ quiz });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  submitQuiz: async (req, res) => {
    try {
      const { answer, quizId } = req.body;

      if (Object.keys(answer).length === 0)
        return res.status(400).json({ msg: 'Answer not completed.' });

      const quizDetail = await Quiz.findById(quizId);
      if (!quizDetail)
        return res
          .status(404)
          .json({ msg: `Quiz with ID ${quizId} not found.` });

      if (quizDetail.status === 'Close')
        return res
          .status(400)
          .json({ msg: "This quiz won't accept any submission right now." });

      let formattedQuestions = {};
      quizDetail.questions.forEach((question) => {
        formattedQuestions = {
          ...formattedQuestions,
          [question._id]: question.answer,
        };
      });

      let score = 0;
      for (let question in formattedQuestions) {
        if (formattedQuestions[question] === Number(answer[question])) {
          score++;
        }
      }

      const newResult = new Result({
        student: req.user._id,
        quiz: quizId,
        answer,
        score,
      });

      await newResult.save();

      await Quiz.findOneAndUpdate(
        { _id: quizId },
        {
          $push: { results: newResult._id },
        }
      );

      const data = {
        student: {
          _id: req.user._id,
          name: req.user.name,
        },
        answer,
        score,
        createdAt: newResult.createdAt,
      };

      return res.status(200).json({
        msg: 'Quiz has been submitted.',
        result: data,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = quizCtrl;
