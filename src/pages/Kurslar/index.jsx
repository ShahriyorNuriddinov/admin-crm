import { useEffect, useState } from "react";
import CoursesService from "../../service/courses";
import { Clock, Users, Edit2, Trash2, PauseCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../slice/loading";
const Kusrlar = () => {
  const [courses, setCourses] = useState([]);
  const loading = useSelector((state) => state.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    CoursesService.getcourses()
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        console.error("ERR:", err.response?.status);
      })
      .finally(() => dispatch(setLoading(false)));
  }, [dispatch]);

  if (loading) return <p>Yuklanmoqda...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {courses.map((course) => (
        <div
          key={course._id}
          className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-lg font-bold">{course.name.name}</h2>
            <p className="text-gray-500 text-sm">{course.description}</p>
          </div>

          <div className="flex justify-between items-center my-2">
            <span className="text-gray-700 font-medium text-sm">
              {course.price.toLocaleString()} UZS
            </span>
          </div>

          <div className="flex justify-between items-center text-gray-600 text-sm mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>15 students</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1 border border-gray-300 rounded px-2 py-1 hover:bg-gray-100">
              <Edit2 className="w-4 h-4" /> Edit
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600">
              <Trash2 className="w-4 h-4" /> O'chirish
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-600">
              <PauseCircle className="w-4 h-4" /> Muzlatish
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Kusrlar;
