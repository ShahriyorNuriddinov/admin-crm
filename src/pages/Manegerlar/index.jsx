import { useEffect, useState } from "react";
import Teachers from "../../service/teachers";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../slice/loading";
import { toast } from "react-toastify";

const Manegerlar = () => {
  const [teachers, setTeachers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "", role: "", active: true });
  
  const loading = useSelector((state) => state.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchTeachers();
  }, [dispatch]);

  const fetchTeachers = async () => {
    try {
      dispatch(setLoading(true));
      const res = await Teachers.getTeachers();
      setTeachers(res.data || []);
    } catch (err) {
      console.error("ERR:", err.response?.status);
      toast.error("O‘qituvchilarni olishda xatolik");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({ ...teacher });
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSaveEdit = async () => {
    try {
      await Teachers.editTeacher(selectedTeacher.id, formData);
      setTeachers(teachers.map(t => t.id === selectedTeacher.id ? { ...t, ...formData } : t));
      setModalOpen(false);
      toast.success("O‘qituvchi muvaffaqiyatli o‘zgartirildi");
    } catch (err) {
      console.error(err);
      toast.error("Tahrirlashda xatolik yuz berdi");
    }
  };

  const handleDelete = async () => {
    try {
      await Teachers.deleteTeacher(selectedTeacher.id);
      setTeachers(teachers.filter(t => t.id !== selectedTeacher.id));
      setModalOpen(false);
      toast.success("O‘qituvchi o‘chirildi");
    } catch (err) {
      console.error(err);
      toast.error("O‘chirishda xatolik");
    }
  };

  const columns = [
    { title: "Ism", dataIndex: "first_name" },
    { title: "Familiya", dataIndex: "last_name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Holati",
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${row.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {row.active ? "Faol" : "Nofaol"}
        </span>
      ),
    },
    {
      title: "Role",
      render: (row) => <span className="uppercase text-xs font-semibold">{row.role}</span>,
    },
    {
      title: "Amallar",
      render: (row) => (
        <div className="flex gap-2">
          <Button onClick={() => openEditModal(row)}>✏️ Tahrirlash</Button>
          <Button onClick={() => { setSelectedTeacher(row); setModalOpen(true); }} className="bg-red-500 text-white">🗑️ O‘chirish</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">O‘qituvchilar ro‘yxati</h1>
      {loading ? <div className="flex items-center w-full"><p>Yuklanmoqda...</p></div> : <Table columns={columns} data={teachers} />}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedTeacher ? "Tahrirlash/O‘chirish" : ""}>
        {selectedTeacher && (
          <div className="space-y-3">
            <input type="text" name="first_name" value={formData.first_name} onChange={handleFormChange} placeholder="Ism" className="w-full px-3 py-2 border rounded" />
            <input type="text" name="last_name" value={formData.last_name} onChange={handleFormChange} placeholder="Familiya" className="w-full px-3 py-2 border rounded" />
            <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="Email" className="w-full px-3 py-2 border rounded" />
            <input type="text" name="role" value={formData.role} onChange={handleFormChange} placeholder="Role" className="w-full px-3 py-2 border rounded" />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="active" checked={formData.active} onChange={handleFormChange} /> Faol
            </label>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setModalOpen(false)}>Bekor qilish</Button>
              <Button onClick={handleSaveEdit} className="bg-blue-500 text-white">Saqlash</Button>
              <Button onClick={handleDelete} className="bg-red-500 text-white">O‘chirish</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Manegerlar;
