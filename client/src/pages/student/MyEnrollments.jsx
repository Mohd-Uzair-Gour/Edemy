import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import Footer from "../../components/student/Footer";

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration, navigate } =
    useContext(AppContext);
  const [progressArray, setProgressArray] = useState([
    { lectureCompleted: 2, totalLectures: 10 },
    { lectureCompleted: 4, totalLectures: 4 },
    { lectureCompleted: 3, totalLectures: 4 },
    { lectureCompleted: 4, totalLectures: 5 },
    { lectureCompleted: 5, totalLectures: 6 },
    { lectureCompleted: 7, totalLectures: 9 },
    { lectureCompleted: 9, totalLectures: 10 },
    { lectureCompleted: 3, totalLectures: 5 },
    { lectureCompleted: 7, totalLectures: 10 },
  ]);

  return (
    <>
      <div className="md:px-36 px-8 pt-14">
        <h1 className="text-2xl font-semibold text-center mb-6">
          My Enrollments
        </h1>
        <table className="md:table-auto table-fixed w-full mt-10 overflow-hidden border border-gray-200">
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
                    className="w-14 sm:w-24 md:w-28 rounded-md"
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
                      className="bg-gray-300 rounded-full"
                    />
                  </div>
                </td>
                <td className="px-4 py-4">{calculateCourseDuration(course)}</td>
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
      <Footer/>
    </>
  );
};

export default MyEnrollments;
