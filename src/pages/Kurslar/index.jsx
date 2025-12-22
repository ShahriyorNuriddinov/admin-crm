import { useEffect, useState } from "react";
import CoursesService from "../../service/courses";
import { Clock, Users, Edit2, Trash2, PauseCircle, Play } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../slice/loading";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { toast } from "react-toastify";

const Kusrlar = () => {
  const [courses, setCourses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    duration: "",
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isFreeze, setIsFreeze] = useState("");

  const loading = useSelector((state) => state.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchCourses = async () => {
    try {
      dispatch(setLoading(true));
      const is_freeze_param = isFreeze === "" ? null : isFreeze === "true";
      const res = await CoursesService.getcourses({
        search: debouncedSearch,
        status,
        is_freeze: is_freeze_param,
      });
      setCourses(res.data || []);
    } catch (err) {
      console.error("ERR:", err.response?.status);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [dispatch, debouncedSearch, status, isFreeze]);

  const handleSaveCourse = async () => {
    try {
      const payloadObj = {
        name: { name: formData.name },
        description: formData.description,
        price: formData.price,
        duration: formData.duration,
      };
      const payloadStr = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        duration: formData.duration,
      };

      if (selectedCourse) {
        const id = selectedCourse._id || selectedCourse.id;
        try {
          await CoursesService.editCourse(id, payloadObj);
        } catch (err) {
          if (err?.response) {
            await CoursesService.editCourse(id, payloadStr);
          } else throw err;
        }
        toast.success("Muvaffaqiyatli o‘zgartirildi");
      } else {
        try {
          await CoursesService.createCourse(payloadObj);
        } catch (err) {
          if (err?.response) {
            await CoursesService.createCourse(payloadStr);
          } else throw err;
        }
        toast.success("Kurs qo‘shildi");
      }

      await fetchCourses();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || err?.response?.data || err?.message;
      toast.error(msg || "Xatolik yuz berdi");
    }
  };

  if (loading) return <p>Yuklanmoqda...</p>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Kurslar</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Qidirish..."
              className="px-3 py-2 border rounded w-64"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-black text-white rounded px-2 py-1">
              🔍
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedCourse(null);
              setFormData({
                name: "",
                description: "",
                price: 0,
                duration: "",
              });
              setModalOpen(true);
            }}
            className="bg-black text-white px-3 py-2 rounded"
          >
            + Kurs Qo'shish
          </button>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            <option value="">All</option>
            <option value="faol">Faol</option>
            <option value="nofaol">Nofaol</option>
          </select>

          <select
            value={isFreeze}
            onChange={(e) => setIsFreeze(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            <option value="">All</option>
            <option value="false">Faol</option>
            <option value="true">Muzlatilgan</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <button
                onClick={() => {
                  setSelectedCourse(course);
                  setFormData({
                    name: course.name?.name || "",
                    description: course.description || "",
                    price: course.price || 0,
                    duration: course.duration || "",
                  });
                  setModalOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-1 border border-gray-300 rounded px-2 py-1 hover:bg-gray-100"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={async () => {
                  try {
                    const id = course._id || course.id;
                    await CoursesService.deleteCourse(id);
                    toast.success("Kurs o‘chirildi");
                    fetchCourses();
                  } catch (err) {
                    console.error(err);
                    const msg =
                      err?.response?.data?.message ||
                      err?.response?.data ||
                      err?.message;
                    toast.error(msg || "O‘chirishda xatolik");
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1 bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" /> O'chirish
              </button>
              <button
                onClick={async () => {
                  try {
                    if (course.is_freeze) {
                      await CoursesService.unfreezeCourse(
                        course._id || course.id
                      );
                      toast.success("Kurs tiklandi");
                    } else {
                      await CoursesService.freezeCourse(
                        course._id || course.id
                      );
                      toast.success("Kurs muzlatildi");
                    }
                    await fetchCourses();
                  } catch (err) {
                    console.error(err);
                    toast.error("Xatolik yuz berdi");
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-600"
              >
                {course.is_freeze ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <PauseCircle className="w-4 h-4" />
                )}{" "}
                {course.is_freeze ? "Tiklash" : "Muzlatish"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedCourse ? "Kursni tahrirlash" : "Yangi kurs qo'shish"}
      >
        <div className="space-y-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Kurs nomi"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Tavsif"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                price: Number(e.target.value),
              }))
            }
            placeholder="Narx"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, duration: e.target.value }))
            }
            placeholder="Davomiylik"
            className="w-full px-3 py-2 border rounded"
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalOpen(false)}>Bekor qilish</Button>
            <Button
              onClick={handleSaveCourse}
              className="bg-blue-500 text-white"
            >
              Saqlash
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Kusrlar;
