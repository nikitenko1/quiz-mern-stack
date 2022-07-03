import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Navbar from './../../components/global/Navbar';
import TableRow from './../../components/submission/TableRow';
import NotFound from './../../components/global/NotFound';
import HeadInfo from './../../utils/HeadInfo';
import { getSubmissionsByQuiz } from './../../redux/actions/submissionActions';

const Submission = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { auth, submission } = useSelector((state) => state);

  useEffect(() => {
    dispatch(getSubmissionsByQuiz(id, auth.accessToken));
  }, [dispatch, id, auth.accessToken]);

  if (!auth.user || auth.user?.role === 'Student') return <NotFound />;

  return (
    <>
      <HeadInfo title="Submission" />
      <Navbar />
      <div className="submission container">
        <div className="submission__header">
          <h2>
            {submission.class?.name} | {submission.quizName}
          </h2>
          <p>Instructor : {auth.user?.name}</p>
          <p>
            {submission.count}/{submission.class?.people?.length}{' '}
            {submission.class?.people?.length > 1
              ? 'submissions'
              : 'submission'}
          </p>
        </div>
        <div className="submission__body">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Correct Rate</th>
                <th>Percentage</th>
                <th>Submission Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {submission.results?.map((item, idx) => (
                <TableRow
                  key={idx}
                  no={idx + 1}
                  student={item.student?.name}
                  score={item.score}
                  submissionDate={new Date(item.createdAt).toLocaleString()}
                  questions={submission.questions}
                  answer={item.answer}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Submission;
