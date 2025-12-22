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
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "admin",
    work_date: new Date().toISOString(),
    status: "faol",
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await AdminService.getAllAdmins({
          search: debouncedSearch,
          status,
        });
        setAdmins(data || []);
      } catch (err) {
        console.error(err);
        toast.error("Ma'lumotni olishda xatolik");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [debouncedSearch, status]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllAdmins({ search: debouncedSearch });
      setAdmins(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Ma'lumotni olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Rostdan o‘chirmoqchimisiz?")) return;
    try {
      const rawId = id || selectedAdmin?._id || selectedAdmin?.id;
      console.log("DELETE Admin -> DELETE /api/staff/deleted-admin", rawId);
      await AdminService.deleteAdmin(rawId);
      await fetchAdmins();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || err?.response?.data || err?.message;
      toast.error(msg || "O‘chirishda xatolik yuz berdi");
    }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      first_name: admin.first_name || "",
      last_name: admin.last_name || "",
      email: admin.email || "",
      password: "",
      role: admin.role || "admin",
      work_date: admin.work_date || new Date().toISOString(),
      status: admin.status || "faol",
    });
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedAdmin(null);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role: "admin",
      work_date: new Date().toISOString(),
      status: "faol",
    });
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      if (selectedAdmin) {
        const id = selectedAdmin._id || selectedAdmin.id;
        console.log("EDIT Admin -> PUT /api/staff/edited-admin", {
          id,
          ...formData,
        });
        try {
          await AdminService.editAdmin(id, formData);
          toast.success("Muvaffaqiyatli o‘zgartirildi");
        } catch (e) {
          if (e?.response?.status === 404) {
            toast.error(
              "Serverda adminni tahrirlash endpointi mavjud emas. Iltimos, backendni tekshiring."
            );
          } else throw e;
        }
      } else {
        console.log("CREATE Admin -> POST /api/staff/create-admin", formData);
        await AdminService.createAdmin(formData);
        toast.success("Admin muvaffaqiyatli qo‘shildi");
      }
      await fetchAdmins();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || err?.response?.data || err?.message;
      toast.error(msg || "Tahrirlashda xatolik yuz berdi");
    }
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
          <Button
            onClick={() => handleDelete(admin._id || admin.id)}
            className="bg-red-500 text-white"
          >
            🗑️ O‘chirish
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <div>Yuklanmoqda...</div>;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-bold">Adminlar ro‘yxati</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Qidirish..."
              className="px-3 py-2 border rounded w-64"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-black text-white rounded px-2 py-1">
              🔍
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-black text-white px-3 py-2 rounded"
          >
            + Admin Qo'shish
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
        </div>
      </div>

      <Table columns={columns} data={admins} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedAdmin ? "Adminni tahrirlash" : "Yangi admin qo'shish"}
      >
        <div className="space-y-3">
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleFormChange}
            placeholder="Ism"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleFormChange}
            placeholder="Familiya"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleFormChange}
            placeholder="Parol"
            className="w-full px-3 py-2 border rounded"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="admin">Admin</option>
            <option value="manager">Maneger</option>
          </select>

          <input
            type="date"
            name="work_date"
            value={new Date(formData.work_date).toISOString().split("T")[0]}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, work_date: e.target.value }))
            }
            className="w-full px-3 py-2 border rounded"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="faol">Faol</option>
            <option value="ishdan bo'shatilgan">Ishdan bo'shatilgan</option>
          </select>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleSaveEdit} className="bg-blue-500 text-white">
              Saqlash
            </Button>
            {selectedAdmin && (
              <Button
                onClick={() => handleDelete(selectedAdmin._id)}
                className="bg-red-500 text-white"
              >
                O‘chirish
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Adminlar;
