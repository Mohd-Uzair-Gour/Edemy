import React, { useContext, useEffect, useState } from 'react';
import { dummyStudentEnrolled } from '../../assets/assets';
import Loading from '../../components/student/Loading';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const {backendUrl,getToken,isEducator}  = useContext(AppContext)

  const fetchEnrolledStudents = async () => {
       try {
        const token = await getToken()
        const {data} = await axios.get(backendUrl + '/api/educator/enrolled-students' ,{headers:{Authorization:token}})
        if(data.success){
          setEnrolledStudents(data.enrolledStudents.reverse())
        }else{
          toast.error(data.message)
        }
       } catch (error) {
         toast.error(error.message)
       }
  };

  useEffect(() => {
    if(isEducator){
      fetchEnrolledStudents();
    }
  }, [isEducator]);

  return enrolledStudents ? (
    <div className="min-h-screen p-6 flex flex-col gap-8">
      <h2 className="text-2xl font-semibold mb-4 px-6 py-4  text-gray-700">Enrolled Students</h2>
      {/* Table Section */}
      <div className="overflow-hidden rounded-md bg-white border border-gray-300 ">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">#</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Student Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Course Title</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{index + 1}</td>
                <td className="px-4 py-2 text-sm flex items-center">
                  <img
                    src={item.student.imageUrl}
                    alt={item.student.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <span>{item.student.name}</span>
                </td>
                <td className="px-4 py-2 text-sm">{item.courseTitle}</td>
                <td className="px-4 py-2 text-sm">{new Date(item.purchaseDate).toLocaleDateString()}</td>
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

export default StudentEnrolled;
