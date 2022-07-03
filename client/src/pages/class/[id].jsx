import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getDataAPI } from './../../utils/fetchData';
import { getAllCategory } from './../../redux/actions/categoryActions';
import Navbar from './../../components/global/Navbar';
import FilterSearch from './../../components/student/classDetail/FilterSearch';
import QuizCard from './../../components/student/classDetail/QuizCard';
import Loader from './../../components/global/Loader';
import NotFound from './../../components/global/NotFound';
import HeadInfo from './../../utils/HeadInfo';

const ClassDetail = () => {
  const [loading, setLoading] = useState(false);
  const [sortByDate, setSortByDate] = useState('');
  const [filterByCompletion, setFilterByCompletion] = useState('');
  const [filterByCategory, setFilterByCategory] = useState([]);
  const [classData, setClassData] = useState({});

  const dispatch = useDispatch();
  const { id } = useParams();
  const { auth, category } = useSelector((state) => state);

  const fetchClassDetailData = useCallback(async () => {
    setLoading(true);
    // .route('/:id').get(classCtrl.getClassDetail)
    let url = `class/${id}`;

    if (sortByDate === 'descending') url = url + '?sort=descending';

    if (filterByCategory.length > 0) {
      let queryStr = '';
      // const categoryQuery = [];
      // if (typeof category === 'string') {
      //   categoryQuery.push(mongoose.Types.ObjectId(category));
      // } else {
      //   for (let i = 0; i < category?.length; i++) {
      //     categoryQuery.push(mongoose.Types.ObjectId(category[i]));
      //   }
      // }
      for (let i = 0; i < filterByCategory.length; i++) {
        if (i !== filterByCategory.length - 1) {
          queryStr += `category=${filterByCategory[i]}&`;
        } else {
          queryStr += `category=${filterByCategory[i]}`;
        }
      }
      url = `${url}?${queryStr}`;
    }

    const res = await getDataAPI(url);

    const tempQuizzes = res.data.class[0].quizzes;
    let newQuizzes = [];

    if (filterByCompletion === 'complete') {
      tempQuizzes.forEach((item) => {
        item.results.forEach((result) => {
          if (result.student === auth.user?._id) {
            newQuizzes.push(item);
          }
        });
      });
    } else if (filterByCompletion === 'incomplete') {
      tempQuizzes.forEach((item) => {
        let isMatch = false;

        if (item.results.length > 0) {
          item.results.forEach((result) => {
            if (result.student !== auth.user?._id) {
              isMatch = true;
            } else {
              isMatch = false;
            }
          });
        } else {
          isMatch = true;
        }

        if (isMatch) newQuizzes.push(item);
      });
    } else {
      newQuizzes = tempQuizzes;
    }

    setClassData({
      ...res.data.class[0],
      quizzes: newQuizzes,
    });

    setLoading(false);
  }, [id, sortByDate, filterByCompletion, filterByCategory, auth.user?._id]);

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  useEffect(() => {
    if (!id) return;
    fetchClassDetailData();
  }, [id, fetchClassDetailData]);

  if (!auth.user || auth.user?.role !== 'Student') return <NotFound />;

  return (
    <>
      <HeadInfo title={`"${classData.name}" Class`} />
      <Navbar />
      <div className="classDetail container">
        <div className="classDetail__header">
          <h2>{classData.name}</h2>
          <p>Instructor : {classData.instructor?.name}</p>
        </div>
        <div className="classDetail__body">
          <div className="classDetail__body--header">
            <FilterSearch
              category={category}
              sortByDate={sortByDate}
              filterByCompletion={filterByCompletion}
              filterByCategory={filterByCategory}
              setFilterByCategory={setFilterByCategory}
              setSortByDate={setSortByDate}
              setFilterByCompletion={setFilterByCompletion}
            />
          </div>
          <div className="classDetail__body--body">
            <div className="classDetail__quizList">
              {loading ? (
                <div className="center">
                  <Loader width="50px" height="50px" border="5px" />
                </div>
              ) : (
                <>
                  {classData.quizzes?.length === 0 ? (
                    <div className="errorMessage">
                      No quiz found within this class
                    </div>
                  ) : (
                    <>
                      {classData.quizzes?.map((quiz) => (
                        <QuizCard
                          key={quiz._id}
                          id={quiz._id}
                          title={quiz.title}
                          isDone={quiz.results?.find(
                            (item) => item.student === auth.user?._id
                          )}
                          questions={quiz.questions}
                        />
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassDetail;
