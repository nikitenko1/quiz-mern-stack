import { useState } from 'react';
import { Link } from 'react-router-dom';
import GradeModal from './../../global/GradeModal';

const QuizCard = ({ id, title, questions, isDone }) => {
  const [isOpenGrade, setIsOpenGrade] = useState(false);

  return (
    <>
      <div className="quizCard">
        <div className="quizCard__left">
          {isDone ? (
            <h4>{title}</h4>
          ) : (
            <h4>
              <Link to={`/quiz/${id}`}>{title}</Link>
            </h4>
          )}
        </div>
        <div className="quizCard__right">
          {isDone ? (
            <>
              <p onClick={() => setIsOpenGrade(true)}>View Grade</p>
              <p>
                {isDone.score}/{Object.keys(isDone.answer).length}
              </p>
            </>
          ) : (
            <p>Not done</p>
          )}
        </div>
        <GradeModal
          isOpenGrade={isOpenGrade}
          setIsOpenGrade={setIsOpenGrade}
          title={title}
          answer={isDone?.answer}
          score={isDone?.score}
          questions={questions}
        />
      </div>
    </>
  );
};

export default QuizCard;
