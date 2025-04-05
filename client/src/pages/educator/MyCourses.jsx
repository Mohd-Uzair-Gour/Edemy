import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { toast } from 'react-toastify';
import axios from 'axios'

const MyCourses = () => {
  const { currency,backendUrl,isEducator,getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
     try {
      const token = await getToken()
      const {data} = await axios.get(backendUrl + '/api/educator/courses' , {headers:{Authorization:token}})
      data.success && setCourses(data.courses)
     } catch (error) {
      toast.error(error.message)
     }
  };

  useEffect(() => {
    if(isEducator){
      fetchEducatorCourses();
    }
  }, []);

  return courses ? (
    <div className="min-h-screen p-6 flex flex-col gap-8">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>

      {/* Table Container */}
      <div className="overflow-x-auto bg-white rounded-md border border-gray-200">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">All Courses</th>
              <th className="px-4 py-2 text-left">Earnings</th>
              <th className="px-4 py-2 text-left">Students</th>
              <th className="px-4 py-2 text-left">Published On</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 flex items-center">
                  <img
                    src={course.courseThumbnail}
                    alt="Course Thumbnail"
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <span>{course.courseTitle}</span>
                </td>
                <td className="px-4 py-2">
                  {currency} {Math.floor(course.enrolledStudents.length * (course.coursePrice - (course.discount * course.coursePrice) / 100))}
                </td>
                <td className="px-4 py-2">{course.enrolledStudents.length}</td>
                <td className="px-4 py-2">{new Date(course.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
