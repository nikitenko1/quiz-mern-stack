import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CreateQuiz from './../create_quiz/[id]';
import NotFound from './../../components/global/NotFound';
import HeadInfo from './../../utils/HeadInfo';

const EditQuiz = () => {
  const { id } = useParams();
  const { auth } = useSelector((state) => state);

  if (!auth.user || auth.user?.role !== 'Instructor') return <NotFound />;
  return (
    <>
      <HeadInfo title="Edit Quiz" />
      <CreateQuiz quizId={id} onEdit={true} />
    </>
  );
};

export default EditQuiz;
