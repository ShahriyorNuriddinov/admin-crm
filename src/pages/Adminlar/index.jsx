import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import AdminService from "../../service/admin";
import { toast } from "react-toastify";

const Adminlar = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({ first_name: "", email: "", status: "faol" });

  useEffect(() => { fetchAdmins(); }, []);

  const fetchAdmins = async () => {
    try { setLoading(true); const data = await AdminService.getAllAdmins(); setAdmins(data || []); } 
    catch (err) { console.error(err); toast.error("Ma'lumotni olishda xatolik"); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Rostdan o‘chirmoqchimisiz?")) return;
    try { await AdminService.deleteAdmin(id); setAdmins(admins.filter(a => a._id !== id)); } 
    catch (err) { console.error(err); toast.error("O‘chirishda xatolik yuz berdi"); }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({ first_name: admin.first_name, email: admin.email, status: admin.status });
    setModalOpen(true);
  };

  const handleFormChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSaveEdit = async () => {
    try {
      await AdminService.editAdmin(selectedAdmin._id, formData);
      setAdmins(admins.map(a => a._id === selectedAdmin._id ? { ...a, ...formData } : a));
      setModalOpen(false);
      toast.success("Muvaffaqiyatli o‘zgartirildi");
    } catch (err) { console.error(err); toast.error("Tahrirlashda xatolik yuz berdi"); }
  };

  const columns = [
    { title: "Ism", dataIndex: "first_name" },
    { title: "Email", dataIndex: "email" },
    { title: "Status", dataIndex: "status" },
    { 
      title: "Amallar", 
      render: (admin) => (
        <div className="flex gap-2">
          <Button onClick={() => openEditModal(admin)}>✏️ Tahrirlash</Button>
          <Button onClick={() => handleDelete(admin._id)} className="bg-red-500 text-white">🗑️ O‘chirish</Button>
        </div>
      ) 
    },
  ];

  if (loading) return <div>Yuklanmoqda...</div>;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Adminlar ro‘yxati</h1>
      <Table columns={columns} data={admins} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Adminni tahrirlash">
        <div className="space-y-3">
          <input type="text" name="first_name" value={formData.first_name} onChange={handleFormChange} placeholder="Ism" className="w-full px-3 py-2 border rounded" />
          <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="Email" className="w-full px-3 py-2 border rounded" />
          <select name="status" value={formData.status} onChange={handleFormChange} className="w-full px-3 py-2 border rounded">
            <option value="faol">Faol</option>
            <option value="ishdan bo'shatilgan">Ishdan bo'shatilgan</option>
          </select>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleSaveEdit} className="bg-blue-500 text-white">Saqlash</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Adminlar;
