import { BiCheck } from 'react-icons/bi';

const QuestionBox = ({ questionIdx, title, choice, answer, corrAns, cb }) => {
  const handleChange = (value) => {
    cb(questionIdx, value);
  };
  return (
    <div className="questionBox">
      <p>{title}</p>
      <div className="questionBox__answer">
        {choice?.map((item, idx) => (
          <div
            key={`question${questionIdx}-choice${idx}`}
            className="inputGroup inputGroup--answer"
          >
            {answer ? (
              <input
                type="radio"
                checked={Number(answer[questionIdx]) === idx ? true : false}
                disabled={true}
              />
            ) : (
              <input
                type="radio"
                id={`question${questionIdx}-choice${idx}`}
                value={idx}
                name={`question${questionIdx}`}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
            <label htmlFor={`question${questionIdx}-choice${idx}`}>
              {item}
            </label>
            {answer && (
              <>
                {Number(answer[questionIdx]) === idx &&
                  (Number(answer[questionIdx]) === corrAns ? (
                    <BiCheck className="correct" />
                  ) : (
                    <p className="wrong">&times;</p>
                  ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionBox;
