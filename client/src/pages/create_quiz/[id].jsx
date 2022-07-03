import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { getDataAPI } from './../../utils/fetchData';
import { createQuiz, updateQuiz } from './../../redux/actions/quizActions';
import { getAllCategory } from './../../redux/actions/categoryActions';
import { GLOBAL_TYPES } from './../../redux/types/globalTypes';
import Navbar from './../../components/global/Navbar';
import Loader from './../../components/global/Loader';
import NotFound from './../../components/global/NotFound';
import HeadInfo from './../../utils/HeadInfo';

const CreateQuiz = ({ quizId, onEdit }) => {
  const [classTitle, setClassTitle] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [title, setTitle] = useState('Title Goes Here');
  const [people, setPeople] = useState([]);
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState([
    {
      title: 'Question Goes Here',
      answer: 0,
      choice: ['Choice Goes Here'],
    },
  ]);

  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    auth,
    category: allCategory,
    alert,
    socket,
  } = useSelector((state) => state);

  const getClassDetail = useCallback(async () => {
    console.log(location.state.name);
    const res = await getDataAPI(`class/${location.state.name}`);
    setClassTitle(res.data.class[0].name);
    setInstructorName(res.data.class[0].instructor.name);
    setPeople(res.data.class[0].people);
  }, [location.state.name]);

  const getQuizDetail = useCallback(async () => {
    const res = await getDataAPI(`quiz/${quizId}`);
    setTitle(res.data.quiz.title);
    setCategory(res.data.quiz.category);
    setQuestions(res.data.quiz.questions);
  }, [quizId]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        title: 'Question Goes Here',
        answer: 0,
        choice: ['Choice Goes Here'],
      },
    ]);
  };

  const handleDeleteQuestion = (idxQuestion) => {
    const newQuestions = [...questions];
    newQuestions.splice(idxQuestion, 1);
    setQuestions(newQuestions);
  };

  const handleDeleteChoice = (idxChoice, idxQuestion) => {
    const getQuestion = questions[idxQuestion];
    getQuestion.choice.splice(idxChoice, 1);
    setQuestions(
      questions.map((question, i) =>
        i === idxQuestion ? getQuestion : question
      )
    );
  };

  const handleChangeQuestion = (e, idxQuestion) => {
    const value = e.target.value;
    const getQuestion = questions[idxQuestion];
    getQuestion.title = value;
    setQuestions(
      questions.map((question, i) =>
        i === idxQuestion ? getQuestion : question
      )
    );
  };

  const handleAddChoice = (idxQuestion) => {
    const getQuestion = questions[idxQuestion];
    getQuestion.choice.push('Choice Goes Here');
    setQuestions(
      questions.map((question, i) =>
        i === idxQuestion ? getQuestion : question
      )
    );
  };

  const handleChangeChoice = (e, idxChoice, idxQuestion) => {
    const value = e.target.value;
    const getQuestion = questions[idxQuestion];
    getQuestion.choice[idxChoice] = value;
    setQuestions(
      questions.map((question, i) =>
        i === idxQuestion ? getQuestion : question
      )
    );
  };

  const handleChangeAnswer = (e, idxQuestion) => {
    const value = e.target.value;
    const getQuestion = questions[idxQuestion];
    getQuestion.answer = value;
    setQuestions(
      questions.map((question, i) =>
        i === idxQuestion ? getQuestion : question
      )
    );
  };

  const handleSubmit = async () => {
    if (!title) {
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: "Title field can't be empty.",
        },
      });
    }

    if (category === '') {
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: 'Please select quiz category',
        },
      });
    }

    if (questions.length === 0) {
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: "Question can't be blank",
        },
      });
    }

    const quizData = {
      classId: location.state.name,
      category,
      title,
      questions,
      people,
      author: auth.user,
    };

    if (onEdit) {
      await dispatch(updateQuiz(quizId, quizData, auth.accessToken));
    } else {
      await dispatch(createQuiz(quizData, auth.accessToken, socket));
    }
    navigate('/');
  };

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  useEffect(() => {
    if (!onEdit) return;
    getQuizDetail();
  }, [onEdit, getQuizDetail]);

  useEffect(() => {
    getClassDetail();
  }, [getClassDetail]);

  if (!auth.user || auth.user?.role !== 'Instructor') return <NotFound />;
  return (
    <>
      <HeadInfo title={onEdit ? 'Edit Quiz' : 'Create Quiz'} />
      <Navbar />
      <div className="container createQuiz">
        <div className="createQuiz__header">
          <h2>
            {onEdit ? 'Edit Quiz' : 'Create Quiz'} for Class: "{classTitle}"
          </h2>
          <p>Instructor : {instructorName}</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">- Choose Category -</option>
            {allCategory.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="createQuiz__body">
          {questions.map((question, idxQuestion) => (
            <div className="createQuiz__question" key={idxQuestion}>
              <div className="createQuiz__question--title">
                <h3>Question {idxQuestion + 1}</h3>
                <FaTrash onClick={() => handleDeleteQuestion(idxQuestion)} />
              </div>
              <textarea
                value={question.title}
                onChange={(e) => handleChangeQuestion(e, idxQuestion)}
              />
              {question.choice.map((choice, idxChoice) => (
                <div className="createQuiz__choice" key={idxChoice}>
                  <input type="radio" id={choice} disabled={true} />
                  <input
                    type="text"
                    value={choice}
                    onChange={(e) =>
                      handleChangeChoice(e, idxChoice, idxQuestion)
                    }
                  />
                  <FaTrash
                    onClick={() => handleDeleteChoice(idxChoice, idxQuestion)}
                  />
                </div>
              ))}
              <button onClick={() => handleAddChoice(idxQuestion)}>
                Add Choice
              </button>
              <div className="createQuiz__answer">
                <p>Answer</p>
                <select
                  onChange={(e) => handleChangeAnswer(e, idxQuestion)}
                  value={question.answer}
                >
                  {question.choice.map((choice, idxChoice) => (
                    <option key={idxChoice} value={idxChoice}>
                      {choice}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <div className="createQuiz__bottomBtn">
            <button onClick={handleAddQuestion}>Add Question</button>
            <button
              onClick={handleSubmit}
              disabled={alert.loading ? true : false}
            >
              {alert.loading ? (
                <div className="center">
                  <Loader width="20px" height="20px" border="2px" />
                </div>
              ) : onEdit ? (
                'Update'
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateQuiz;
