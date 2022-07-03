import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaTrash, FaEdit } from 'react-icons/fa';
import {
  changeQuizStatus,
  deleteQuiz,
} from './../../../redux/actions/quizActions';
import { GLOBAL_TYPES } from './../../../redux/types/globalTypes';

const QuizCard = ({ id, submissions, title, status, classId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state);

  const handleEdit = () => {
    navigate(`/edit_quiz/${id}`, { state: { name: classId } });
  };

  const handleChangeStatus = () => {
    let newStatus = '';
    if (status === 'Open') {
      newStatus = 'Close';
    } else {
      newStatus = 'Open';
    }
    dispatch(changeQuizStatus(id, newStatus, auth.accessToken));
  };

  const handleDelete = () => {
    dispatch(deleteQuiz(id, auth.accessToken));
  };

  const handleOpenSubmission = () => {
    if (submissions?.length === 0) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: "There's still no submission for this quiz.",
        },
      });
    } else {
      navigate(`/submission/${id}`);
    }
  };

  return (
    <>
      <div className="trainerQuizCard">
        <div className="trainerQuizCard__left">
          <h4>
            {title} - {classId}
          </h4>
        </div>
        <div className="trainerQuizCard__right">
          <FaEye onClick={handleOpenSubmission} />
          <FaEdit onClick={handleEdit} />
          <FaTrash onClick={handleDelete} />
          <p
            onClick={handleChangeStatus}
            className={status === 'Open' ? 'open' : 'close'}
          >
            {status === 'Open' ? 'Open' : 'Close'}
          </p>
        </div>
      </div>
    </>
  );
};

export default QuizCard;
