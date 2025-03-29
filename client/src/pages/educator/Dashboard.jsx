import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets, dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/student/Loading';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const { currency } = useContext(AppContext);

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return dashboardData ? (
    <div className='min-h-screen flex flex-col items-start justify-between gap-8 p-4 pt-8'>
      <div className='space-y-5'>
        <div className='flex flex-wrap gap-5 items-center'>
          {/* Total Enrolments Card */}
          <div className='flex items-center gap-3 shadow-lg border border-blue-500 p-4 w-56 rounded-md'>
            <img src={assets.patients_icon} alt="Enrolled Students" className='w-8 h-8' />
            <div>
              <p className='text-2xl font-medium text-gray-600'>
                {dashboardData.enrolledStudentsData.length}
              </p>
              <p className='text-base text-gray-500'>Total Enrolments</p>
            </div>
          </div>

          {/* Total Courses Card */}
          <div className='flex items-center gap-3 shadow-lg border border-blue-500 p-4 w-56 rounded-md'>
            <img src={assets.appointments_icon} alt="Total Courses" className='w-8 h-8' />
            <div>
              <p className='text-2xl font-medium text-gray-600'>
                {dashboardData.totalCourses}
              </p>
              <p className='text-base text-gray-500'>Total Courses</p>
            </div>
          </div>

          {/* Total Earnings Card */}
          <div className='flex items-center gap-3 shadow-lg border border-blue-500 p-4 w-56 rounded-md'>
            <img src={assets.earning_icon} alt="Total Earnings" className='w-8 h-8' />
            <div>
              <p className='text-2xl font-medium text-gray-600'>
                {currency}{dashboardData.totalEarnings}
              </p>
              <p className='text-base text-gray-500'>Total Earnings</p>
            </div>
          </div>
        </div>

        {/* Latest Enrolments Table */}
        <div>
          <h2 className='pb-4 text-lg font-medium'>Latest Enrolments</h2>
          <div className='overflow-hidden rounded-md bg-white border border-gray-500/20'>
            <table className='min-w-full'>
              <thead>
                <tr>
                  <th className='px-4 py-2 text-left'>#</th>
                  <th className='px-4 py-2 text-left'>Student Name</th>
                  <th className='px-4 py-2 text-left'>Course Title</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr key={index} className='border-t'>
                    <td className='px-4 py-2'>{index + 1}</td>
                    <td className='px-4 py-2 flex items-center'>
                      <img src={item.student.imageUrl} alt={item.student.name} className='w-8 h-8 rounded-full mr-2' />
                      <span>{item.student.name}</span>
                    </td>
                    <td className='px-4 py-2'>{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
