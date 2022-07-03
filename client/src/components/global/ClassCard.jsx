import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClassDetailModal from './../trainer/dashboard/ClassDetailModal';

const ClassCard = ({
  id,
  isTrainer,
  title,
  description,
  instructor,
  quizzes,
  student,
  classRestrict,
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const navigate = useNavigate();
  const handleExpand = () => {
    navigate(`/class/${id}`);
  };

  return (
    <>
      <div className="classCard">
        <h2>{title}</h2>
        <p>{description}</p>

        {isTrainer ? (
          <div className="classCard__teacherInfo">
            <p>Total Quiz : {quizzes.length}</p>
            <p>Total Student : {student.length}</p>
          </div>
        ) : (
          <p>Instructor: {instructor}</p>
        )}

        {isTrainer ? (
          <button onClick={() => setIsOpenModal(true)}>More &gt;</button>
        ) : (
          <button onClick={handleExpand}>Expand</button>
        )}
      </div>
      {isTrainer && (
        <ClassDetailModal
          id={id}
          title={title}
          quizzes={quizzes}
          student={student}
          isOpenModal={isOpenModal}
          classRestrict={classRestrict}
          setIsOpenModal={setIsOpenModal}
        />
      )}
    </>
  );
};

export default ClassCard;
