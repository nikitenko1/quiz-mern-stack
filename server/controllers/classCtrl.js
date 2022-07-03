const mongoose = require('mongoose');
const { Class } = require('./../models/Class');
const { Result } = require('./../models/Result');
const { Quiz } = require('./../models/Quiz');

// .limit: total records we wanted to show from the query
// .skip: total records we wanted to skip from the query

const Pagination = (req) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 4;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const classCtrl = {
  getClassesByInstructor: async (req, res) => {
    const { limit, skip } = Pagination(req);

    try {
      const data = await Class.aggregate([
        {
          // $facet Processes multiple aggregation pipelines
          $facet: {
            totalData: [
              {
                $match: { instructor: mongoose.Types.ObjectId(req.user._id) },
              },

              {
                $lookup: {
                  from: 'quizzes',
                  // classSchema.quizzes: [ { ref: 'quiz',} ]
                  let: { quiz_id: '$quizzes' }, // Optional. Specifies the variables to use in the pipeline stages.
                  pipeline: [
                    //{ $in: [ <expression>, <array expression> ] } { $in: [ 2, [ 1, 2, 3 ] ] }  true
                    { $match: { $expr: { $in: ['$_id', '$$quiz_id'] } } },

                    { $project: { title: 1, status: 1, results: 1 } },
                  ],
                  // as: <output array field>
                  as: 'quizzes',
                },
              },
              {
                $lookup: {
                  from: 'users',
                  // classSchema.people: [ { ref: 'user',} ]
                  let: { user_id: '$people' }, // Optional. Specifies the variables to use in the pipeline stages.
                  pipeline: [
                    //{ $in: [ <expression>, <array expression> ] } { $in: [ 2, [ 1, 2, 3 ] ] }  true
                    { $match: { $expr: { $in: ['$_id', '$$user_id'] } } },
                    { $project: { avatar: 1, name: 1, email: 1 } },
                  ],
                  // as: <output array field>
                  as: 'people',
                },
              },

              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [
              { $match: { instructor: mongoose.Types.ObjectId(req.user._id) } },
              { $count: 'count' },
            ],
          },
        },
        {
          $project: {
            // Example  { $arrayElemAt: [ [ 1, 2, 3 ], 0 ] }  Results  1
            count: { $arrayElemAt: ['$totalCount.count', 0] },
            totalData: 1,
          },
        },
      ]);

      const classes = data[0].totalData;
      const classesCount = data[0].count;
      // Pagination
      let totalPage = 0;
      if (classesCount % limit === 0) {
        // 8 / 4 = 2 === 0
        totalPage = classesCount / limit;
      } else {
        // 9 / 4 >= 2.1 !== 0 // 2+1 = 3
        totalPage = Math.floor(classesCount / limit) + 1;
      }

      return res.status(200).json({
        classes,
        totalPage,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  createClass: async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name || !description)
        return res.status(400).json({ msg: 'Please provide every field.' });

      const newClass = new Class({
        name,
        description,
        instructor: req.user._id,
      });
      await newClass.save();

      return res.status(200).json({
        msg: `${newClass.name} class created.`,
        class: newClass,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getStudentClasses: async (req, res) => {
    const { limit, skip } = Pagination(req);
    const { sort } = req.query;

    try {
      const totalData = [
        {
          // classSchema.people: [ { ref: 'user',} ]
          $match: { people: mongoose.Types.ObjectId(req.user._id) },
        },
        {
          $lookup: {
            from: 'users',
            let: { user_id: '$instructor' }, // Optional. Specifies the variables to use in the pipeline stages.
            pipeline: [
              // $eq Compares two values and returns true if match
              { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
              { $project: { name: 1 } },
            ],
            as: 'instructor',
          },
        },

        { $unwind: '$instructor' },
        { $skip: skip },
        { $limit: limit },
      ];

      if (sort === 'descending') {
        totalData.unshift({
          $sort: { createdAt: -1 },
        });
      }

      const data = await Class.aggregate([
        {
          $facet: {
            totalData,
            totalCount: [
              { $match: { people: mongoose.Types.ObjectId(req.user._id) } },
              { $count: 'count' },
            ],
          },
        },
        {
          $project: {
            // Example  { $arrayElemAt: [ [ 1, 2, 3 ], 0 ] }  Results  1
            count: { $arrayElemAt: ['$totalCount.count', 0] },
            totalData: 1,
          },
        },
      ]);
      const classes = data[0].totalData;
      const classesCount = data[0].count;

      // Pagination
      let totalPage = 0;
      if (classesCount % limit === 0) {
        // 8 / 4 = 2 === 0
        totalPage = classesCount / limit;
      } else {
        // 9 / 4 >= 2.1 !== 0 // 2+1 = 3
        totalPage = Math.floor(classesCount / limit) + 1;
      }

      return res.status(200).json({
        classes,
        totalPage,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  joinClass: async (req, res) => {
    try {
      const classDetail = await Class.findOne({ _id: req.params.id });
      if (!classDetail)
        return res.status(404).json({ msg: 'Class not found.' });

      if (classDetail.restrict)
        return res
          .status(400)
          .json({ msg: "This class currently don't accept any student." });

      const findUserInClass = await Class.findOne({
        _id: req.params.id,
        people: req.user._id,
      });
      if (findUserInClass)
        return res.status(400).json({ msg: 'You have join this class.' });

      const classData = await Class.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { people: req.user._id },
        },
        { new: true }
      ).populate('instructor', 'name');

      return res.status(200).json({
        msg: 'Class joined.',
        class: classData,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  searchInstructorClass: async (req, res) => {
    try {
      const classes = await Class.aggregate([
        {
          // https://www.mongodb.com/docs/atlas/atlas-ui/indexes/
          // $search aggregation pipleline stage performs a full-text search of the field
          // or fields in an Atlas collection.
          $search: {
            index: 'fetchClass',
            //  The index enables autocomplete operators to query the title field.
            autocomplete: {
              query: req.query.title,
              path: 'name',
            },
          },
        },
        {
          $lookup: {
            from: 'quizzes', // classSchema.quizzes: [ { ref: 'quiz',} ]
            let: { quiz_id: '$quizzes' }, // Optional. Specifies the variables to use in the pipeline stages.
            //{ $in: [ <expression>, <array expression> ] } { $in: [ 2, [ 1, 2, 3 ] ] }  true
            pipeline: [
              { $match: { $expr: { $in: ['$_id', '$$quiz_id'] } } },
              { $project: { title: 1, status: 1 } },
            ],
            // as: <output array field>
            as: 'quizzes',
          },
        },
        {
          $lookup: {
            // classSchema.people: [ { ref: 'user',} ]
            from: 'users',
            let: { user_id: '$people' }, // Optional. Specifies the variables to use in the pipeline stages.
            //{ $in: [ <expression>, <array expression> ] } { $in: [ 2, [ 1, 2, 3 ] ] }  true
            pipeline: [
              { $match: { $expr: { $in: ['$_id', '$$user_id'] } } },
              { $project: { avatar: 1, name: 1, email: 1 } },
            ],
            // as: <output array field>
            as: 'people',
          },
        },
        { $match: { instructor: mongoose.Types.ObjectId(req.params.id) } },

        { $sort: { createdAt: -1 } },
        { $limit: 5 },
      ]);

      if (!classes.length)
        return res.status(404).json({ msg: 'No class found.' });

      return res.status(200).json({ classes });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  searchStudentClass: async (req, res) => {
    const userId = req.user.id;
    try {
      const classes = await Class.aggregate([
        {
          $search: {
            index: 'fetchClass',
            //  The index enables autocomplete operators to query the title field.
            autocomplete: {
              query: req.query.title,
              path: 'name',
            },
          },
        },
        { $match: { people: { $in: [mongoose.Types.ObjectId(userId)] } } },

        { $sort: { createdAt: -1 } },
        { $limit: 5 },
      ]);

      return res.status(200).json({ classes });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteClass: async (req, res) => {
    try {
      const classDetail = await Class.findOneAndDelete({ _id: req.params.id });
      if (!classDetail)
        return res
          .status(404)
          .json({ msg: `Class with ID ${req.params.id} not found.` });
      const classQuizzes = classDetail.quizzes;
      for (let i = 0; i < classQuizzes.length; i++) {
        // quizSchema.results: [ { ref: 'result',} ]
        await Result.deleteMany({ quiz: classQuizzes[i] });
        // classSchema.quizzes: [ { ref: 'quiz',} ]
        await Quiz.findOneAndDelete({ _id: classQuizzes[i] });
      }

      return res
        .status(200)
        .json({ msg: `Class with ID ${req.params.id} has been deleted.` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  changeRestrictStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const { id } = req.params;

      const newClass = await Class.findOneAndUpdate(
        { _id: id },
        { restrict: status },
        { new: true }
      );
      return res.status(200).json({ class: newClass });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  renameClass: async (req, res) => {
    try {
      const { name } = req.body;
      const { id } = req.params;

      if (!name)
        return res.status(400).json({ msg: "Class name can't be empty." });

      const classDetail = await Class.findOneAndUpdate(
        { _id: id },
        { name },
        { new: true }
      );
      if (!classDetail)
        return res.status(404).json({ msg: `Class with ID ${id} not found.` });

      return res.status(200).json({
        msg: 'Class has been updated.',
        class: classDetail,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  firedStudent: async (req, res) => {
    try {
      const classDetail = await Class.findOneAndUpdate(
        { _id: req.body.classId },
        {
          $pull: { people: req.params.id },
        }
      );
      if (!classDetail)
        return res
          .status(404)
          .json({ msg: `No class found with ID ${req.body.classId}` });

      const classQuizzes = classDetail.quizzes;
      for (let i = 0; i < classQuizzes.length; i++) {
        const resultDetail = await Result.findOneAndDelete({
          student: req.params.id,
          quiz: classQuizzes[i],
        });
        if (resultDetail) {
          await Quiz.findOneAndUpdate(
            { _id: classQuizzes[i] },
            {
              $pull: { results: resultDetail._id },
            }
          );
        }
      }

      return res
        .status(200)
        .json({ msg: `Student with ID ${req.params.id} has been fired.` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getClassDetail: async (req, res) => {
    try {
      const { sort, category } = req.query;

      const categoryQuery = [];
      if (typeof category === 'string') {
        categoryQuery.push(mongoose.Types.ObjectId(category));
      } else {
        for (let i = 0; i < category?.length; i++) {
          categoryQuery.push(mongoose.Types.ObjectId(category[i]));
        }
      }

      const quizPipeline = [
        { $match: { $expr: { $in: ['$_id', '$$quiz_id'] } } },
        {
          $lookup: {
            from: 'results',
            let: { result_id: '$results' },
            pipeline: [{ $match: { $expr: { $in: ['$_id', '$$result_id'] } } }],
            as: 'results',
          },
        },
      ];

      if (categoryQuery.length !== 0) {
        quizPipeline.unshift({
          $match: {
            category: { $in: categoryQuery },
          },
        });
      }

      if (sort === 'descending') {
        quizPipeline.unshift({ $sort: { createdAt: -1 } });
      }

      const classDetail = await Class.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(req.params.id) },
        },
        {
          $lookup: {
            from: 'users',
            let: { user_id: '$instructor' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
              { $project: { name: 1 } },
            ],
            as: 'instructor',
          },
        },
        { $unwind: '$instructor' },
        {
          $lookup: {
            from: 'quizzes',
            let: { quiz_id: '$quizzes' },
            pipeline: quizPipeline,
            as: 'quizzes',
          },
        },
      ]);

      if (!classDetail)
        return res
          .status(404)
          .json({ msg: `Class with ID ${req.params.id} not found.` });

      return res.status(200).json({ class: classDetail });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = classCtrl;
