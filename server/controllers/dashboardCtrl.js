const { Class } = require('./../models/Class');
const { Quiz } = require('./../models/Quiz');

const dashboardCtrl = {
  getDashboardInfo: async (req, res) => {
    try {
      const classDetail = await Class.find({ instructor: req.user._id });

      const classDetailId = [];

      for (let i = 0; i < classDetail.length; i++) {
        classDetailId.push(classDetail[i]._id);
      }
      // classSchema.people: [ { ref: 'user',} ] from: <foreign collection>,
      // classSchema.quizzes: [ { ref: 'quiz',} ] from: <foreign collection>,
      // quizSchema.status: [ default: 'Open', ]  

      let openQuizCount = 0;
      let closeQuizCount = 0;
      let peopleList = [];

      for (let i = 0; i < classDetailId.length; i++) {
        const openQuizDetail = await Quiz.find({
          class: classDetailId[i],
          status: 'Open',
        });
        openQuizCount += openQuizDetail.length;

        const closeQuizDetail = await Quiz.find({
          class: classDetailId[i],
          status: 'Close',
        });
        closeQuizCount += closeQuizDetail.length;
      }

      for (let i = 0; i < classDetail.length; i++) {
        for (let j = 0; j < classDetail[i].people.length; j++) {
          if (!peopleList.includes(classDetail[i].people[j].toString())) {
            peopleList.push(classDetail[i].people[j].toString());
          }
        }
      }

      return res.status(200).json({
        totalClass: classDetail.length,
        totalQuizOpen: openQuizCount,
        totalQuizClose: closeQuizCount,
        totalPeople: peopleList.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = dashboardCtrl;
