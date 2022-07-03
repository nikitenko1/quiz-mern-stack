import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getQuizDetail, submitQuiz } from './../../redux/actions/quizActions';
import { GLOBAL_TYPES } from './../../redux/types/globalTypes';
import Navbar from './../../components/global/Navbar';
import QuestionBox from './../../components/global/QuestionBox';
import NotFound from './../../components/global/NotFound';
import Loader from './../../components/global/Loader';
import HeadInfo from './../../utils/HeadInfo';

const QuizDetail = () => {
  const [onSubmit, setOnSubmit] = useState(false);
  const [studentAnswer, setStudentAnswer] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { alert, auth, quizDetail, socket } = useSelector((state) => state);

  useEffect(() => {
    console.log({ name: auth.user?.name, id: auth.user?._id });
    dispatch(getQuizDetail(id));
  }, [id, dispatch]);

  const handleChangeAnswer = (questionIdx, value) => {
    setStudentAnswer({ ...studentAnswer, [questionIdx]: value });
  };

  const handleSubmit = async () => {
    if (Object.keys(studentAnswer).length !== quizDetail.questions?.length) {
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: 'Please answer all questions.',
        },
      });
    }

    setOnSubmit(true);
    await dispatch(
      submitQuiz(
        studentAnswer,
        { name: auth.user?.name, id: auth.user?._id },
        id,
        quizDetail.class?.instructor._id,
        quizDetail.title,
        auth.accessToken,
        socket
      )
    );
    setOnSubmit(false);

    navigate('/');
  };

  if (!auth.user || auth.user?.role !== 'Student') return <NotFound />;
  return (
    <>
      <HeadInfo title={`"${quizDetail.title}" Quiz`} />
      <Navbar />
      <div className="quizDetail container">
        {alert.loading ? (
          <div className="center">
            <Loader width="50px" height="50px" border="5px" />
          </div>
        ) : (
          <>
            <div className="quizDetail__header">
              <h2>
                {quizDetail.class?.name} | {quizDetail.title}
              </h2>
              <p>Instructor : {quizDetail.class?.instructor.name}</p>{' '}
              <p>
                {quizDetail.questions?.length}{' '}
                {quizDetail.questions?.length > 1 ? 'Questions' : 'Question'}
              </p>
            </div>
            <div className="quizDetail__body">
              {quizDetail.questions?.map((question, idx) => (
                <div key={question._id} className="quizDetail__question">
                  <h3>Question {idx + 1}</h3>
                  <QuestionBox
                    questionIdx={question._id}
                    title={question.title}
                    choice={question.choice}
                    cb={handleChangeAnswer}
                  />
                </div>
              ))}
            </div>
          </>
        )}
        {!alert.loading && (
          <button onClick={handleSubmit} disabled={onSubmit ? true : false}>
            {onSubmit ? (
              <div className="center">
                <Loader width="20px" height="20px" border="2px" />
              </div>
            ) : (
              'Submit'
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default QuizDetail;
