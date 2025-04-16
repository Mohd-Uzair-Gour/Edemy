import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { toast } from 'react-toastify';
import axios from 'axios';

const MyCourses = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + '/api/educator/courses', {
        headers: { Authorization: token },
      });
      if (data.success) setCourses(data.courses);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, []);

  return courses ? (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6">My Courses</h2>

      {/* Table / List */}
      <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
        <table className="hidden md:table w-full">
          <thead className="bg-gray-100 text-sm text-left">
            <tr>
              <th className="px-4 py-3">All Courses</th>
              <th className="px-4 py-3">Earnings</th>
              <th className="px-4 py-3">Students</th>
              <th className="px-4 py-3">Published On</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {courses.map((course) => (
              <tr key={course._id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3 flex items-center gap-4">
                  <img
                    src={course.courseThumbnail}
                    alt="Thumbnail"
                    className="w-14 h-14 object-cover rounded-md"
                  />
                  <span>{course.courseTitle}</span>
                </td>
                <td className="px-4 py-3">
                  {currency} {Math.floor(course.enrolledStudents.length * (course.coursePrice - (course.discount * course.coursePrice) / 100))}
                </td>
                <td className="px-4 py-3">{course.enrolledStudents.length}</td>
                <td className="px-4 py-3">{new Date(course.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col gap-4 p-2">
          {courses.map((course) => (
            <div key={course._id} className="bg-white shadow border rounded-lg p-4 flex flex-col gap-2">
              <div className="flex gap-4 items-center">
                <img
                  src={course.courseThumbnail}
                  alt="Course Thumbnail"
                  className="w-16 h-16 object-cover rounded-md"
                />
                <h3 className="font-semibold text-base">{course.courseTitle}</h3>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Earnings:</strong> {currency} {Math.floor(course.enrolledStudents.length * (course.coursePrice - (course.discount * course.coursePrice) / 100))}</p>
                <p><strong>Students:</strong> {course.enrolledStudents.length}</p>
                <p><strong>Published:</strong> {new Date(course.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
