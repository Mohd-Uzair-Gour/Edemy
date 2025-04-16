import React, { useContext, useEffect, useState } from 'react';
import { dummyStudentEnrolled } from '../../assets/assets';
import Loading from '../../components/student/Loading';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const { backendUrl, getToken, isEducator } = useContext(AppContext);

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students', {
        headers: { Authorization: token },
      });
      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents();
    }
  }, [isEducator]);

  return enrolledStudents ? (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50 flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-gray-700">Enrolled Students</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-md bg-white border border-gray-300">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Student Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Course Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{index + 1}</td>
                <td className="px-4 py-3 text-sm flex items-center">
                  <img
                    src={item.student.imageUrl}
                    alt={item.student.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <span>{item.student.name}</span>
                </td>
                <td className="px-4 py-3 text-sm">{item.courseTitle}</td>
                <td className="px-4 py-3 text-sm">{new Date(item.purchaseDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {enrolledStudents.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-4 mb-2">
              <img
                src={item.student.imageUrl}
                alt={item.student.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{item.student.name}</span>
                <span className="text-xs text-gray-500">#{index + 1}</span>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              <p><strong>Course:</strong> {item.courseTitle}</p>
              <p><strong>Date:</strong> {new Date(item.purchaseDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default StudentEnrolled;
