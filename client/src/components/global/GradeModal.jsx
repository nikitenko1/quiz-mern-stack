import { AiOutlineClose } from 'react-icons/ai';
import QuestionBox from './QuestionBox';

const GradeModal = ({
  isOpenGrade,
  setIsOpenGrade,
  title,
  answer,
  questions,
  score,
}) => {
  return (
    <div className={`gradeModal ${isOpenGrade ? 'active' : undefined}`}>
      <div className={`gradeModal__box ${isOpenGrade ? 'active' : undefined}`}>
        <div className="gradeModal__header">
          <h3>{title} Grade</h3>
          <AiOutlineClose onClick={() => setIsOpenGrade(false)} />
        </div>
        <div className="gradeModal__body">
          <h4>
            Grade: {score}/{questions?.length}
          </h4>
          {questions?.map((question, idx) => (
            <div key={question._id} className="gradeModal__question">
              <h3>Question {idx + 1}</h3>
              <QuestionBox
                questionIdx={question._id}
                title={question.title}
                choice={question.choice}
                answer={answer}
                corrAns={question.answer}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradeModal;
