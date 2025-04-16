import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import Footer from "../../components/student/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const MyEnrollments = () => {
  const {
    enrolledCourses,
    calculateCourseDuration,
    navigate,
    userData,
    fetchUserEnrolledCourses,
    backendUrl,
    getToken,
    calculateNoOfLectures,
  } = useContext(AppContext);
  const [progressArray, setProgressArray] = useState([]);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            { headers: { Authorization: token } }
          );
          let totalLectures = calculateNoOfLectures(course);
          const lectureCompleted = data.progressData
            ? data.progressData.lectureCompleted.length
            : 0;
          return { totalLectures, lectureCompleted };
        })
      );
      setProgressArray(tempProgressArray);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
    }
  }, [userData]);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    }
  }, [enrolledCourses]);

  return (
    <>
      <div className="px-4 md:px-36 pt-14">
        <h1 className="text-2xl font-semibold text-center mb-6">
          My Enrollments
        </h1>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <table className="w-full mt-10 border border-gray-200">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-lg">Course</th>
                <th className="px-4 py-3 font-semibold text-lg">Duration</th>
                <th className="px-4 py-3 font-semibold text-lg">Completed</th>
                <th className="px-4 py-3 font-semibold text-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses.map((course, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-4 py-4 flex items-center space-x-4">
                    <img
                      src={course.courseThumbnail}
                      alt=""
                      className="w-20 rounded-md"
                    />
                    <div className="truncate">
                      <p className="text-lg font-medium">{course.courseTitle}</p>
                      <Line
                        strokeWidth={2}
                        percent={
                          progressArray[index]
                            ? (progressArray[index].lectureCompleted * 100) /
                              progressArray[index].totalLectures
                            : 0
                        }
                        className="bg-gray-300 rounded-full mt-1"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {calculateCourseDuration(course)}
                  </td>
                  <td className="px-4 py-4">
                    {progressArray[index] &&
                      `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`}{" "}
                    <span className="text-gray-600">Lectures</span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => navigate("/player/" + course._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200"
                    >
                      {progressArray[index] &&
                      progressArray[index].lectureCompleted /
                        progressArray[index].totalLectures ===
                        1
                        ? "Completed"
                        : "On Going"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col gap-6 mt-6">
          {enrolledCourses.map((course, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <img
                  src={course.courseThumbnail}
                  alt=""
                  className="w-24 rounded-md"
                />
                <div className="flex-1">
                  <p className="text-lg font-semibold mb-1">
                    {course.courseTitle}
                  </p>
                  <Line
                    strokeWidth={2}
                    percent={
                      progressArray[index]
                        ? (progressArray[index].lectureCompleted * 100) /
                          progressArray[index].totalLectures
                        : 0
                    }
                    className="bg-gray-300 rounded-full mb-1"
                  />
                  <p className="text-sm text-gray-700 mb-1">
                    Duration: {calculateCourseDuration(course)}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    {progressArray[index] &&
                      `Completed: ${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures} Lectures`}
                  </p>
                  <button
                    onClick={() => navigate("/player/" + course._id)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-700 transition duration-200"
                  >
                    {progressArray[index] &&
                    progressArray[index].lectureCompleted /
                      progressArray[index].totalLectures ===
                      1
                      ? "Completed"
                      : "On Going"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MyEnrollments;
