import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserGraduate } from 'react-icons/fa';
import { SiGoogleclassroom } from 'react-icons/si';
import { GiOpenBook } from 'react-icons/gi';
import { ImBook } from 'react-icons/im';
import { getDataAPI } from './../../../utils/fetchData';
import { getClasses } from './../../../redux/actions/classActions';
import InfoCard from './../../global/InfoCard';
import ClassCard from './../../global/ClassCard';
import Loader from './../../global/Loader';
import Pagination from './../../global/Pagination';

const TrainerDashboard = () => {
  const [dashboardInfo, setDashboardInfo] = useState({});

  const dispatch = useDispatch();
  const { auth, alert, instructorClass } = useSelector((state) => state);

  const fetchClassData = useCallback(
    async (page = 1) => {
      await dispatch(getClasses(auth.accessToken, page));
    },
    [dispatch, auth.accessToken]
  );

  const fetchDashboardInfoData = useCallback(async () => {
    await getDataAPI('/dashboard', auth.accessToken).then((res) =>
      setDashboardInfo(res.data)
    );
  }, [auth.accessToken]);

  useEffect(() => {
    fetchClassData();
    fetchDashboardInfoData();
  }, [fetchClassData, fetchDashboardInfoData]);

  const handlePaginate = (num) => {
    fetchClassData(num);
  };

  return (
    <>
      <div className="teacherDashboard">
        {Object.keys(dashboardInfo).length > 0 && (
          <div className="teacherDashboard__header">
            <InfoCard
              title="Total Students"
              description={`${dashboardInfo?.totalPeople} ${
                dashboardInfo?.totalPeople > 1 ? 'Students' : 'Student'
              }`}
              Icon={FaUserGraduate}
            />
            <InfoCard
              title="Total Class"
              description={`${dashboardInfo?.totalClass} ${
                dashboardInfo?.totalClass > 1 ? 'Classes' : 'Class'
              }`}
              Icon={SiGoogleclassroom}
            />
            <InfoCard
              title="Total Quiz Open"
              description={`${dashboardInfo?.totalQuizOpen} ${
                dashboardInfo?.totalQuizOpen > 1 ? 'Quizzes' : 'Quiz'
              }`}
              Icon={GiOpenBook}
            />
            <InfoCard
              title="Total Quiz Close"
              description={`${dashboardInfo?.totalQuizClose} ${
                dashboardInfo?.totalQuizClose > 1 ? 'Quizzes' : 'Quiz'
              }`}
              Icon={ImBook}
            />
          </div>
        )}
        <div className="teacherDashboard__body">
          <div className="teacherDashboard__body--title">
            <h2>Your Classes</h2>
          </div>
          {alert.loading ? (
            <div className="center mt-5">
              <Loader width="60px" height="60px" />
            </div>
          ) : (
            <>
              {instructorClass.data?.length === 0 ? (
                <div className="errorMessage">No Class Found</div>
              ) : (
                <>
                  <div className="teacherDashboard__classList">
                    {instructorClass.data?.map((item) => (
                      <ClassCard
                        key={item._id}
                        id={item._id}
                        isTrainer={true}
                        title={item.name}
                        description={item.description}
                        quizzes={item.quizzes}
                        student={item.people}
                        classRestrict={item.restrict}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
          {instructorClass.totalPage > 1 && (
            <>
              <div className="float-right">
                <Pagination
                  page={instructorClass.totalPage}
                  callback={handlePaginate}
                />
              </div>
              <div className="clear"></div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TrainerDashboard;
