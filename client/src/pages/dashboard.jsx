import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/global/Navbar';
import HeadInfo from '../utils/HeadInfo';
import TrainerDashboard from './../components/trainer/dashboard/TrainerDashboard';
import StudentDashboard from './../components/student/dashboard/StudentDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state);

  useEffect(() => {
    if (!auth.user) navigate('/');
  }, [auth.user, navigate]);

  return (
    <>
      <HeadInfo title="Dashboard" />
      <Navbar />
      <div className="container">
        {auth.user?.role === 'Student' && <StudentDashboard />}

        {auth.user?.role === 'Instructor' && <TrainerDashboard />}
      </div>
    </>
  );
};

export default Dashboard;
