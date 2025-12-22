import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Students from "../../service/students";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../slice/loading";
import { toast } from "react-toastify";

const Studentlar = () => {
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "" });

  const loading = useSelector(state => state.loading);
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));
      const res = await Students.getStudents();
      setStudents(res?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Talabalarni yuklashda xatolik");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (student) => {
    setSelected(student);
    setForm({ ...student });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      await Students.editStudent(selected.id, form);
      setStudents(students.map(s => s.id === selected.id ? { ...s, ...form } : s));
      setModalOpen(false);
      toast.success("Muvaffaqiyatli o‘zgartirildi");
    } catch (err) {
      console.error(err);
      toast.error("Tahrirlashda xatolik");
    }
  };

  const handleDelete = async () => {
    try {
      await Students.deleteStudent(selected.id);
      setStudents(students.filter(s => s.id !== selected.id));
      setModalOpen(false);
      toast.success("O‘chirildi");
    } catch (err) {
      toast.error("O‘chirishda xatolik");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Ism", dataIndex: "first_name" },
    { title: "Familiya", dataIndex: "last_name" },
    { title: "Email", dataIndex: "email" },
    { title: "Telefon", dataIndex: "phone" },
    { title: "Holati", dataIndex: "status" },
    {
      title: "Amallar",
      render: (row) => (
        <div className="flex gap-2">
          <Button onClick={() => openModal(row)}>✏️ Tahrirlash</Button>
          <Button onClick={() => { setSelected(row); setModalOpen(true); }} className="bg-red-500 text-white">🗑️ O‘chirish</Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Studentlar ro'yxati</h1>
      <Table columns={columns} data={students} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? "Tahrirlash/O‘chirish" : ""}>
        {selected && (
          <div className="space-y-3">
            <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="Ism" className="w-full px-3 py-2 border rounded" />
            <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Familiya" className="w-full px-3 py-2 border rounded" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full px-3 py-2 border rounded" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Telefon" className="w-full px-3 py-2 border rounded" />
            <div className="flex justify-end gap-2">
              <Button onClick={() => setModalOpen(false)}>Bekor qilish</Button>
              <Button onClick={handleSave} className="bg-blue-500 text-white">Saqlash</Button>
              <Button onClick={handleDelete} className="bg-red-500 text-white">O‘chirish</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Studentlar;
