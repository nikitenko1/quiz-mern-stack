import { useState } from 'react';
import GradeModal from './../global/GradeModal';

const TableRow = ({
  no,
  student,
  score,
  submissionDate,
  questions,
  answer,
}) => {
  const [isOpenGrade, setIsOpenGrade] = useState(false);

  return (
    <>
      <tr>
        <td>{no}</td>
        <td>{student}</td>
        <td>
          {score}/{questions.length}
        </td>
        <td>{(score / questions.length) * 100}%</td>
        <td>{submissionDate}</td>
        <td>
          <button onClick={() => setIsOpenGrade(true)}>VIEW</button>
        </td>
      </tr>
      <GradeModal
        isOpenGrade={isOpenGrade}
        setIsOpenGrade={setIsOpenGrade}
        title={student}
        questions={questions}
        score={score}
        answer={answer}
      />
    </>
  );
};

export default TableRow;
