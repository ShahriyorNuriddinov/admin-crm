import { useEffect, useState } from "react";
import Manager from "../../service/maneger";
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
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
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

  useEffect(() => {
    const load = async () => {
      try {
        dispatch(setLoading(true));
        const res = await Manager.getmaneger({
          search: debouncedSearch,
          status,
        });
        setTeachers(res.data || []);
      } catch (err) {
        console.error("ERR:", err.response?.status);
        toast.error("O‘qituvchilarni olishda xatolik");
      } finally {
        dispatch(setLoading(false));
      }
    };
    load();
  }, [dispatch, debouncedSearch, status]);

  const fetchTeachers = async () => {
    try {
      dispatch(setLoading(true));
      const res = await Manager.getmaneger({ search: debouncedSearch });
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

  const openCreateModal = () => {
    setSelectedTeacher(null);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      role: "",
      active: true,
    });
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      if (selectedTeacher) {
        const id = selectedTeacher._id || selectedTeacher.id;
        console.log("EDIT Manager -> PUT /api/staff/edited-manager", {
          id,
          ...formData,
        });
        await Manager.editManager(id, formData);
        toast.success("Muvaffaqiyatli o‘zgartirildi");
      } else {
        console.log(
          "CREATE Manager -> POST /api/staff/create-manager",
          formData
        );
        await Manager.createManager(formData);
        toast.success("Manager muvaffaqiyatli qo‘shildi");
      }
      await fetchTeachers();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || err?.response?.data || err?.message;
      toast.error(msg || "Tahrirlashda xatolik yuz berdi");
    }
  };

  const handleDelete = async () => {
    try {
      const id = selectedTeacher._id || selectedTeacher.id;
      console.log(
        "DELETE Manager -> DELETE /api/staff/deleted-staff or /deleted-admin",
        id
      );
      await Manager.deleteManager(id);
      await fetchTeachers();
      setModalOpen(false);
      toast.success("O‘qituvchi o‘chirildi");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || err?.response?.data || err?.message;
      toast.error(msg || "O‘chirishda xatolik");
    }
  };

  const columns = [
    { title: "Ism", dataIndex: "first_name" },
    { title: "Familiya", dataIndex: "last_name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Holati",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.active ? "Faol" : "Nofaol"}
        </span>
      ),
    },
    {
      title: "Role",
      render: (row) => (
        <span className="uppercase text-xs font-semibold">{row.role}</span>
      ),
    },
    {
      title: "Amallar",
      render: (row) => (
        <div className="flex gap-2">
          <Button onClick={() => openEditModal(row)}>✏️ Tahrirlash</Button>
          <Button
            onClick={() => {
              setSelectedTeacher(row);
              setModalOpen(true);
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
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">O‘qituvchilar ro‘yxati</h1>

      <div className="mb-4 flex items-center gap-3">
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
            + Meneger Qo'shish
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
        title={
          selectedTeacher ? "Tahrirlash/O‘chirish" : "Yangi Meneger qo'shish"
        }
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
            type="text"
            name="role"
            value={formData.role}
            onChange={handleFormChange}
            placeholder="Role"
            className="w-full px-3 py-2 border rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleFormChange}
            />{" "}
            Faol
          </label>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleSaveEdit} className="bg-blue-500 text-white">
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

export default Manegerlar;
