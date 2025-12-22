import { useEffect, useState } from "react";
import Teachers from "../../service/teachers";
import Courses from "../../service/courses";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../slice/loading";
import { toast } from "react-toastify";

const Ustozlar = () => {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    course_id: "",
    role: "",
    field: "",
    active: true,
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");

  const loading = useSelector((state) => state.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchTeachers = async () => {
    try {
      dispatch(setLoading(true));
      const res = await Teachers.getTeachers({
        search: debouncedSearch,
        status,
      });
      setTeachers(res?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("O‘qituvchilarni yuklashda xatolik");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [debouncedSearch, status]);

  const fetchCourses = async () => {
    try {
      const res = await Courses.getcourses({ limit: 100 });
      setCourses(res?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Kurslarni yuklashda xatolik");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openCreateModal = () => {
    setSelectedTeacher(null);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      course_id: "",
      role: "",
      field: "",
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({ ...teacher, password: "" });
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      if (!selectedTeacher) {
        if (!formData.phone || !formData.password || !formData.course_id) {
          toast.error("Telefon, parol va kursni tanlash talab qilinadi");
          return;
        }
      }

      if (selectedTeacher) {
        const id = selectedTeacher._id || selectedTeacher.id;
        await Teachers.editTeacher(id, formData);
        toast.success("O‘qituvchi muvaffaqiyatli o‘zgartirildi");
      } else {
        await Teachers.createTeacher(formData);
        toast.success("O‘qituvchi muvaffaqiyatli qo‘shildi");
      }

      await fetchTeachers();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      let msg = "Saqlashda xatolik";
      if (err?.response?.data) {
        const data = err.response.data;
        if (typeof data === "string") msg = data;
        else if (data.message) msg = data.message;
        else msg = JSON.stringify(data);
      } else if (err?.message) msg = err.message;
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedTeacher) return;
      const id = selectedTeacher._id || selectedTeacher.id;
      await Teachers.deleteTeacher(id);
      toast.success("O‘qituvchi o‘chirildi");
      await fetchTeachers();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      let msg = "O‘chirishda xatolik";
      if (err?.response?.data) {
        const data = err.response.data;
        if (typeof data === "string") msg = data;
        else if (data.message) msg = data.message;
        else msg = JSON.stringify(data);
      } else if (err?.message) msg = err.message;
      toast.error(msg);
    }
  };

  const columns = [
    { title: "Ism", dataIndex: "first_name" },
    { title: "Familiya", dataIndex: "last_name" },
    { title: "Email", dataIndex: "email" },
    { title: "Telefon", dataIndex: "phone" },
    {
      title: "Holati",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {row.status || (row.active ? "faol" : "nofaol")}
        </span>
      ),
    },
    {
      title: "Amallar",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setSelectedTeacher(row);
              handleDelete();
            }}
            className="bg-red-500 text-white"
          >
            🗑️ O‘chirish
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">O‘qituvchilar ro'yxati</h1>

      <div className="mb-4 flex items-center gap-3">
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Qidirish..."
              className="px-3 py-2 border rounded w-64"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="bg-black text-white px-3 py-2 rounded"
          >
            + Ustoz Qo'shish
          </button>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            <option value="">All</option>
            <option value="faol">Faol</option>
            <option value="ishdan bo'shatilgan">ishdan bo'shatilgan</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center w-full">
          <p>Yuklanmoqda...</p>
        </div>
      ) : (
        <Table columns={columns} data={teachers} />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedTeacher ? "Tahrirlash/O‘chirish" : "Yangi o‘qituvchi qo‘shish"}
      >
        <div className="space-y-3">
          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleFormChange}
            placeholder="Ism"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleFormChange}
            placeholder="Familiya"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="role"
            value={formData.role}
            onChange={handleFormChange}
            placeholder="Role"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="field"
            value={formData.field}
            onChange={handleFormChange}
            placeholder="Field"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleFormChange}
            placeholder="Telefon raqam"
            className="w-full px-3 py-2 border rounded"
          />
          {!selectedTeacher && (
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              placeholder="Parol"
              className="w-full px-3 py-2 border rounded"
            />
          )}
          <select
            name="course_id"
            value={formData.course_id}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">-- Kursni tanlang --</option>
            {courses.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleFormChange}
            />
            Faol
          </label>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleSave} className="bg-blue-500 text-white">
              Saqlash
            </Button>
            {selectedTeacher && (
              <Button onClick={handleDelete} className="bg-red-500 text-white">
                O‘chirish
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Ustozlar;
